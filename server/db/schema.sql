-- Student Portal — database schema
-- Run with: mysql -u root -p student_portal < schema.sql
-- (or open in MySQL Workbench and execute)

-- Drop tables if re-running, CHILDREN FIRST (see note on order below)
DROP TABLE IF EXISTS exam_dates;
DROP TABLE IF EXISTS student_subjects;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS students;


-- ─────────────────────────────────────────────────────────
-- STUDENTS — one row per student
-- ─────────────────────────────────────────────────────────
create table students(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name    VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    enrolled_year INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- ─────────────────────────────────────────────────────────
-- SUBJECTS — one row per subject/course
-- ─────────────────────────────────────────────────────────
create table subjects(
    sub_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE
);

-- ─────────────────────────────────────────────────────────
-- EXAM_DATES — one row per exam for a subject (one-to-many)
-- ─────────────────────────────────────────────────────────
create table exam_dates(
    id INT AUTO_INCREMENT PRIMARY KEY,
    sub_id INT NOT NULL,
    exam_date DATE NOT NULL,
    location VARCHAR(100),
    FOREIGN KEY(sub_id) REFERENCES subjects(sub_id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────
-- STUDENT_SUBJECTS — the JUNCTION table (many-to-many)
-- One row = "this student takes this subject"
-- ─────────────────────────────────────────────────────────
create table student_subjects(
    student_id INT NOT NULL,
    sub_id INT NOT NULL,
    PRIMARY KEY(student_id,sub_id),
    FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY(sub_id) REFERENCES subjects(sub_id) ON DELETE CASCADE
);