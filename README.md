# About
This is a database driven airline reservation web application which enables airlines to manage their
fleet of airlines and manage customers bookings and tickets

## 2. Deployment Instructions

You may have to tweak a few things with environment variables and URLs when running locally.

To deploy on Render:

Create a Static Site on Render.
Root directory: client
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

Add .env.production in client:
```
VITE_API_BASE_URL=https://<your-backend-service>.onrender.com
```

Deploy backend Web Service

Create a Web Service on Render.
Root directory: server/expense_tracker
Start command:
```
npm install && node server.js
```

Ensure the following:

Use process.env.PORT in code.
Add MongoDB URI and secrets in Render Environment Variables.
Modify CORS in backend as indicated below (taken from mjs files)

```
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ['http://localhost:5173', 'https://expense-tracker-application-da78.onrender.com'],
  credentials: true
}));
```

Connect frontend and backend

```

const API_BASE = import.meta.env.VITE_API_BASE_URL;
axios.post(`${API_BASE}/login`, { email, password });

```


