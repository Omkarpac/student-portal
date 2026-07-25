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
// GET /api/students — return all students
app.get('/api/students', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, enrolled_year FROM students ORDER BY name'
    );
    res.json(rows);                    // send the array as JSON
  } catch (err) {
    console.error('GET /api/students failed:', err.message);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});
// GET /api/students/:id/subjects
// Returns one student's subjects with their exam dates.
// :id is a URL PARAMETER — a placeholder in the path.
app.get('/api/students/:id/subjects', async (req, res) => {
  const studentId = req.params.id;   // pull ":id" from the URL

  try {
    // First: does this student exist? (So we can 404 correctly.)
    const [students] = await pool.query(
      'SELECT id, name FROM students WHERE id = ?',
      [studentId]
    );

    if (students.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // The core JOIN from Day 5 — note the ? placeholder.
    const [subjects] = await pool.query(
      `SELECT
      sub.sub_id                  AS subject_id,
      sub.code                AS subject_code,
      sub.name                AS subject_name,
      ed.exam_date,
      ed.location
      FROM students s
      JOIN student_subjects ss ON ss.student_id = s.id
      JOIN subjects sub        ON sub.sub_id        = ss.sub_id
      LEFT JOIN exam_dates ed  ON ed.sub_id = sub.sub_id
      WHERE s.id = 1
      ORDER BY ed.exam_date;`,
      [studentId]
    );

    // Return the student plus their subjects, together.
    res.json({
      student: students[0],
      subjects: subjects
    });

  } catch (err) {
    console.error('GET /api/students/:id/subjects failed:', err.message);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});