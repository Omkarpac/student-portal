-- Student Portal — core queries
-- These are the queries the Express API will run.
USE student_portal;

-- ═══════════════════════════════════════════════════════════
-- CORE QUERY: a student's subjects with their exam dates.
-- Powers: GET /api/students/:id/subjects
--
-- Path: students → student_subjects (junction) → subjects → exam_dates
-- LEFT JOIN on exam_dates so subjects without a scheduled exam
-- still appear (with NULL date) instead of vanishing.
-- The ? is a PLACEHOLDER — the API supplies the id as a bound
-- parameter, which prevents SQL injection (see Day 9).
-- ═══════════════════════════════════════════════════════════
SELECT
    sub.sub_id                  AS subject_id,
    sub.code                AS subject_code,
    sub.name                AS subject_name,
    ed.exam_date,
    ed.location
FROM students s
JOIN student_subjects ss ON ss.student_id = s.id
JOIN subjects sub        ON sub.id        = ss.subject_id
LEFT JOIN exam_dates ed  ON ed.subject_id = sub.sub_id
WHERE s.id = 1
ORDER BY ed.exam_date;

-- ═══════════════════════════════════════════════════════════
-- SUPPORTING QUERIES
-- ═══════════════════════════════════════════════════════════

-- All students (powers GET /api/students)
SELECT id, name, email, enrolled_year
FROM students
ORDER BY name;

-- One student's details (powers GET /api/students/:id)
SELECT id, name, email, enrolled_year
FROM students
WHERE id = ?;

-- All subjects (powers GET /api/subjects)
SELECT id, name, code
FROM subjects
ORDER BY code;