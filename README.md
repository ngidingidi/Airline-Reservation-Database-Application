# About
This is a database driven airline reservation web application which enables Airlines to manage their
fleet of Airlines and Bookings and Tickets for Customers. The data is stored in a MySQL database provided by Aiven. At the time of writing, Aiven provided free database hosting (https://aiven.io/free-mysql-database)

## 1. Connecting to MySQL Database via CLI on Visual Studio
Connect to MySQL Database on Aiven using Visual Studio's Database Client JDBC.
Create a connection
Enter Host, Username, Port, Password
Open terminal
Copy and paste ddl file content to create tables and insert sample data
Copy and paste pl/sql file content to create views and stored procedures
Verify that tables and sample data loaded using standard SQL commands such as

```
show databases;
use defaultdb; #if your database name is defaultdb
show tables;
select * from Flights;
```

## 2. MySQL Workbench

**MySQL Workbench** is a graphical user interface (GUI) tool for MySQL that allows developers and database administrators to design, manage, and interact with MySQL databases visually. It’s commonly used for tasks like creating databases, running SQL queries, modeling schemas, and managing connections.

### How to create a MySQL database on Aiven using MySQL Workbench

1. **Get Aiven connection details**
   - In your Aiven dashboard, open your MySQL service and copy:
     - **Hostname**
     - **Port** (e.g., `21469`)
     - **Username**
     - **Password**
     - **Database name**
     - **Download the CA certificate** (for SSL)

2. **Configure a new connection in MySQL Workbench**
   - Open **MySQL Workbench** → **Manage Connections** → **New Connection**.
   - Enter the **hostname** and **port** from Aiven.
   - Set **username** and **password**.
   - Under **SSL**, enable SSL and upload the **CA certificate** you downloaded from Aiven.

3. **Test the connection and connect**
   - Click **Test Connection** to verify connectivity.
   - If successful, click **OK**.

## 3. Deployment Instructions

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
PORT_PROD=XXXX

app.use(cors({
  origin: [
    'https://airline-reservation-database-application.onrender.com',
    'http://localhost:5173' // for dev
  ],
  credentials: false, // not using cookies; omit credentials
}));

```


