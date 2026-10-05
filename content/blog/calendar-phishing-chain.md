---
title: "A Calendar That Lies: ICS Injection, OAuth Laundering, and a Fake Teams Button"
excerpt: "Inside a calendar-based phishing simulation: the invitation, the redirects, and the security tools that inflated my click count."
date: "2026-03-26"
category: ["cybersecurity", "teaching"]
author: "yup.eng"
image: "/blogBanner/potionBanner.png"
---

## The Background

A while back, I designed and ran a phishing simulation for a client spread across several offices. The brief was to make it challenging. I went with a calendar invitation. Another meeting nobody had asked for seemed an appropriate place to start.

The invitation led to a simulated sign-in page, with familiar meeting branding along the way. I wanted to see how the organisation handled a suspicious request presented as part of an ordinary workday: something on the calendar, a meeting to join, another login to get through.

Building it was one part of the exercise. Working out who had actually interacted with it became another. The raw click count was several times higher than the number we eventually attributed to people. Quite an impressive result, provided I was willing to count the client's security tools as employees.

## The Build

There were four parts to it: an iCalendar invitation, Outlook's meeting presentation, an OAuth redirect through Microsoft Entra, and a simulated sign-in page. Each involved a different question: who supplied the event, who rendered the button, which site the browser reached, and what the resulting request actually proved.

### 1. Calendar requests via ICS

The message contained structured iCalendar data, carried as `text/calendar`. That matters because the mail client can process it as a scheduling request instead of displaying it only as email text.

Two protocol fields are worth distinguishing. `METHOD:REQUEST` identifies a scheduling request; `PARTSTAT=NEEDS-ACTION` describes an attendee who has not yet responded. They describe the event and participation state. They do not authenticate the organiser or establish that the recipient has accepted the meeting. Those meanings come from [iTIP's request definition](https://www.rfc-editor.org/rfc/rfc5546.html#section-3.2.2) and [iCalendar's participation-status definition](https://www.rfc-editor.org/rfc/rfc5545.html#section-3.2.12).

In the configuration we tested, the invitation could appear in the calendar before the recipient accepted it. Sender-supplied content had acquired a place alongside the person's other meetings. It could also remain there after the original email disappeared down the inbox.

That was the useful distinction for the exercise: delivery, calendar placement and acceptance were separate events. Seeing something on the calendar did not mean the user had already approved it.

### 2. The Teams button

I sent the invitation on behalf of someone at the client company. Outlook and Teams filled in the metadata automatically, making the result look much more like an ordinary internal meeting. A fair amount of the realism came from the software itself.

Outlook also rendered a native Teams join button. The button and the simulation's landing-page link were separate destinations. One provided familiar meeting presentation; the other led to the page where we recorded interaction.

The important separation was between rendering and validation. A client can recognise meeting metadata and draw its usual controls without that appearance proving the organiser is legitimate or endorsing every other link in the event. The familiar button belonged to Outlook's interface. The surrounding invitation content came from the sender.

Outlook had helpfully supplied the corporate stationery.

### 3. The OAuth redirect

The navigation also passed through Microsoft's real Entra authorisation service before reaching the simulation site. The initial Microsoft hostname and the final page's origin were two separate things, even if the browser moved between them quickly.

In the normal OAuth flow, the application identifies itself to the authorisation server and supplies a callback destination. Entra checks that destination against the application's registered redirect URIs. That is a configuration check, not a promise that Microsoft operates or endorses the destination. Microsoft's [redirect URI documentation](https://learn.microsoft.com/en-us/entra/identity-platform/reply-url) spells out that registration requirement.

Navigation also needs to be separated from authentication. A browser reaching a callback is not, by itself, evidence of a successful sign-in, consent grant or issued access token. The response can represent an error. Similarly, a request for silent authentication suppresses interactive prompts; if user interaction is required, the service returns an error rather than quietly satisfying the requirement. That's described in Microsoft's [authorisation-flow documentation](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow).

For a defender reviewing this kind of traffic, the useful evidence is the full navigation path: the initial URL, subsequent responses and final origin. Finding a Microsoft hostname at the start is not enough to classify everything after it as safe. It also doesn't mean security products are incapable of inspecting the rest of the journey.

### 4. The landing page and submission data

The landing page resembled the familiar two-stage sign-in flow: email first, then password. Password values weren't stored. For submissions, we recorded character count and the number of distinct characters, intending to distinguish plausible entries from obvious test input.

Those are input-shape measurements. They are not password verification or an entropy estimate. An invented string can look perfectly plausible by both measures. A submission showed that something had been entered into the form; it did not establish that the string was the recipient's real password or that an account had been compromised.

That distinction belongs in the event names as well as the report. Calling a form submission a successful compromise would be giving the dashboard a promotion it hadn't earned.

## The Run

Much of the activity we attributed to users fell within the first hour. We saw visits and progression to form submission, which gave us something useful to discuss with the client. The timestamps couldn't tell us whether a particular visit followed a reminder, a calendar check or simple curiosity.

The reporting needed to distinguish three levels of evidence:

| Measurement | What it can support | What it doesn't establish |
| --- | --- | --- |
| Landing-page request | A client fetched the destination | The recipient personally clicked |
| Visit classified as likely human | The request fits the evidence used for that classification | Certainty about the visitor's identity or motive |
| Recorded form submission | The form received input | A valid password, successful login or compromised account |

### The Noise Problem

The biggest complication was that the security tools were visiting too. Mail-security and reputation services inspected the links and their destinations, producing requests in the same logs as the participants.

There were two noticeable patterns in the traffic: activity close to delivery, and another cluster arriving later. The browser metadata in those clusters also differed from the organisation's usual browser fleet. Comparing request timing with the `User-Agent` values helped us classify likely automated traffic after the run.

The raw totals were several times higher than the count we eventually attributed to people. That is quite a difference to discover before telling a client how badly their staff did.

The classification still had limits. A `User-Agent` is a claim made by the requesting client, not an identity check, and timing can overlap. It was useful evidence in combination with the other observations, not a universal rule for recognising a scanner. Ambiguous requests needed to remain ambiguous.

Microsoft documents the same reporting problem in its [attack simulation FAQ](https://learn.microsoft.com/en-us/defender-office-365/attack-simulation-training-faq): security applications can generate apparent clicks and compromise events while inspecting simulation content. Forwarded messages can be inspected again, with the resulting event attributed to the original recipient through their tracking URL.

That last point is an attribution problem. A recipient-specific link identifies who the link was issued to; it doesn't authenticate whoever fetched it. A forwarded copy can carry the same identifier into another inbox. The report can therefore attach an event to the right link and still attach it to the wrong person.

For the next report, I'd make the counting rules explicit before the exercise. I'd count distinct recipient identifiers associated with at least one likely-human visit, divided by successfully delivered recipients. That gives a rate attributed to issued links; forwarding can still complicate who was behind each visit. Submission rates should also count distinct identifiers, with the denominator stated: visitors and all delivered recipients answer different questions. Repeat requests, likely scanner traffic and unresolved events should be reported separately.

The count changed substantially once we accounted for automated traffic. The explanation of that filtering belonged beside the percentage, not buried in my notes.

## The Conclusion

The useful finding was how many separate systems sat behind an apparently ordinary meeting invitation. Calendar processing determined whether the event appeared. Outlook rendered the meeting controls. The identity service handled a redirect. Each could be doing its own job while the final destination still belonged to the simulation.

I'd focus the follow-up on three areas:

- **Calendar handling.** Check how external invitations are displayed and processed in the actual mailbox and client configuration. A room-mailbox setting is not automatically a fix for every employee's calendar: Microsoft's [`Set-CalendarProcessing` documentation](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/set-calendarprocessing?view=exchange-ps) explicitly limits the cmdlet's effect to resource mailboxes.
- **Identity and destination checks.** Review application registrations, consent controls and redirect destinations, and use phishing-resistant authentication where supported. [FIDO2 passkeys](https://learn.microsoft.com/en-us/entra/identity/authentication/concept-authentication-passkeys-fido2) bind authentication to the legitimate site, so a copied sign-in page on another origin can't use that site's passkey. That protects the authentication step; it doesn't make every link or download safe.
- **Measurement.** Separate requests, likely human visits and submissions. Validate the classification against available mail-security records, retain uncertainty, and state the denominator. Those are reporting improvements I'd want in the next run, not assumptions to hide behind a tidy chart.

I still think the calendar was the interesting part of this exercise. It put the suspicious request among things people were already expected to act on, with several different systems contributing familiar pieces of the interface. The reporting then reminded me that those systems were participating in the exercise too. Apparently the security tools had accepted the invitation with considerable enthusiasm.
