---
title: "A Calendar That Lies: ICS Injection, OAuth Laundering, and a Fake Teams Button"
excerpt: "Four trust signals compounding into one click — how a phishing simulation chained calendar auto-add, a fake Teams button, OAuth redirect laundering, and a Microsoft-branded credential page to walk past every instinct the user had."
date: "2026-03-26"
category: ["cybersecurity", "teaching"]
author: "yup.eng"
image: "/blogBanner/potionBanner.png"
---

## The Background
A while back I had the chance to design and run a phishing simulation against a client, distributed across multiple offices. The brief was to make it *hard* — something that would actually exercise the org's instincts rather than catch the bottom-tier "I'll click anything" crowd.

Threat intel for the year was pretty clear about where to look. Calendar-based phishing was trending hard: Check Point flagged a 4,000-email campaign over Google Calendar in December 2024, Sublime's ICS write-up reported a 59% bypass rate against traditional Secure Email Gateways, and Microsoft had attributed fake Teams meeting invites to Storm-2372. CVE-2025-27915 (Zimbra `.ics` JS execution) and CVE-2023-35636 (NTLM hash leak via calendar share) were both reminders that the calendar is no longer a passive surface. So the design was easy: build a calendar lure, stack as many trust signals on top of it as we could find, and see what happened.

## The Build
The chain ended up being four distinct pieces. None of them are individually novel — they're all in the public threat-intel record — but they compound interestingly when you stack them in sequence.

### 1. Calendar Injection via ICS
The lure isn't an email body; it's an iCalendar attachment served as an inline `text/calendar` MIME part with `METHOD:REQUEST` set. Outlook's default behaviour is to auto-add the event to the user's calendar without any click, download, or accept gesture. The event sits there alongside everything else on the user's day, complete with `PARTSTAT=NEEDS-ACTION` to generate the familiar accept/decline prompt.

What's interesting isn't the technique — it's the psychology. Email is suspicious by default; people have been trained for two decades to hover over links and squint at sender addresses. Calendar events occupy a different cognitive bucket — they feel like *commitments*, like things someone scheduled for a reason. The trust evaluation is much shorter. And the event persists: long after the originating email gets buried, the calendar entry keeps surfacing through reminders.

### 2. The Fake Teams Button
There's a vendor-specific iCalendar property called `X-MICROSOFT-SKYPETEAMSMEETINGURL`. When it's set to a URL matching the `teams.microsoft.com/l/meetup-join/` pattern, Outlook renders a native "Join Microsoft Teams Meeting" button — Teams logo, branded purple, the works. The property exists for legitimate Teams meetings created through Exchange, but Outlook does no validation on whether the meeting actually exists.

So you point the property at a Teams URL with zeroed-out meeting identifiers and you get a perfect Teams button that goes nowhere. The *real* phishing link goes elsewhere — the `LOCATION` field or the email body — by which point the Teams button has already done the trust-anchoring work. The button is a visual TLS-cert equivalent: it signals legitimacy through a channel most users have never thought to question.

Documented since 2021 (Ex Android Dev's writeup), publicly weaponised in December 2025 by Tarlogic with their open-source tool Tangled. Microsoft attributes the same pattern to Storm-2372. Plenty of company.

### 3. OAuth Redirect Laundering
The phishing link doesn't point to a sketchy domain. It points to `login.microsoftonline.com` — Microsoft's real Azure AD endpoint:

```
https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize
  ?client_id={app_id}
  &scope={invalid_scope}
  &redirect_uri=https://{attacker}/oauth/land
  &login_hint={target_email}
  &prompt=none
```

Three things happen in sequence:

1. **URL passes inspection.** Both human review and automated URL scanners see `login.microsoftonline.com`. No blocklist on the planet flags it.
2. **`login_hint` pre-fills the user's email** on the Microsoft sign-in page. By the time the page renders, the user is looking at their own email next to a Microsoft logo — reinforcing the perception that this is a legitimate SSO flow already in motion.
3. **The `scope` is deliberately invalid.** Entra ID can't fulfil it, so instead of showing a consent screen it immediately redirects to `redirect_uri` — which is the attacker's harvesting page. With `prompt=none`, the user's existing Microsoft session skips the re-auth prompt, making the redirect basically invisible.

The user experiences a near-instantaneous transition from Microsoft's login page to the phishing page. By the time they're typing, the cognitive evaluation is done — they've "passed through" Microsoft already, and the rest feels like a formality.

Not novel either. Microsoft's own security blog documented this against EvilProxy-style PaaS phishing in March 2026. Volexity attributed UTA0352/UTA0355 (suspected Russian) to the same trick against European political officials in April 2025. Proofpoint reported >50% success across 900+ M365 environments using fake OAuth apps impersonating brands like RingCentral and Adobe.

### 4. The Credential Page
The landing page replicates Azure AD's two-step sign-in flow — email first (pre-filled from the `login_hint`), then password. Visual design matches Microsoft's branding. Important caveat: passwords were never stored. The page captured only two metadata values per submission — character count and unique character count — as a "did this look like a real password or just `test123`" sanity check. The averages strongly suggested real passwords, not dummy inputs.

## The Run
Most of the real clicks landed within the first hour after delivery, distributed roughly uniformly across the early time buckets. That's not a "rush of curiosity" pattern — that's people engaging with the calendar at natural intervals, when they checked their schedule, got a reminder, or opened Outlook to figure out what was on for the afternoon. Nothing rushed; just normal calendar behaviour.

The credential submission rate among the people who clicked was substantial — high enough to make clear the chain wasn't just bypassing technical controls; it was bypassing instincts. Once the user had passed through the calendar, the Teams button, and `login.microsoftonline.com`, the cognitive evaluation was done.

### The Noise Problem
The most operationally significant finding had nothing to do with user behaviour. It was about the machinery between sender and recipient.

Corporate email security gateways — Mimecast Safe Links, Defender ATP, and friends — automatically pre-fetch and scan every URL in inbound emails. By design. The scanner visits the link on behalf of the user before the user ever sees it. The problem is that these scans are *indistinguishable from real clicks* in server-side telemetry.

The raw click metrics this exercise produced were several multiples of the actual user click rate. Most of those "clicks" were scanner traffic, not humans. Two distinct scanner populations showed up:

1. **The corporate gateway** scanned URLs within seconds of delivery, using a rotating pool of older Chrome user agents.
2. **A secondary URL reputation scanner** triggered for some destinations, arriving within a few minutes of delivery with the same fingerprint.

Both had the same tell: plain Chrome capped a few versions behind the org's actual browser fleet, never Edge, never mobile. That version gap, combined with timing analysis (real clicks rarely arrive within the first quarter-hour after delivery), gave us reliable deduplication.

Known operational problem. KnowBe4 has dedicated docs on it. Keepnet covers it across Mimecast, Proofpoint, Barracuda, and Defender. Microsoft maintains Advanced Delivery policies specifically to keep Defender for Office 365 from pre-clicking simulation links. The lesson: **if your simulation platform doesn't filter for scanner prefetches, your metrics are meaningless.** A pre-filtered click rate tells leadership that training has failed. A post-filtered click rate tells them where to invest. The difference is entirely in the filtering.

## The Conclusion
The four techniques are individually documented, individually mitigated, and individually understood by most security teams. What made them effective in combination was the compounding of trust signals — each layer borrowed credibility from a more trusted source than the previous one.

1. Calendar event — trusted because it lives in the calendar, not the inbox.
2. Teams button — trusted because Outlook rendered it natively with Microsoft branding.
3. OAuth redirect — trusted because the URL was actually `login.microsoftonline.com`.
4. Credential page — trusted because the email was pre-filled and the brand matched.

At no point did the user encounter an obviously suspicious domain, an unfamiliar interface, or a request that deviated from their normal workflow. The attack lived entirely inside the user's existing trust boundaries.

Mitigations, in rough priority order:

1. **Disable automatic calendar injection for external senders.** Highest-impact single change. If external `.ics` files require manual acceptance, the entire chain collapses at step one.
2. **Deploy phishing-resistant MFA.** FIDO2 / passkeys are immune to credential harvesting because the phishing domain literally cannot complete the cryptographic challenge. The only control that renders the entire attack class ineffective regardless of user behaviour.
3. **Audit Azure AD app registrations.** The OAuth redirect technique requires a registered app with a permitted `redirect_uri`. Restricting who can register apps and auditing the existing list reduces the attack surface meaningfully.
4. **Tag external calendar invites.** An `[EXTERNAL]` banner on inbound calendar invites would break the trust model that makes ICS phishing effective.
5. **Account for scanner noise.** Any phishing simulation that doesn't filter for prefetches will produce nonsense metrics.

The less-technical takeaway: phishing isn't getting more sophisticated by adding new techniques. It's getting more sophisticated by *combining* old ones — each individually well-understood, each individually mitigable, each individually unable to spook the average user. The defenders' job is to break the *chain*, not to chase every link in it. Disabling auto-add is one cut that takes the whole thing down.
