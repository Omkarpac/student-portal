// ─────────────────────────────────────────────────────────
// Student Portal API — server entry point
// Responsibilities: middleware, mount routers, start server.
// The actual route logic lives in routes/.
// ─────────────────────────────────────────────────────────
import express from 'express';
import dotenv from 'dotenv';
import pool from './db.js';
import studentsRouter from './routes/students.js';
import subjectsRouter from './routes/subjects.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ── Routes ──
app.get('/', (req, res) => {
  res.json({ message: 'Student Portal API', version: '1.0.0' });
});
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount the routers — every path in studentsRouter is now
// prefixed with /api/students, and subjectsRouter with /api/subjects.
app.use('/api/students', studentsRouter);
app.use('/api/subjects', subjectsRouter);

// ── Startup DB check ──
async function testDatabaseConnection() {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) AS count FROM students');
    console.log(`✓ Database connected — ${rows[0].count} students found`);
  } catch (err) {
    console.error('✗ Database connection failed:', err.message);
    process.exit(1);
  }
}

app.listen(PORT, async () => {
  console.log(`✓ Server running at http://localhost:${PORT}`);
  await testDatabaseConnection();
});