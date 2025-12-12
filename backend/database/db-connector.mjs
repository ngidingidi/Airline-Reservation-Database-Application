// Import dotenv and mysql
import 'dotenv/config';
import mysql from 'mysql2'

// Define the host, user, password, database
// Local credentials are for testing purposes. Comment out when pushing to server
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

// const HOST = process.env.HOST;
// const USER = process.env.USERNAME;
// const PASS = process.env.PASSWORD;
// const DB = process.env.DATABASE;

// Create a 'connection pool' using the provided credentials
const pool = mysql.createPool({
    waitForConnections: true,
    connectionLimit   : 10,
    host              : DB_HOST,
    user              : DB_USER,
    password          : DB_PASSWORD,
    database          : DB_NAME
}).promise(); // This makes it so we can use async / await rather than callbacks

// Export it for use in our application
export default pool;
