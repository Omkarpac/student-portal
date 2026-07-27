import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET /api/subjects — all subjects
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT sub_id, name, code FROM subjects ORDER BY code'
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /api/subjects failed:', err.message);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

export default router;