// ─────────────────────────────────────────────────────────
// Database connection pool.
// Everything that touches MySQL imports `pool` from here,
// so connection config lives in exactly ONE place.
// ─────────────────────────────────────────────────────────
import mysql from 'mysql2/promise';   // /promise = the async/await API
                                       // (without it you get callbacks)
import dotenv from 'dotenv';

dotenv.config();   // reads .env and puts values on process.env.
                   // Must run BEFORE we read any process.env values below.

// createPool, not createConnection — see the explanation below.
const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,   // if all connections are busy, QUEUE the
                              // request instead of throwing an error
  connectionLimit: 10,        // max simultaneous connections
  queueLimit: 0               // 0 = unlimited queue
});

export default pool;