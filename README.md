# WanderLust

**Description**  
WanderLust is a full-stack web application designed for finding and hosting unique vacation rentals. Users can browse, add listings, book stays, and view interactive maps with listing locations.

## Features

- **User Management:** Register, log in, and manage profiles with Passport.js authentication.
- **Booking System:** Search and book vacation rentals.
- **Interactive Maps:** View listings using Mapbox.
- **Search & Sort:** Search and sort listings by various criteria.
- **Email Notifications:** Receive booking confirmations with Nodemailer.
- **Responsive Design:** Accessible on various devices and screen sizes.

## Technologies Used

- **Front-End:** HTML, CSS, Bootstrap, JavaScript
- **Back-End:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **APIs:** RESTful APIs
- **Tools & Libraries:**
      - Mapbox: For map integration
      - Nodemailer: For sending emails
      - Passport.js: For user authentication
      - Cloudinary: For image storage
- **Deployment:** Render

## Installation

1. Clone the repository:
   https://github.com/Vivek0005/wanderLust.git
3. Navigate to the project directory:
   cd wanderlust
4. Install dependencies:
   npm install
5. Set up environment variables.
   - Create a .env file in the root directory with the following placeholders:
  MONGODB_URI=your_mongodb_uri
  EMAIL_USER=your_email
  EMAIL_PASS=your_email_password
  MAPBOX_TOKEN=your_mapbox_token
  SESSION_SECRET=your_session_secret
  PORT=8080
(Replace the placeholder values with your actual credentials and desired port number.)
6. Start the server:
   node app.js

## Contact
For questions or feedback, email me at vivekviki271@gmail.com.
