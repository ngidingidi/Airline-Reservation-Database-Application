
// database/db-connector.mjs
import 'dotenv/config';
import mysql from 'mysql2';

const DB_HOST = process.env.HOST_PROD?.trim();
const DB_PORT = Number(process.env.PORT_PROD?.trim()); // MUST be numeric (e.g., 21469)
const DB_USER = process.env.USERNAME_PROD?.trim();
const DB_PASSWORD = process.env.PASSWORD_PROD;
const DB_NAME = process.env.DATABASE_PROD?.trim();

// TLS CA sources
const SSL_CA_RAW = process.env.DB_SSL_CA;        // preferred on Render: raw PEM text
const SSL_CA_B64 = process.env.DB_SSL_CA_B64;    // optional base64 alternative
const SSL_CA_PATH = process.env.SSL_CA_PATH;     // dev only (file path)

// --- Validate essentials (fail fast with a clear message) ---
{
  const missing = [];
  if (!DB_HOST) missing.push('HOST_PROD');
  if (!DB_PORT || Number.isNaN(DB_PORT)) missing.push('PORT_PROD');
  if (!DB_USER) missing.push('USERNAME_PROD');
  if (!DB_PASSWORD) missing.push('PASSWORD_PROD');
  if (!DB_NAME) missing.push('DATABASE_PROD');
  if (missing.length) {
    throw new Error(`[DB] Missing required env(s): ${missing.join(', ')}`);
  }
}

// --- Build SSL options (Aiven typically requires its project CA) ---
let sslOptions;
try {
  if (SSL_CA_RAW && SSL_CA_RAW.trim().length > 0) {
    sslOptions = { ca: SSL_CA_RAW, rejectUnauthorized: true };
  } else if (SSL_CA_B64 && SSL_CA_B64.trim().length > 0) {
    const caPem = Buffer.from(SSL_CA_B64, 'base64').toString('utf8');
    sslOptions = { ca: caPem, rejectUnauthorized: true };
  } else if (SSL_CA_PATH) {
    const fs = await import('fs');
    const caPem = fs.readFileSync(SSL_CA_PATH, 'utf8');
    sslOptions = { ca: caPem, rejectUnauthorized: true };
    console.warn('[DB] Loaded CA from file path (dev only).');
  } else {
    console.warn('[DB] No CA provided (DB_SSL_CA | DB_SSL_CA_B64 | SSL_CA_PATH). TLS verification may fail on Aiven.');
    sslOptions = undefined; // For local dev only; Aiven usually requires CA verification.
  }
} catch (e) {
  console.error('[DB] Failed to load CA:', e.message);
  throw e;
}

// --- Diagnostics (no secrets) ---
console.log('[DB] Connecting', {
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  caPresent: Boolean(sslOptions?.ca),
});

// --- Create pool ---
const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,               // <= 21469 (your Aiven port)
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  ssl: sslOptions,             // TLS with Aiven project CA
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 30000,       // give TLS handshake time
  enableKeepAlive: true,
  keepAliveInitialDelay: 5000,
}).promise();

// --- Startup ping with small retry loop (helps transient network hiccups) ---
(async () => {
  const attempts = 3;
  for (let i = 1; i <= attempts; i++) {
    try {
      const [rows] = await pool.query('SELECT 1 AS ok');
      console.log('[DB] Startup ping ok:', rows?.[0]);
      break;
    } catch (err) {
      console.error(`[DB] Startup ping attempt ${i}/${attempts} failed:`, err.code || err.message);
      if (i === attempts) console.error('[DB] Giving up after retries.');
      else await new Promise(r => setTimeout(r, 1500));
    }
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
