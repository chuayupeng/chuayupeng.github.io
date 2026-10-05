---
title: "The More I Dug, The More Skeletons Came Tumbling Out"
excerpt: "A curious employee, a dated HR portal, and five bugs that shouldn't exist."
date: "2026-05-10"
category: "cybersecurity"
author: "yup.eng"
image: "/blogBanner/skellyBanner.png"
---

## The Background

I had forgotten my password for the HR portal again, so I used the option that emails you a login link. It worked. The next morning, I found the email in my inbox and used the same link again.

It still worked a week later.

At least one part of the HR portal was reliably doing what I asked.

That was the first thing I noticed. By the time I stopped looking, I had also found problems with password changes, access to other users' documents, and credentials exposed in the application. Getting someone to respond to the report took another three months.

I'll call the portal **FrostLeave** and the vendor **GlacierHR**. Those are made-up names. I've left out the identifying details and reproduction steps because I don't have confirmation that all the issues have been resolved.

## The First Thread: A Magic Link That Wouldn't Die

The portal looked old, which is an easy thing to make fun of and a fairly useless way to assess its security. Plenty of ugly software works perfectly well.

The login link was more interesting. It had already been used, and it was still letting me in a week later. That doesn't prove it would work forever. It does mean that an old email was still enough to get into my account.

I started looking at what else the application trusted.

## Knock Knock, Who's Resetting?

Two password management functions appeared to be missing the checks that should have limited who could use them. One could trigger a password reset for another user. The other could change another user's password without sending them a notification. Administrator accounts were affected too.

The browser-side reset function looked roughly like this, with the endpoint redacted:

```js
ResetPassword = function (data) {
    this.EditUserID = data.encUserId();
    var jsonData = toJSON(this, ['SessionKey', 'EditUserID']);
    ajax(jsonData, "/api/[redacted]/ResetUserPassword");
    // ...notify success...
};
```

`SessionKey` represented the caller's session, while `EditUserID` selected the account the operation would affect. Sending a target user ID is normal for an admin feature. The server still has to check whether the caller is allowed to act on that account. The JavaScript alone doesn't tell you whether that check exists.

These were features the application needed. Administrators do sometimes need to help people who forget their passwords. I had just demonstrated the demand for that service myself. The problem was allowing an ordinary user to perform the same actions.

The separate password-change function also accepted a choice about whether to notify the affected user. That made the missing permission check worse: the change could happen without the account holder receiving an email about it. The notification setting wasn't the authorisation problem, but it was a particularly unhelpful extra.

The redacted request had this shape:

```
POST /api/[redacted]/ChangePassword
Content-Type: application/x-www-form-urlencoded

NewPassword=[new_password]
&ForUserIDStr=[target_user_id]
&SessionKey=[your_session]
&LoggedInUserID=[your_id]
&CanSendAnEmailToTheUser=false
```

## A Detour Through File IDs

I then found a similar issue with document access. The application wasn't properly checking that the person requesting a document was allowed to see it.

The document request also carried separate fields for the logged-in user and the user whose documents were being requested:

```
POST /api/[redacted]/GetUserDocuments

LoggedInUserIDStr=[your_id]
&ForUserIDStr=[target_user_id]
&SessionKey=[your_session]
&LoggedInUserID=[your_id]
```

The response included document metadata and a pre-signed S3 URL. With the identifying details removed, it looked like this:

```json
{
  "DocumentName": "[period]_PAYSLIP.PDF",
  "UserName": "[REDACTED]",
  "HRDocumentType": "Payslip",
  "AWS_URLForDocumentFile": "https://[bucket].s3.amazonaws.com/[path]?AWSAccessKeyId=AKIA...&Signature=..."
}
```

Pre-signed URLs are a normal way to grant temporary access to a private file. The permission check needs to happen before that access is granted. A correctly signed URL doesn't establish that the person who received it was entitled to the payslip.

By this point, I had enough to write a report. I kept looking.

## The Goldmine

The next finding was storage credentials exposed in code delivered to the browser. They provided access to a shared document store containing data from multiple customer organisations.

The assignments in the JavaScript bundle looked like this, with the credentials and bucket name redacted:

```js
AWSDomain = "https://s3.amazonaws.com";
AWSFileAccessKey = "AKIA...REDACTED...";
AWSFileSecretKey = "REDACTED";
AWSBucket = "[redacted]";
```

Putting `Secret` in the variable name had apparently exhausted the available secrecy budget.

This was a separate finding from the document access issue. A pre-signed URL doesn't imply that the signing secret is in the browser. Here, I had found the credentials themselves in the code the application delivered to it. They were storage access credentials, and their permissions extended across customer organisations.

Trial accounts received the same exposed credentials. So even the limited reassurance of needing to be an existing customer didn't hold up.

The documents included payslips, passport scans and visa records. These were the sorts of things people submit to HR because they have to, with very little say in where the files end up.

## The Pause

I enumerated the storage and started downloading documents from one tenant. I stopped partway through, after seeing enough to establish what the files contained. I didn't continue to another tenant.

That is the part I need to account for when describing my own actions. Finding an access control problem didn't make those documents mine. I had downloaded other people's personal records.

I stopped investigating, documented what I had found, and went through an internal channel to get the data for everyone at my company removed. Then I made sure it was actually gone.

Then I tried to tell the vendor.

## Three Months of Silence

I started with the contact form. No reply. I tried other contact routes on the vendor's sites and support portal. Still no reply.

This went on for about three months, across the different contact routes I could find.

I don't know where those messages ended up. They might have been ignored, misrouted, or never reached anyone who understood the report. All I could establish from my end was that I wasn't getting a response.

The useful conversation eventually happened at Black Hat Asia. I ran into Emil at the [Div0](https://www.div0.sg/) booth and mentioned what I had found. He helped me reach the appropriate channels at SingCERT, Singapore's national computer emergency response team.

After SingCERT contacted the vendor, a response came within a week. The vendor subsequently addressed the exposed credential issue, but I did not receive acknowledgement of the other findings.

That was a partial result. I still don't have a complete account of what was fixed, when, or whether anyone else accessed the exposed data.

I had spent months trying to find that route through the vendor's own website.

## The Conclusion

The vendor's website had a security page covering encryption, hosting, backups and restrictions on who could access customer data. Its policy said access to sensitive records was limited to a small internal group and required customer authorisation.

I read that section again after seeing the documents.

Those controls may have existed in other parts of the business. They clearly didn't describe the access I had found. Encryption and backups could both be working as intended while the application handed out access it shouldn't.

I don't know how those decisions were made. What I could assess was the response to my report, and getting that response had required help from outside the company.

That's something I would now want to understand before trusting another service with this kind of data. If someone outside the company finds a problem, where does the report go? Who picks it up? How does the reporter find out whether it has been fixed?

I didn't get all of those answers here. I did get help from people who knew what to do when the contact forms weren't working.

Credit to Emil, Div0 and SingCERT for getting this further than I managed on my own. Three months is a long time to spend talking to a contact form.
