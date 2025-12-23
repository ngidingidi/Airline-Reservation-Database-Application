
// database/db-connector.mjs
import 'dotenv/config';
import mysql from 'mysql2';

/**
 * In Render:
 *   HOST_PROD, PORT_PROD, USERNAME_PROD, PASSWORD_PROD, DATABASE_PROD
 *   DB_SSL_CA (raw PEM) OR DB_SSL_CA_B64 (base64 PEM)
 *
 * In local dev (optional fallbacks):
 *   HOST_LOCAL, PORT_LOCAL, USERNAME_LOCAL, PASSWORD_LOCAL, DATABASE_LOCAL
 *   SSL_CA_PATH (path to PEM file)
 */

// Prefer PROD → generic → LOCAL
const DB_HOST =
  process.env.HOST_PROD?.trim() ||
  process.env.HOST?.trim() ||
  process.env.HOST_LOCAL?.trim();

const DB_PORT =
  Number(process.env.PORT_PROD?.trim()) ||
  Number(process.env.PORT?.trim()) ||
  Number(process.env.PORT_LOCAL?.trim());

const DB_USER =
  process.env.USERNAME_PROD?.trim() ||
  process.env.USERNAME?.trim() ||
  process.env.USERNAME_LOCAL?.trim();

const DB_PASSWORD =
  process.env.PASSWORD_PROD ??
  process.env.PASSWORD ??
  process.env.PASSWORD_LOCAL;

const DB_NAME =
  process.env.DATABASE_PROD?.trim() ||
  process.env.DATABASE?.trim() ||
  process.env.DATABASE_LOCAL?.trim();

// CA from env (preferred in cloud) or from file path (local dev)
const SSL_CA_RAW = process.env.DB_SSL_CA;       // raw PEM text (Render)
const SSL_CA_B64 = process.env.DB_SSL_CA_B64;   // optional base64-encoded PEM
const SSL_CA_PATH = process.env.SSL_CA_PATH;    // local file path (dev only)

// Validate essentials
const missing = [];
if (!DB_HOST) missing.push('HOST_PROD | HOST | HOST_LOCAL');
if (!DB_PORT || Number.isNaN(DB_PORT)) missing.push('PORT_PROD | PORT | PORT_LOCAL (numeric Aiven MySQL port)');
if (!DB_USER) missing.push('USERNAME_PROD | USERNAME | USERNAME_LOCAL');
if (!DB_PASSWORD) missing.push('PASSWORD_PROD | PASSWORD | PASSWORD_LOCAL');
if (!DB_NAME) missing.push('DATABASE_PROD | DATABASE | DATABASE_LOCAL');
if (missing.length) {
  throw new Error(`[DB] Missing required env(s): ${missing.join(', ')}`);
}

// Build SSL options
let sslOptions;
try {
  if (SSL_CA_RAW && SSL_CA_RAW.trim().length > 0) {
    // Inline PEM provided in env (Render best practice)
    sslOptions = { ca: SSL_CA_RAW };
  } else if (SSL_CA_B64 && SSL_CA_B64.trim().length > 0) {
    const caPem = Buffer.from(SSL_CA_B64, 'base64').toString('utf8');
    sslOptions = { ca: caPem };
  } else if (SSL_CA_PATH) {
    // For local dev only: read from file path
    const fs = await import('fs');
    const caPem = fs.readFileSync(SSL_CA_PATH, 'utf8');
    sslOptions = { ca: caPem };
  } else {
    // If Aiven requires verification, you should provide the CA.
    console.warn('[DB] No CA provided (DB_SSL_CA | DB_SSL_CA_B64 | SSL_CA_PATH). TLS will be attempted without verification.');
    sslOptions = undefined;
  }
} catch (e) {
  console.error('[DB] Failed to load CA:', e.message);
  throw e;
}

console.log('[DB] Connecting', {
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  caSource: SSL_CA_RAW ? 'env:DB_SSL_CA' : SSL_CA_B64 ? 'env:DB_SSL_CA_B64' : SSL_CA_PATH ? 'file' : 'none'
});

// Create pool
const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,          // Aiven MySQL port (NOT your HTTP server port)
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  ssl: sslOptions,        // TLS with CA verification if provided
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 20000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 5000
}).promise();

// Startup ping
(async () => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    console.log('[DB] Startup ping ok:', rows[0]);
  } catch (err) {
    console.error('[DB] Startup ping failed:', err.code || err.message, err);
  }
})();

export const dbEnd = async () => {
  try {
    await pool.end();
    console.log('[DB] Pool closed');
  } catch (e) {
    console.error('[DB] Error closing pool:', e);
  }
};

export default pool;
