Breakpoint
Project Description

Social debugging for Dartmouth students.

Breakpoint is a platform designed to help Dartmouth students collaboratively debug and test their projects. It focuses on peer-to-peer feedback and testing in a simpler, more approachable way than traditional tools like GitHub Issues, while maintaining a strong sense of community through Dartmouth-only authentication.

Deployed Application

Deployed application link: N/A

Demo / Screenshots / Video

Demo video:
https://www.youtube.com/watch?v=lQb6Kmbk6OA

Setup Instructions (Running Locally)
Environment Variables

Create a .env file in the backend directory with the following variables:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GMAIL_USER=your.email@gmail.com
GMAIL_APP_PASSWORD=your_16_char_app_password

Clone and Install
git clone https://github.com/maxxl28/breakpoint.git
cd breakpoint
cd backend
npm install
cd ../frontend
npm install

Run the Application

Frontend

npm run dev


Backend

npm start

Alternative Build Option

You can also run:

npm run build


This creates a dist folder in the frontend, which can be copied to the backend. Then run:

npm start


from the backend directory.

Learning Journey
What Inspired You to Create This Project

As a CS10 TA at Dartmouth, I noticed that students sometimes struggle a lot with certain assignments and TAs are overstretched trying to help them. Although this class is introductory with no deployment, GitHub, or advanced concepts, this is an issue I'm sure many CS classes face. Students often build impressive projects but struggle to get meaningful feedback and testing from their peers beyond what TAs can provide during limited office hours.

While platforms like GitHub Issues exist, they're designed for established projects and can feel overwhelming for students just learning to build web applications. Students needed something simpler without the mess of pull requests. Also, the Dartmouth only authentication ensures that this app is focused specifically on community and ensuring that other students get to learn through debugging other code as well.

Potential Impact

Breakpoint lowers the barrier for students to get real-world testing on their projects and also get help on bugs they can't figure out. By fostering a culture of peer testing and constructive feedback within the Dartmouth CS community, it helps students develop better debugging practices and learn to build more robust software.

Long-term, this could scale beyond Dartmouth to any educational institution to create collaborative testing and debugging for student developers. By lowering the barrier to ask for help, Breakpoint creates a safety net. It turns a frustrating, solitary experience into a collaborative one.

New Technology Learned and Why

I learned JWT (JSON Web Tokens) for stateless authentication because I wanted to understand how modern web applications handle secure user sessions. I also implemented email verification using Nodemailer with Gmail SMTP API, which taught me how production applications validate users and send transactional emails at scale.

Additionally, I gained hands-on experience with Express.js and MongoDB for building a full-stack RESTful API, which are foundational technologies used in modern web development. I gained hands-on experience with Mongoose schemas for data modeling, asynchronous error handling, and implementing CRUD operations.

Technical Rationale
Backend and Frontend Structure

I chose to deploy the frontend and backend together as a single application rather than deploying them separately. If they were 2 separate and I had to deploy them, I would have to manage 2 deployment pipelines and potentially other CORS issues.

For my database I used MongoDB with separate collections for Users, Apps, and Issues. I initially thought of tying each issue to an app but if I had to query them fast, I wouldn't want to comb through every app trying to find an issue. For example, when resolving an issue, I don't have to first find the parent app and then delete.

In retrospect though, a relational database like PostgreSQL would have been a good fit here. The relationships between Users, Apps, and Issues are very structured and if i were to add new data points I would definitely consider switching to PostgreSQL.

Biggest Technical Tradeoffs

The biggest tradeoff was between email notification reliability and development speed - I initially chose MailerSend for its simple API, but this came back to bite me during deployment when I hit trial account limits and domain verification issues.

I eventually switched to Nodemailer with Gmail SMTP, which worked better but still faces restrictions on free hosting platforms (Gmail SMTP autoblocks render.io).

Another key choice was deciding against implementing user roles (admin/developer/tester) in favor of a simpler "you can only resolve issues on your own apps" model. This reduced authentication complexity significantly and ensured all students have an equal playing field on the platform.

Most Difficult Technical Bug

The most painful bug happened during deployment on Sunday night when MailerSend suddenly started failing with cryptic domain verification errors and rate limit warnings that hadn't appeared in development.

I had about 2 hours before the deadline and I genuinely panicked, first trying to log errors, then running it locally, which worked, so I redeployed and it failed again. I completely tore through my code and tried using Claude Code to debug, yet that was helpful at all because the issue ended up being I'd hit their trial account's unique recipient limit - essentially, I can only email two unique email addresses, which I already hit during testing.

The lesson I learned was to always test third-party API limits early and have fallback mechanisms. I also learned an important lesson about stress management - when you're under pressure, don't blindly ask AI for solutions and hope they'll magically fix everything.

I eventually switched to nodemailer and the Gmail SMTP API, which worked well. However, when I tried to deploy it again, it failed. This time, I was more calm, so I went back to a previous working version before deployment, tested it again, and then redeployed it. However, that deployment failed. I searched for this issue and turns out that Gmail SMTP autoblocks render.io and also a bunch of other free hosting platforms, so I do not have a deployment link.

AI Usage
Tools Used

Did you use an AI tool (like GitHub Copilot or ChatGPT)?
Yes.

Specific Examples

I asked AI to generate CSS (not present on this version).

Prompt:
Can you make me one css file for the entire app? Make it modern, with dark green as the primary color. Do not over clutter, it just needs to be slightly responsive.

I also asked AI to try and debug my email error (unfortunately I do not have the prompt/chat). I also used it as a reference for documentation, and sometimes would ask it for architectural decisions (for example, whether or not I should split a component up in the frontend).
