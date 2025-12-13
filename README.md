# About
This is a database driven airline reservation web application which enables Airlines to manage their
fleet of Airlines and Bookings and Tickets for Customers. The data is stored in a MySQL database (https://www.freesqldatabase.com/)

## 2. Deployment Instructions

URL: https://airline-reservation-database-application.onrender.com/

Note that only the frontend works at the moment. Backend will be functional soon...

You may have to tweak your environment variables and URLs when running locally.

To deploy on Render:

Create a Static Site on Render.
Root directory: frontend
Build command:

```
npm install && npm run build
```

Publish directory:

dist (for Vite)

Add Redirect/Rewrite rule for React Router:

```
Source: /*
Destination: /index.html
Action: Rewrite
```

Add the following environment variable to the frontend: 
```
VITE_HOST=https://backend-airline-reservation-database-app.onrender.com
```

Deploy backend Web Service

Create a Web Service on Render.
Root directory: backend
Start command:
```
npm install && node server.mjs
```

Ensure the following:

Use process.env.PORT in code. Hard coding the PORT is not recommended.
Add environmental variables defined below
Modify CORS in backend as indicated below (taken from mjs files)

```
const PORT = process.env.PORT || 7230;

DB_HOST = XXXX
DB_NAME = XXXX
DB_PASSWORD = XXXX
DB_PORT = XXXX
DB_USER = XXXX

app.use(cors({
  origin: [
    'https://airline-reservation-database-application.onrender.com',
    'http://localhost:5173' // for dev
  ],
  credentials: false, // not using cookies; omit credentials
}));

```


