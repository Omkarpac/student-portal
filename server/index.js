// ─────────────────────────────────────────────────────────
// Student Portal API — server entry point
// ─────────────────────────────────────────────────────────
import express from 'express';
import dotenv from 'dotenv';
import pool from './db.js';   

// Create the application object. `app` is your server:
// you attach routes to it, then tell it to listen.
const app = express();

// The port to listen on. 3000 is a common convention for
// Node dev servers. (React will use 5173 later — two
// different servers, two different ports, same laptop.)
const PORT = 3000;

// ── MIDDLEWARE ────────────────────────────────────────────
// Middleware runs on every request BEFORE your routes.
// This one parses JSON request bodies into req.body.
// We don't need it yet (no POST routes), but it costs
// nothing and you'll need it the moment you add one.
app.use(express.json());

// A tiny logger, written by hand so you can see exactly
// what middleware is: a function with (req, res, next).
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();   // pass control to the next middleware/route.
            // FORGET next() and the request hangs forever —
            // the classic Express beginner bug.
});

// ── ROUTES ────────────────────────────────────────────────
// app.get(path, handler) — respond to HTTP GET at this path.
// req  = the incoming request  (url, headers, params, body)
// res  = the outgoing response (what you send back)
app.get('/', (req, res) => {
  res.json({
    message: 'Student Portal API',
    version: '1.0.0'
  });
  // res.json() sets Content-Type: application/json,
  // serializes the object, and sends it. One call does all three.
});

// A health-check endpoint. Real APIs have these so monitoring
// tools (and load balancers) can ask "are you alive?"
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── STARTUP DATABASE CHECK ────────────────────────────────
// Prove the DB works at boot, so a misconfiguration fails
// loudly NOW rather than mysteriously on the first request.
async function testDatabaseConnection() {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) AS count FROM students');
    console.log(`✓ Database connected — ${rows[0].count} students found`);
  } catch (err) {
    console.error('✗ Database connection failed:', err.message);
    process.exit(1);   // exit with a failure code — don't run a broken server
  }
}
app.listen(PORT, async () => {
  console.log(`✓ Server running at http://localhost:${PORT}`);
  await testDatabaseConnection();  
});