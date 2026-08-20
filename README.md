# WorkAI Assistant

Build a working MVP called WorkAI, an AI-powered workplace productivity application.

IMPORTANT:
Build the application incrementally and efficiently. Do NOT over-engineer it. The priority is a working demonstration of the three core AI solutions.

PROBLEM

Employees spend too much time on repetitive administrative work such as:

Writing professional emails

Summarising meeting notes

Organising and prioritising daily tasks

WorkAI uses AI to reduce this administrative workload.

CORE FEATURES

Build exactly these 3 main AI tools:

1. SMART EMAIL GENERATOR

Create a page where the user can enter:

Email purpose

Recipient

Key points

Tone

Desired length

Allow tones:

Professional

Friendly

Formal

Concise

Persuasive

When the user clicks Generate Email, use an AI model to create:

Subject line

Professional email body

Appropriate closing

Display the result in an editable text box.

Add buttons:

Copy

Regenerate

Make shorter

Make more professional

The application must actually generate AI content rather than displaying hard-coded examples.

2. MEETING NOTES SUMMARIZER

Create a page where the user can enter:

Meeting title

Participants

Meeting notes

When the user clicks Summarize Meeting, use AI to generate:

Summary

A concise overview of the meeting.

Key Points

Important discussion points.

Decisions

Decisions explicitly mentioned in the notes.

Action Items

Tasks mentioned in the notes, including the responsible person and deadline when available.

Follow-up Questions

Unresolved issues.

Do NOT invent information that is not contained in the meeting notes.

Add:

Copy button

Regenerate button

3. AI TASK PLANNER

Create a page where users can enter multiple tasks.

Each task should support:

Task name

Description

Deadline

Priority

Estimated duration

Allow users to add and remove tasks.

When the user clicks Plan My Day, use AI to analyse the tasks and create:

Today's Priority

The single most important task.

Recommended Schedule

Create an ordered schedule based on:

Urgency

Importance

Deadlines

Estimated duration

Show each task with:

Time

Task

Priority

Use priority indicators:

Urgent

High

Medium

Low

Allow users to mark tasks as complete.

DASHBOARD

Create a professional workplace dashboard.

At the top show:

Good morning! 👋

"Save time on repetitive workplace tasks with AI."

Then show three large feature cards:

Smart Email Generator

Write professional emails in seconds.

Button: Generate Email

Meeting Notes Summarizer

Turn meeting notes into clear summaries and action items.

Button: Summarize Meeting

AI Task Planner

Prioritise your workload and plan your day.

Button: Plan My Day

Also show simple statistics:

Emails generated

Meetings summarised

Tasks completed

These can initially use demo/local data.

NAVIGATION

Create a sidebar with:

Dashboard

Email Generator

Meeting Summarizer

Task Planner

Make navigation fully functional.

DESIGN

Make this look like a polished modern workplace SaaS application.

Use:

Professional typography

Clean cards

Rounded corners

Subtle shadows/borders

Clear buttons

Consistent spacing

Modern icons

Responsive design

Do NOT make it look like a generic ChatGPT clone.

The product should look like a real workplace productivity platform.

Use the name:

WorkAI

Tagline:

"Work smarter. Spend less time on admin."

AI IMPLEMENTATION

Use Lovable's built-in AI functionality for the three AI features.

Keep AI calls secure through the backend.

Do not expose API keys in frontend code.

Add proper loading states while AI is generating.

Add friendly error messages if an AI request fails.

RESPONSIBLE AI

Include a clearly visible Responsible AI disclaimer in the application:

"AI-generated content may contain errors or omissions. Always review AI-generated emails, meeting summaries and task recommendations before relying on them. Do not enter confidential or sensitive information unless permitted by your organisation."

AI outputs should be presented as recommendations and should not be treated as guaranteed facts.

For meeting summaries, do not invent decisions, deadlines, people, or information that are not contained in the user's notes.

Do not automatically send emails or take external actions without user confirmation.

DEMO EXPERIENCE

Include realistic demo content so the application looks complete when demonstrated.

Example tasks:

Complete quarterly report

Reply to client proposal

Prepare presentation

Review team performance

Schedule project meeting

Make it possible to clear or replace demo data.

IMPORTANT

This must be a FUNCTIONAL MVP, not a static mockup.

The following must actually work:

Navigation

Email generation

Meeting summarisation

Task creation

AI task planning

Task completion

Copying generated content

Prioritise functionality of the three AI solutions over secondary features.

Do not add unnecessary features until these three workflows work correctly.

Build the MVP now.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://efficient-work-app.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ff94a3d3-e687-408a-b069-a0a53041de60).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
