// ─────────────────────────────────────────────────────────
// Routes for /api/students
// Mounted in index.js — paths here are RELATIVE to that mount.
// ─────────────────────────────────────────────────────────
import express from 'express';
import pool from '../db.js';        // ../ because we're now one folder deeper

const router = express.Router();    // a mini-app you attach routes to

// GET /api/students  →  here it's just '/'
// The '/api/students' prefix comes from where we mount this in index.js.
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, enrolled_year FROM students ORDER BY name'
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /api/students failed:', err.message);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// GET /api/students/:id  →  here it's '/:id'  (NEW — single student details)
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, enrolled_year FROM students WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(rows[0]);              // one object, not an array
  } catch (err) {
    console.error('GET /api/students/:id failed:', err.message);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// GET /api/students/:id/subjects  →  here it's '/:id/subjects'
router.get('/:id/subjects', async (req, res) => {
  const studentId = req.params.id;
  try {
    const [students] = await pool.query(
      'SELECT id, name FROM students WHERE id = ?',
      [studentId]
    );
    if (students.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
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
    res.json({ student: students[0], subjects });
  } catch (err) {
    console.error('GET /api/students/:id/subjects failed:', err.message);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

export default router;              // hand this router to index.js