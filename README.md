SasVoix --- Student Complaint Prioritization Platform
SasVoix is a web application for managing campus complaints in one
place. Students can submit issues, browse existing complaints, support
issues they are affected by, and track their own submissions.
Administrators can review complaints, update their status, and view
complaint statistics.

The project focuses on making common campus issues easier to report,
track, and prioritize.
Live deployment
- Frontend: https://sasvoix.vercel.app/ --- deployed on Vercel
- Backend API: https://sasvoix-backend.onrender.com --- deployed
  on Render
- Database: MongoDB Atlas
The React frontend sends API requests to the Express backend. The
backend connects to MongoDB using the MONGO_URI environment variable.
Features
Student
- Register and log in.
- Browse campus complaints.
- Filter complaints by category: Mess, Hostel, WiFi, Library,
  Transport, and Others.
- Create a complaint with a title, category, description, and optional
  evidence URL.
- View complaints submitted by the logged-in student.
- Support an existing complaint.
- View complaint status: Pending, In Progress, or Resolved.
Administrator
- Access administrator-only pages and API operations.
- View dashboard counts for total, pending, in-progress, and resolved
  complaints.
- View the most-supported complaint.
- Review complaints and change their status.
- Update or delete complaints.
Technology stack
  Layer                   Technology              How it is used
  Frontend                React                   Builds the application
pages and reusable
components

  Routing                 React Router            Handles navigation
between login,
registration, student,
and admin pages

  UI                      Bootstrap 5             Provides layout, forms,
buttons, cards, and
responsive styling

  HTTP client             Axios                   Sends requests from
React to the backend
API

  Backend                 Node.js and Express     Exposes REST API
endpoints and handles
application logic

  Database                MongoDB Atlas with      Stores users and
Mongoose                complaints using
Mongoose models

  Authentication          JSON Web Tokens (JWT)   Issues a token at login
and verifies protected
API requests
Password hashing        bcryptjs                Hashes passwords during
registration and
password reset
Application structure
Sasvoix/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── complaintController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   ├── adminMiddleware.js
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Complaint.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   └── dashboardRoutes.js
│   ├── Server.js
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   └── ProtectedRoute.js
    │   ├── pages/
    │   │   ├── AdminComplaints.js
    │   │   ├── Complaints.js
    │   │   ├── CreateComplaints.js
    │   │   ├── Dashboard.js
    │   │   ├── ForgotPassword.js
    │   │   ├── Home.js
    │   │   ├── Login.js
    │   │   ├── MyComplaints.js
    │   │   └── Register.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   └── index.js
    └── package.json
How the application works
1. Authentication and role-based access
1. A user registers with a name, email, and password.
2. The backend hashes the password with bcryptjs before saving the
   user.
3. During login, the backend retrieves the user and compares the
   entered password with the stored hash.
4. If the credentials match, the backend creates a JWT containing the
   user's ID and role. The token expires after one day.
5. The frontend stores the token and user information in
   localStorage.
6. Protected frontend routes check whether a token exists.
7. For protected API routes, the protect middleware verifies the JWT
   and attaches its decoded payload to req.user.
8. The adminOnly middleware checks the user's role before allowing
   administrator-only operations.
2. Complaint creation and tracking
- A logged-in student submits a complaint from the Create Issue page.
- The frontend sends the complaint details to POST /api/complaints
  with the JWT in the Authorization header.
- The backend uses the authenticated user's ID when creating the
  complaint.
- The complaint model stores its title, description, category,
  optional evidence URL, creator, vote count, voters, and status.
- The default status is Pending, and the default vote count is 0.
- Students can retrieve their own complaints through
  GET /api/complaints/my.
3. Complaint voting
- The Home page displays complaints sorted by vote count.
- When a student selects Support Issue, the frontend sends a request
  to PUT /api/complaints/:id/vote.
- The backend finds the complaint and checks whether the student's ID
  is already present in the voters array.
- If the student has already voted, the API responds with
  You already voted.
- Otherwise, the backend increments the vote count and adds the
  student's ID to the voters array.
The voters array is the mechanism used by this implementation to check
repeat votes. The current code performs the duplicate check and the
update as separate database operations; it should not be described as
fully race-condition-proof under simultaneous requests.
4. Administrator dashboard
The dashboard API is GET /api/dashboard.

The backend uses Mongoose queries to calculate:
- Total complaints using countDocuments().
- Pending complaints using a status filter.
- In-progress complaints using a status filter.
- Resolved complaints using a status filter.
- The most-supported complaint using findOne().sort({ votes: -1 }).
The dashboard page displays these values and the top complaint.
5. Complaint status management
An administrator can change a complaint's status to:
- Pending
- In Progress
- Resolved
The frontend sends the selected status to
PUT /api/complaints/:id/status. The backend route uses both
authentication and administrator-role middleware before updating the
complaint.
API routes
The backend mounts its routers under /api.
Authentication
  Method                  Endpoint                      Purpose
  POST                    /api/auth/register          Register a student
account

  POST                    /api/auth/login             Verify credentials and
return a JWT

  POST                    /api/auth/forgot-password   Generate a
password-reset OTP
POST                    /api/auth/reset-password    Verify the OTP and
update the password
Complaints
  Method            Endpoint                       Access in current Purpose
routes            
  POST              /api/complaints              Authenticated     Create a
complaint

  GET               /api/complaints              Public            Retrieve
complaints;
optional category
query supported

  GET               /api/complaints/my           Authenticated     Retrieve the
logged-in user's
complaints

  PUT               /api/complaints/:id/vote     Authenticated     Support a
complaint

  PUT               /api/complaints/:id/status   Authenticated     Update complaint
administrator     status

  PUT               /api/complaints/:id          Authenticated     Update complaint
administrator     fields
DELETE            /api/complaints/:id          Authenticated     Delete a
administrator     complaint
Dashboard
  Method            Endpoint           Access in current Purpose
routes            
  GET               /api/dashboard   Authenticated     Retrieve
administrator     complaint
statistics and
the top complaint
Data models
User
The User model contains:
- name
- email (unique)
- password (hashed before storage)
- role (student or admin; defaults to student)
- resetOtpHash
- resetOtpExpires
- Mongoose timestamps (createdAt and updatedAt)
Complaint
The Complaint model contains:
- title
- description
- evidenceUrl (optional)
- category
- user (reference to the User model)
- votes (defaults to 0)
- voters (array of User references)
- status (defaults to Pending)
- Mongoose timestamps (createdAt and updatedAt)
Deployment architecture
User's browser
      |
      v
React frontend — Vercel
      |
      | Axios requests over HTTPS
      v
Express REST API — Render
      |
      | Mongoose connection using MONGO_URI
      v
MongoDB Atlas
Frontend --- Vercel
The React frontend is deployed at https://sasvoix.vercel.app/.

The Axios instance in frontend/src/services/api.js currently uses this
API base URL:
const api = axios.create({
  baseURL: "https://sasvoix-backend.onrender.com/api",
});
Backend --- Render
The Express backend is deployed at
https://sasvoix-backend.onrender.com.

The server reads its port from process.env.PORT and falls back to port
5000 for local execution.
Database --- MongoDB Atlas
The backend connects through Mongoose using process.env.MONGO_URI. The
database connection string should be configured as an environment
variable in the Render service, not committed to the repository.
Backend environment variables
Configure these in the Render service:
MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<your JWT signing secret>
Do not commit real credentials or secrets to GitHub.
Deployment issue investigated: slow first API request
A delay was observed when opening the application after it had been
inactive, while later navigation was faster. Since the backend is hosted
on Render, a possible cause is a free-instance cold start. Render free
web services can spin down after inactivity and take time to start
again.

This is a suspected cause based on the observed pattern, not a confirmed
diagnosis or a claim that the issue has been fixed.
Debugging procedure
1. Open the deployed frontend and open Chrome Developer Tools with
   F12.
2. Select the Network tab.
3. Filter the requests by Fetch/XHR.
4. Clear the request list.
5. Reproduce the delay, preferably after the application has been
   inactive.
6. Identify the slow API request and note its total duration.
7. Open that request's Timing details. Pay attention to waiting for
   the server response (TTFB), rather than assuming the whole delay is
   caused by React.
8. Open the Render dashboard and inspect the backend service logs
   around the same time.
9. Check whether the logs show the backend starting again and whether
   the MongoDB connection succeeds.
10. Compare the first request with a second request made shortly
    afterwards.
How to interpret the findings
- A slow first request after inactivity, followed by faster requests,
  is consistent with a possible cold start.
- A high TTFB means the delay is before the response arrives; backend
  startup, database connection, or API processing may be involved.
- A MongoDB connection error in Render logs points to a database
  connectivity/configuration issue that needs separate investigation.
- If the backend responds quickly but the browser still takes time to
  render the page, inspect the frontend and browser console.
The diagnosis should be based on Network timings and Render logs. Do not
describe a suspected cold start as a proven cause unless those checks
confirm it.
Local setup
Prerequisites
- Node.js and npm
- A MongoDB connection string
- A JWT secret
Backend
1. Open a terminal in the backend folder.
2. Install dependencies:
npm install
3. Create a backend .env file with:
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<your JWT signing secret>
PORT=5000
4. Start the backend using the actual filename:
node Server.js
The API root should respond with:
SasVoix API Running
Frontend
1. Open another terminal in the frontend folder.
2. Install dependencies:
npm install
3. Start the React development server:
npm start
The frontend runs at http://localhost:3000.
Current implementation notes
These notes describe limitations visible in the current source code:
- The forgot-password controller currently returns the generated OTP
  in the API response as devOtp. The frontend displays it in a
  development-mode message. A real email-delivery flow is not
  connected in this code.
- The frontend API service currently hardcodes the Render API URL.
  Although frontend/.env contains REACT_APP_API_URL,
  frontend/src/services/api.js does not read that variable.
- The backend file is named Server.js, while the backend
  package.json start script uses nodemon server.js. Because
  deployment environments such as Render run on Linux, filename casing
  matters. The deployed start command should match the actual
  filename. The local command shown above uses node Server.js.
- The current voting implementation checks the voters array before
  updating the vote count, but the check and update are separate
  operations. Concurrent requests may require stronger atomic
  protection.
What I learned
Building SasVoix gave me practical experience with:
- Structuring a React frontend into pages, components, and an API
  service.
- Connecting a React application to an Express REST API using Axios.
- Creating and using Mongoose models for users and complaints.
- Hashing passwords and implementing JWT-based authentication.
- Applying middleware to protect routes and restrict administrator
  operations.
- Implementing complaint creation, retrieval, voting, and status
  updates.
- Deploying the frontend and backend separately and connecting them to
  a hosted database.
- Investigating slow API responses using browser Network timings and
  backend deployment logs.
SasVoix is a project focused on making campus complaint reporting,
tracking, and prioritization more organized and transparent.
