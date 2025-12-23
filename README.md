# About
This is a database driven airline reservation web application which enables Airlines to manage their
fleet of Airlines and Bookings and Tickets for Customers. The data is stored in a MySQL database provided by Aiven (https://aiven.io/free-mysql-database)

## 2. Deployment Instructions

URL: https://airline-reservation-database-application.onrender.com/

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
const PORT = Number(process.env.PORT) || 21469;

HOST_PROD=XXXX
USERNAME_PROD=XXXX
PASSWORD_PROD=XXXX
DATABASE_PROD=XXXX
DB_SSL_CA=-----BEGIN CERTIFICATE-----
Copy and paste ca.pem content here
-----END CERTIFICATE-----

app.use(cors({
  origin: [
    'https://airline-reservation-database-application.onrender.com',
    'http://localhost:5173' // for dev
  ],
  credentials: false, // not using cookies; omit credentials
}));

```


