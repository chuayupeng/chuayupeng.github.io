---
title: "The More I Dug, The More Skeletons Came Tumbling Out"
excerpt: "A curious employee, a dated HR portal, and five bugs that should not exist in 2025."
date: "2026-05-10"
category: "cybersecurity"
author: "yup.eng"
image: "/blogBanner/skellyBanner.png"
---

## The Background

For most of my working life, the encounters I have had with HR portals have been adversarial. You log in to check your leave balance. You get redirected to a session-expired page. You log in again. You get redirected to your dashboard. You get redirected to your dashboard a second time because the first redirect did not quite take. Somewhere on the third minute of clicking, you are staring at a number. Five days. Thirteen days. Whatever it is. You log out and go back to your actual job.

The portal in question this time felt like it had been forged in 2014 and never patched since. The fonts were that particular shade of arial-bold that web designers stopped using around the time smartphones became a thing. The favicon was a 16×16 GIF. The login page had a "Welcome Back!" greeting in cursive. It was, in every sense of the phrase, vibes-based legacy software.

I'm going to call it **FrostLeave** from here on, with the vendor as **GlacierHR**. The actual product is still serving most of these vulnerabilities live, and the patched one was patched silently. Anything specific in this post (endpoint shapes, payloads, key prefixes, anything you could meaningfully reproduce from) has been filed off. The story is the point.

This isn't a writeup. It's a story about logging in to check my leave balance, pulling on a thread, and watching the rest of the sweater come apart.

## The First Thread: A Magic Link That Wouldn't Die

There's a magic link option on the login page. You click it, type your work email, and the system emails you a link that logs you in directly. I used it because I had forgotten my password again. The link worked. I closed the tab.

The next morning I opened my inbox to clean it out, saw the email from yesterday, and out of pure laziness (I had already lost the new tab to a browser restart) I clicked the same link. It logged me in.

This is the part where most people would shrug. Magic links being reusable isn't categorically wrong, just lazy. But I had been working in security long enough that "this token never expires" is an itch I can't not scratch. I clicked it a third time. A week later, I clicked it a fourth.

Still working.

If a magic link is forever, what else is forever?

## Knock Knock, Who's Resetting?

I went looking for the next loose thread. Spoiler: there were a lot of them.

The first one I found was an admin reset password feature. Most password reset flows work like this: you type your email, the server confirms you own that email, then it emails you a reset link. None of that is exciting. What was exciting was that the *internal* reset feature, the one available to admin users on the user management page, was making a request that included only the *target* user's encrypted ID. No check on the requesting user. No check on the requesting user's permissions. Just "reset whoever this ID belongs to."

The function in the page bundle looked roughly like this:

```js
ResetPassword = function (data) {
    this.EditUserID = data.encUserId();
    var jsonData = toJSON(this, ['SessionKey', 'EditUserID']);
    ajax(jsonData, "/api/[redacted]/ResetUserPassword");
    // ...notify success...
};
```

That is the entire authorisation model. The browser sends `SessionKey` (yours) and `EditUserID` (anyone's), and the server emails a new password to whoever that ID points at. There's no server-side check that you're allowed to do this. You can read this in their bundle, hit the endpoint with curl from a non-admin session, and reset somebody else's password. Including the administrator's.

Then I noticed the sibling endpoint. A change password function that took a similar shape, plus one extra parameter. The body looked, with everything sensitive scrubbed, like this:

```
POST /api/[redacted]/ChangePassword
Content-Type: application/x-www-form-urlencoded

NewPassword=[new_password]
&ForUserIDStr=[target_user_id]
&SessionKey=[your_session]
&LoggedInUserID=[your_id]
&CanSendAnEmailToTheUser=false
```

`ForUserIDStr` is the target. `CanSendAnEmailToTheUser=false` is the kicker. If you set that to false, the system silently changes someone else's password without ever telling them. No "your password was changed" email. No notification. Their session keeps working until they happen to log out.

Two doors, one broken lock. The first door says "sure, I'll email a stranger their new password." The second door says "sure, I'll change a stranger's password without emailing them at all." Take your pick. Admin user IDs are not special. The same request works on them too.

There was a rule forming in the back of my head, the one anyone who has built a web application has tattooed somewhere by their second job: **never trust the client.** The server was doing the opposite of that. It was reading the client's claim about who it was, and acting on it. The browser wasn't a *view* of the application. The browser *was* the application.

## A Detour Through File IDs

Around this point I should have stopped, written it up, sent the email. I didn't. The portal was a buffet by now and I wanted to know what else was on offer.

The next thing I found was a document download endpoint. You request a document (your payslip, say) by an encrypted document path, and the server returns a pre-signed AWS URL that lets your browser fetch the file directly from S3. Reasonable, on the surface.

Except: the encrypted document path is constructed client-side. The server doesn't ask "is this document yours?". It signs whatever the client asks for. The request looks roughly like this:

```
POST /api/[redacted]/GetUserDocuments

LoggedInUserIDStr=[your_id]
&ForUserIDStr=[target_user_id]
&SessionKey=[your_session]
&LoggedInUserID=[your_id]
```

`ForUserIDStr` again. Same pattern, same trust model, same nothing. The response is a JSON blob containing a list of documents with their metadata and pre-signed S3 URLs:

```json
{
  "DocumentName": "[period]_PAYSLIP.PDF",
  "UserName": "[REDACTED]",
  "HRDocumentType": "Payslip",
  "AWS_URLForDocumentFile": "https://[bucket].s3.amazonaws.com/[path]?AWSAccessKeyId=AKIA...&Signature=..."
}
```

I sat with this for a minute. If the server is signing arbitrary paths the client picks, then either (a) the encryption layer is doing the authorisation, which means there's something cryptographically clever happening that constrains what paths a given session can construct, or (b) the server is signing whatever you point at, which means the only thing standing between me and somebody else's payslip is whether I can construct the right path.

If the client picks the file and the server signs the URL, the key is in here somewhere.

And of course, it was.

## The Goldmine

It was right there in the JavaScript bundle. Four lines of variable assignment, in a file with an innocuous name, sitting in plain text:

```js
AWSDomain        = "https://s3.amazonaws.com";
AWSFileAccessKey = "AKIA...REDACTED...";
AWSFileSecretKey = "REDACTED";
AWSBucket        = "[redacted]";
```

A hardcoded AWS access key and secret. Real keys. Not a placeholder. Not a development credential. The production keys, shipped to every single logged-in browser, loaded into the same memory page as my session cookie. Drop them into `~/.aws/credentials`, point `aws s3 ls` at the bucket, and the entire tenant tree opens up.

Now, the obvious mitigation, the thing a vendor would say if you cornered them at a conference, is that you have to be a logged-in customer to see those keys. You have to be authenticated. You have to be *inside the trust boundary*.

I want to take a moment with this, because it's the most important sentence in the post.

**You did not have to be a paying customer.**

The vendor offered a free trial. Anyone with a working email address, anyone with thirty seconds and a throwaway inbox, could sign up for the trial, log in, and get the same keys handed to them as a real customer. The trial was a feature. The keys were a feature. The bucket was shared.

What was in the bucket? Payslips. Visa scans. Passport photocopies. HR documents across roughly a hundred tenants. Law firms, asset managers, hedge funds, retail brands, even a rugby club. I'm describing categories on purpose. I'm not enumerating names.

It would be flattering to call this a vulnerability. A vulnerability implies that there's a system, and the system has a flaw. This was not a system. This was a public document repository with a sign that said "employees only" and no lock on the door.

This, in retrospect, is what the 16×16 favicon had been trying to tell me from the start.

## The Pause

I'm going to be honest about this part because I think it's the only part of the story that's interesting in a way that isn't "lol look how broken."

I did do an initial enumeration. I had to. The whole story I just told you depends on the bucket actually having other tenants' data in it, and the only way to know that for sure was to look. So I looked. I started downloading one tenant's documents, got partway through, saw enough to confirm what was inside (payslips, scans of passports, scans of dependent visas), and stopped. I didn't finish that bucket. I didn't move to a second one.

I want to write a paragraph here about the legal exposure, and how I felt about it, and the line between curiosity and voyeurism, and the moment of realising that I was sitting on something that was not mine and was not meant for me. I'm not going to write that paragraph well, because I don't think anyone writes that paragraph well, and the closest I can get to honesty about it is: I didn't know what I owed the strangers whose payslips I could now download, but I knew it was more than I owed myself.

So I stopped digging. I didn't monetise anything. I didn't escalate further. I asked, through an appropriate internal channel, to have my own data purged from the bucket. I made a small effort to confirm that purge had actually happened. I wrote down what I had seen, in enough detail to make the case, and not a comma more.

I want to be clear that this isn't moral heroism. This is what *"I would prefer not to be sued"* looks like when you write it down in good faith. The two things rhyme, but they're not the same thing, and the post would be dishonest if I let them blur.

And then I tried to tell the vendor.

## Three Months of Silence

I'm using "tried" here in the way you use it when you talk about phoning a friend who's screening your calls.

GlacierHR had a "contact us" form on every product page. I filled it out. No response. I filled it out again on a different page. No response. I filled out the same form on the marketing site, on the partner site, on the support portal. No response. I tried, and tried, and tried, for three months, through every contact path I could find on a vendor whose entire website was, itself, the surface area of the bug.

You will have noticed by now that I'm not naming the vendor, and you may have guessed that I'm also not naming the endpoints, the path prefixes, the subdomains, the exact key prefix, or any of the other shapes you'd need to reproduce any of this. That's deliberate. The hardcoded key was eventually patched. As of the last time I checked, the rest of it was not. **The redactions in this post aren't laziness. They're the only reason I can publish it at all.**

What broke the silence, and this is the part of the story I'm fondest of: I'd met Emil at BlackHat Asia, and during one of those between-talks conversations I mentioned what I had on my hands. He routed the disclosure through the right channels at Singapore's national CERT (SingCERT) via [Div0](https://www.div0.sg/), the local security community. Three months of contact forms had achieved nothing. One email from a national CERT got a response within a week. The vendor patched the AWS keypair quietly, did not acknowledge the rest, and did not say thank you.

Div0 deserves a proper thanks here. The reason this story has a (partial) ending isn't that I'm clever. It's that Singapore has SingCERT, a national CERT that sits between researchers and the vendors they're reporting against. Vendors get embarrassed when you find their bugs, and embarrassed vendors do retributive things. SingCERT is the buffer that lets disclosure happen without that retribution landing on the researcher. Div0 is the community that helped me find my way to it. Without either of them I'd be sitting on a folder of evidence and no safe way to publish any of this. Both are public goods and they deserve to be named for what they are.

## The Conclusion

There's a rule that anyone who has ever built a web application learns in the first week of doing it. *Never trust the client.* The browser is not the application. The browser is a hostile environment you serve responses to, and every claim it makes about who is logged in or what they're allowed to do has to be checked again on the server. This is not a hot take. It's the page-one, hello-world rule of building anything that talks to a network.

What I found at GlacierHR was that rule being violated, by design, in five different places. Someone, on a Tuesday, in a meeting, decided the server didn't need to check whether you were allowed to do the thing you were asking to do. Someone else, in code review, looked at that decision and said "looks good to me." A third person, the day before launch, said "we'll fix it later."

The internet runs on these Tuesdays.

The vendor I'm not naming has a security page on their marketing site. I'm looking at it as I write this. It says, and I'm paraphrasing only enough to keep the redaction intact, that the product is now ten years old and that there has been no report of breach or leak of customer data in those ten years. It lists AES-256 at rest, TLS 1.2 in transit, AWS hosting, daily backups, criminal background checks for employees, and (this is the one that aged best) the assurance that *"only a senior Database administrator has access to customer data."*

A senior database administrator, and also any person on the internet who could spell their own email address well enough to sign up for the free trial.

If you click further in, you'll find a longer security policy document. It claims that their software development practices adhere to OWASP guidelines, which is interesting because every bug I described above is the same item from the OWASP Top 10: A01, Broken Access Control. The number one item. The first one anyone writing software is supposed to look at. The document also mentions that vulnerability scanning is performed manually, which is itself an admission. Whatever the manual scanning was, it missed five Criticals.

The same document, in its access control section, says that only a small internal group can access sensitive customer data, and that even that group requires written authorisation from the customer via email before doing so. I read this line twice. The written-authorisation rule applied to a handful of senior employees. It did not apply to a stranger who signed up for the free trial and inherited the AWS keypair as a load-bearing feature of the page bundle.

Somewhere in the middle of the document there's a line where they say, more or less, that they try really hard to keep their software free of security flaws. I believe this one. I think they were trying. I also think trying isn't the same thing as succeeding, and that the gap between those two verbs is what this entire story has been about.

The certifications and the encryption table on a security page aren't the thing that matters. None of those things would have stopped this. Encryption at rest is irrelevant when the key is shipped to the browser. The thing that mattered was whether the vendor would reply when a curious employee emailed them, and the answer to that was: no, not for three months, and not without national-CERT involvement.

If you're buying SaaS, for HR or for anything else, that's the due diligence question worth asking. Not *"are you SOC 2."* Not *"do you have a SIEM."* The question is: *would you reply if my employee found a bug in your portal?* That question has a real answer for every vendor on earth, and most procurement teams never ask it.

It's almost funny when you frame it like that. Funny in that drained, hollow way you laugh at a meeting that was clearly going to be an email.

It would have been funnier if the bucket hadn't had passport scans in it.

I'm going to leave it there. There's nothing more I can teach you with the details I have left.
