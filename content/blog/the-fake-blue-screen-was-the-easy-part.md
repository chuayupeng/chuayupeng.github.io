---
title: "The Fake Blue Screen Was the Easy Part"
excerpt: "I built a ClickFix simulator for a security-awareness exercise, then discovered how much my dashboard was assuming."
date: "2026-10-05"
category: ["cybersecurity", "teaching"]
author: "yup.eng"
image: "/blogBanner/teachBanner.png"
---

For an authorised security-awareness exercise, I spent an evening making a website pretend Windows had broken. I cannot claim much originality there. The trick is called ClickFix: the page offers a command to fix the supposed problem and persuades you to run it yourself. It is very helpful about solving the problem it just invented.

Participants received an email leading to a simulated verification page.

![The simulator's imitation verification page, shown on localhost.](/blogImg/clickfix-1-verify.jpg)

*The verification page in the local demo.*

That led to a fake Windows blue screen, which presented the simulation command as the fix. Following its instructions led to a training page explaining what had happened.

![The fake Windows blue screen used in the security-awareness simulation.](/blogImg/clickfix-2-bsod.jpg)

*The simulated error screen. The browser was displaying a webpage; Windows hadn't crashed.*

The command was limited to opening that page and sending information back to the simulation server to help associate the visit with the exercise. It did not download another program or change files. The aim was to give people a controlled encounter with the trick and something useful to learn from afterwards.

I also wanted to know how far people got. Did they open the email, visit the page, follow the instructions, or reach the explanation? I built a dashboard with those four stages and labelled the last two “command run” and “training completed.” Four labels, four numbers, a nice little funnel. At a glance, it looked as though I knew what was happening.

![The four-stage simulation dashboard populated with synthetic demo events.](/blogImg/clickfix-4-dashboard.jpg)

*A local demo with synthetic data. The numbers shown here are illustrative; the two callback records discussed below came from the exercise log. The labels shown are the ones I later had to question.*

The trouble started when I checked what those numbers were based on.

## What counted as running the command

The dashboard showed two command executions. Both records had a username of `%USERNAME%` and a computer name of `%COMPUTERNAME%`. Those were placeholders that Windows was supposed to replace with values from the person's computer.

Unless someone had been very committed to naming their machine after a Windows environment variable, this needed another look.

The command changed during the build. An earlier version sent a separate tracking request, or callback, to the server. The version used in the exercise opened a tracking URL in the default browser. The server recorded that request and redirected the browser to the training page. The training page had its own separate event, recorded when its code loaded.

I treated a request to that URL as confirmation that the command had run. There was no check that the values had expanded. There was no separate category for an automated fetch. The server received a request and wrote an event called `executed`.

That left a fairly large assumption between what the server saw and what the dashboard claimed.

The two callback records arrived less than a second apart. Both retained the placeholders, and both identified themselves as Slack's link-preview bot. There was no recorded training-page event afterwards. My dashboard had counted the tracking requests as command executions without establishing that anyone had run the command.

Slack's documentation describes how it fetches URLs found in messages to build previews. A URL inside command text can therefore attract a request without anyone running the surrounding command. That fits these records; it does not require Slack to read a clipboard or launch a shell. [Unfurling links in messages](https://docs.slack.dev/messaging/unfurling-links-in-messages/)

I cannot tell from this log who shared the text, whether they shared the whole command, or why. Someone checking with a colleague is one possible explanation, but it would be convenient to turn that into a story without checking. The records support a narrower conclusion: these were not validated command executions, and I had labelled them as such.

## What forwarding did to the open count

The email-open count had two problems, pulling it in opposite directions.

In the mail setup used for this exercise, images from untrusted senders weren't loaded by default. The tracking pixel was an image. Someone could read the email without loading it, leaving me with no pixel event for a message they had actually seen.

Then people forwarded the suspicious email to the infosec team to report it. The forwarded copy still contained the pixel, but it was now arriving from a trusted internal sender. Images loaded in the infosec team members' inboxes, and the pixel started firing there instead.

As the report travelled along forwarding chains, copies of the same pixel ended up in multiple inboxes and generated more requests. Those requests did not represent more original recipients reading the simulation email. They included the infosec team handling reports about it.

So I could miss someone reading the original email, then count the activity generated by them reporting it. I had accidentally given the infosec team's inboxes a supporting role in my campaign statistics.

The pixel established that an image had been fetched. Between blocked images and forwarded copies, it couldn't reliably tell me whether the intended recipient had read the email, or how many people had done so. Reporting a suspicious message was useful behaviour; it deserved to be recorded as a report, rather than contributing unexplained activity to the open count.

## The rest of the funnel

The landing-page event fired when the page loaded. That was better evidence of a visit than the pixel, but it still did not establish that a person had deliberately clicked. Some requests had no usable recipient identifier, and many had patterns consistent with automated scanning. The application had not recorded enough to explain exactly where the missing attribution had gone.

I also lacked a reliable count of who had been sent the email, who had received it, and who could complete the exercise. The command was intended for Windows. Someone opening the email on an iPhone could reach the page without being able to follow that flow. Linux users may have had a few questions about how Windows had managed to crash on a machine it wasn't installed on. A percentage would need to account for those differences.

I had spent time making the page look like a convincing failure and rather less time deciding what a convincing success would look like in the logs.

## What needs changing

The first fix is the least exciting: name the events after what they actually record. `Callback requested` is a less satisfying dashboard label than `Ran the command`, but it is the one the evidence supports.

Automated requests should remain visible without counting against a participant. Missing values and unexpanded placeholders should put a callback into an uncertain or automated category. A training page loading should be recorded as a page load; it should not quietly become proof that someone read and understood it.

The pixel needs the same restraint. Removing repeat requests would not recover the reads hidden by image blocking, or establish which inbox loaded a forwarded copy. I'd keep image retrieval separate from claims about readership, and account for reports to infosec as their own outcome.

Linking events from the same visit and checking that their values make sense could help reduce accidental matches. Those checks would still only tell me about the requests my server received. Claiming that a command ran on someone's computer would need independent evidence.

The exercise also needs a reliable recipient list and a clear explanation of who each percentage includes. Preferably before I spend another evening adjusting the fake blue screen.

![The simulation's debrief page explaining the fake error screen and the training exercise.](/blogImg/clickfix-3-reveal.jpg)

*The intended debrief page, shown in a local preview. Some command annotations still describe the earlier version. This screenshot demonstrates the page design, not evidence that participants reached it.*

In the reviewed log, there were no validated command executions and no recorded training completion. That is what I can report. Whether everyone spotted the trick is a different question, and these logs do not answer it.

There are a few more scenarios I'd like to try, and I don't particularly fancy rebuilding the tracking and reporting every time. A proper platform would make these exercises easier to run for larger groups and leave me more time for the interesting bits. I'll need to sort out the counting first, though. No point scaling up my ability to be confidently wrong.
