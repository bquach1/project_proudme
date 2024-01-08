# About Project ProudMe
Project ProudMe is an adolescent obesity prevention intervention based in Louisiana led by Dr. Senlin Chen of the Pedagogical Kinesiology lab and his team. I've served as the fullstack software developer for the project since December 2022, creating the components for the website for middle schoolers to interact with along with Figma and UX designers. This website includes three main components of the intervention: SMART Goal-Setting (My Journal + Track Behaviors), ProudMe PE, and ProudMe Cafeteria, all built using JavaScript and React.js.

# Tech Stack
Frontend
* [![React][React.js]][React-url]
* [![JavaScript][JavaScript]][JavaScript-url]
* [![HTML][HTML]][HTML-url]
* [![CSS][CSS]][CSS-url]
* [![Material UI][MUI]][MUI-url]
* [![Styled Components][Styled Components]][Styled-url]
* [![npm][NPM]][NPM-url]

Backend/Middleware
* [![JWT Tokens][JWT]][JWT-url]
* [![Node.js][Node.js]][Node-url]
* [![Express.js][Express.js]][Express-url]
* [![MongoDB][MongoDB]][MongoDB-url]
* SendGrid and OpenAI API's for email/chatbot purposes.
* bcrypt.js for secure MongoDB encryption.
* Deployment on Render.com for live access through a cloud-hosted database and static site.
  
# Application Features
Aside from the designed home, team, and other pages optimized for middle schooler user experiences and interfaces, Project ProudMe's site features a few specific features for the interaction of middle school kids, ranging a span of tech stacks from front to back end.
1. Secure Authentication
* Login information stored with MongoDB and encrypted with bcrypt.js hashing algorithms.
* Accordance with public privacy policies and security of personal information, JWT user tokens with session storage to maintain login states.
* SendGrid API emails to access forgot username/login functionalities, validate emails.
<p align="center">
  <img src="./assets/proudme_login.png" alt="ProudMe login page">
</p>

2. Journal Page
* Material UI and React components for users to track goals/reflections for 4 specified behaviors and receive AI-generated feedback through an OpenAI API request.
* Responsive information tracking last logged dates, daily values and feedback, and personalized goals based on MongoDB user-specific data.
* Multiple iterations of Figma designs and user experience reports in collaboration with frontend development for middle schooler user experience.
<p align="center">
  <img src="./assets/proudme_journal.png" alt="ProudMe My Journal">
</p>

3. Tracking Behaviors
* Admin features for tracking other mapped users' data in a specific time range (using react-calendar) and downloading via react-csv.
* Responsive line charts created using Recharts, color-coded based on relative achievements of goals and recommended values.
* Responsive progress bar charts created using Recharts, color-coded based on relative achievements of goals and recommended values.
<p align="center">
  <img src="./assets/proudme_linechart.png" alt="ProudMe Line Chart" width="45%">
  <img src="./assets/proudme_progressbar.png" alt="ProudMe Progress Bar" width="45%">
</p>

4. Other Features
* ProudMe PE module with embedded links to Youtube videos for physical education (WIP).
* ProudMe Cafeteria module for visual interaction and healthy eating (WIP).
<p align="center">
  <img src="./assets/proudme_pe.png" alt="ProudMe PE">
</p>

# More Information
* To access the site, see https://projectproudme.com/ to register an account and interact with the features.
* For further inquiries, please contact me at quachbruce@gmail.com, or find my LinkedIn at https://linkedin.com/in/bruce-quach

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/

[JavaScript]: https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E
[JavaScript-url]: https://www.javascript.com/

[HTML]: https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white
[HTML-url]: https://html.com/

[CSS]: https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white
[CSS-url]: https://www.w3.org/Style/CSS/Overview.en.html

[MUI]: https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white
[MUI-url]: https://mui.com/material-ui/

[Styled Components]: https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white
[Styled-url]: https://styled-components.com/

[NPM]: https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white
[NPM-url]: https://www.npmjs.com/

[JWT]: https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens
[JWT-url]: https://jwt.io/

[Node.js]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/en/about

[Express.js]: https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB
[Express-url]: https://expressjs.com/

[MongoDB]: https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
