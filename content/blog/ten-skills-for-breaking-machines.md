---
title: "OSAI: Bringing AI to an AI Security Exam"
excerpt: "I really enjoyed AI-300. The course gave me plenty of interesting techniques; the OSAI exam was where I had to find out whether using AI to assess AI was actually helping."
date: "2026-10-05"
category: "cybersecurity"
author: "yup.eng"
image: "/blogBanner/buildBanner.png"
---

I really enjoyed OffSec's [AI-300: Advanced AI Red Teaming](https://www.offsec.com/courses/ai-300/). It covers the security of AI-powered systems: assistants that use tools, applications that retrieve documents, and agents that pass work to other agents. There was plenty to get stuck into, including an impressive number of ways for software to trust something it probably shouldn't.

The course leads to the OffSec AI Red Teamer certification, or OSAI. By the time I got to the exam, I had a question beyond whether I understood the techniques: could I use AI to help assess AI systems and still keep track of what was actually happening?

I brought Claude Code and Codex along to find out. Apparently one source of confident suggestions wasn't enough.

## What made the course interesting

AI-300 works through the different parts of an AI application, so each topic adds something to your understanding of the whole system. Agents bring instructions, memory and tools into the picture. Multi-agent systems add communication and assumptions about what another agent can be trusted to do. Retrieval brings in outside information; embeddings introduce another way of representing and finding that information. Tool connections, the software supply chain and deployment infrastructure widen the picture further. The [public syllabus](https://manage.offsec.com/app/uploads/2026/03/AI-300_Syllabus_33126.pdf) covers the progression.

What I liked was how much there was to learn from the connections between these topics. A model might be the most visible part of an application, but the application also has to decide what information it can read, which actions it can take and whose instructions matter. Those decisions become much more interesting when several components are involved.

The embeddings material is a good example. Converting text into vectors can sound reassuringly distant from the original text. The whole reason those vectors are useful, though, is that they preserve information about its meaning. Treating that conversion as if it had automatically made sensitive information private would be a fairly optimistic interpretation of what had happened.

I also appreciated the attention to threat modelling. You work with an incomplete picture, distinguish observations from assumptions, and revise your understanding as more evidence appears. There is a lot of technique in the course, but this part gives you a way to think about which questions are worth asking. The material includes defensive considerations too, which helps connect a weakness to the design decisions behind it.

## From exercises to Challenge Labs

The learning format has more variety than reading a chapter and hoping it stays in your head. There are knowledge checks, multiple-choice questions, open-ended responses and hands-on tasks. The open-ended questions make room for explaining your understanding rather than guessing the exact sentence someone wanted.

The distinction I found particularly interesting is how the course positions AI use. Much of the teaching works through the material manually, to establish how and why it works. The course material frames the larger Challenge Labs and final exam around actively using AI assistance. That gives the preparation a useful direction: learn enough to judge the help you're getting.

The material also makes allowances for probabilistic output. A model's wording or choices may differ from an example; the question is whether the behaviour and result are correct. Preparing by memorising what the answer ought to look like would miss quite a lot of the point.

Viewed through that lens, the Challenge Labs have an interesting role. They are where the individual topics are meant to meet, and where using an assistant becomes something to practise in its own right. Giving it a task is easy enough. Deciding whether its response has helped requires a bit more participation from the person at the keyboard.

## Preparing my own side of it

My preparation left me with eleven files of notes. I combined them into a reference of roughly 1,600 lines and built ten small skills around it: reusable instructions that pointed the assistants towards the relevant material. I wanted useful context available without having to explain everything again while tired.

The distinction I cared about most was between something I had checked in a lab and something I had only read about. Both could stay in the notes. They did not deserve the same confidence.

For preparation, I'd spend time revisiting the concepts that are still difficult to explain, then practising how to check an assistant's conclusions. Keep observations and supporting evidence together, and write findings while you still remember what you meant. The reporting skill earned its place in my setup. I had managed to make an AI security exam involve more paperwork, but at least I had prepared some help with it.

## Where the OSAI exam came in

OffSec's [exam FAQ](https://help.offsec.com/hc/en-us/articles/46669767163156-OSAI-Advanced-AI-Red-Teaming-Exam-FAQ) describes a 24-hour exam and explicitly encourages AI use as part of the assessment. That was a big part of the appeal for me. The course had introduced plenty of interesting techniques; the exam was where my approach to using AI assistance had to hold up.

I'll leave the exam itself out of this. What I can discuss is the experience of working with two assistants. Claude Code and Codex did not always focus on the same things, which gave me different interpretations to consider. It also gave me more output to read. This was a practical choice on my part, not a controlled comparison of the models.

The bottleneck was still me. Both could produce plausible suggestions faster than I could assess them, and I still needed to understand the underlying evidence. Agreeing with each other didn't settle a question either, particularly when they were working from the same notes I had given them.

That made the OSAI experience especially interesting. I was studying the risks of letting AI act on information, while making my own decisions about how much to trust its output. The course gave me a much wider set of things to think about, and the exam made that personal very quickly.

I would recommend AI-300 to someone with a security background who wants to understand how these systems fit together. I enjoyed the breadth, the techniques and the opportunity to put AI assistance to use. Just allow some time for checking its work. Bringing a second assistant did not, unfortunately, entitle me to stop thinking.
