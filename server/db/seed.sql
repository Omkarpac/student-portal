-- Student Portal — seed data
-- Run AFTER schema.sql. Safe to re-run (clears data first).
USE student_portal;

-- Clear existing data, CHILDREN FIRST (same reason as schema.sql's DROP order)
DELETE FROM exam_dates;
DELETE FROM student_subjects;
DELETE FROM subjects;
DELETE FROM students;

-- Reset the auto-increment counters so ids start at 1 again
ALTER TABLE students  AUTO_INCREMENT = 1;
ALTER TABLE subjects  AUTO_INCREMENT = 1;
ALTER TABLE exam_dates AUTO_INCREMENT = 1;

INSERT INTO subjects(name,code) VALUES 
    ('Data structures and algorithms', 'CS101'),
    ('Database systems', 'CS102'),
    ('Operating systems', 'CS103'),
    ('Computer Networks', 'CS104'),
    ('Machine Learning', 'CS201'),
    ('Web programming', 'CS202'),
    ('Efficient Algorithms', 'CS203'),
    ('Data Mining & Visualisation', 'CS204');

-- ── STUDENTS (30) ─────────────────────────────────────────
INSERT INTO students (name, email, enrolled_year) VALUES
    ('Aarav Sharma',      'aarav.sharma@university.edu',    2023),
    ('Priya Patel',       'priya.patel@university.edu',     2023),
    ('Rohan Mehta',       'rohan.mehta@university.edu',     2023),
    ('Sneha Iyer',        'sneha.iyer@university.edu',      2024),
    ('Arjun Nair',        'arjun.nair@university.edu',      2023),
    ('Ananya Reddy',      'ananya.reddy@university.edu',    2024),
    ('Vikram Singh',      'vikram.singh@university.edu',    2022),
    ('Isha Gupta',        'isha.gupta@university.edu',      2024),
    ('Karan Malhotra',    'karan.malhotra@university.edu',  2023),
    ('Meera Joshi',       'meera.joshi@university.edu',     2022),
    ('Aditya Kumar',      'aditya.kumar@university.edu',    2024),
    ('Riya Desai',        'riya.desai@university.edu',      2023),
    ('Siddharth Rao',     'siddharth.rao@university.edu',   2022),
    ('Kavya Menon',       'kavya.menon@university.edu',     2024),
    ('Nikhil Verma',      'nikhil.verma@university.edu',    2023),
    ('Tanvi Kulkarni',    'tanvi.kulkarni@university.edu',  2024),
    ('Rahul Chopra',      'rahul.chopra@university.edu',    2022),
    ('Diya Bhatt',        'diya.bhatt@university.edu',      2023),
    ('Aryan Saxena',      'aryan.saxena@university.edu',    2024),
    ('Nisha Agarwal',     'nisha.agarwal@university.edu',   2023),
    ('Manav Trivedi',     'manav.trivedi@university.edu',   2022),
    ('Pooja Shetty',      'pooja.shetty@university.edu',    2024),
    ('Devansh Mishra',    'devansh.mishra@university.edu',  2023),
    ('Sanya Kapoor',      'sanya.kapoor@university.edu',    2024),
    ('Harsh Pandey',      'harsh.pandey@university.edu',    2022),
    ('Neha Bansal',       'neha.bansal@university.edu',     2023),
    ('Yash Thakur',       'yash.thakur@university.edu',     2024),
    ('Aisha Khan',        'aisha.khan@university.edu',      2023),
    ('Rudra Deshmukh',    'rudra.deshmukh@university.edu',  2022),
    ('Omkar Pachore',     'omkar.pachore@university.edu',   2024);

-- ── EXAM DATES (a midterm and a final per subject) ─────────
INSERT INTO exam_dates (sub_id, exam_date, location) VALUES
    (1, '2026-03-10', 'Hall A'),   (1, '2026-05-14', 'Hall A'),
    (2, '2026-03-12', 'Hall B'),   (2, '2026-05-16', 'Hall B'),
    (3, '2026-03-14', 'Hall A'),   (3, '2026-05-18', 'Lab 2'),
    (4, '2026-03-16', 'Hall C'),   (4, '2026-05-20', 'Hall C'),
    (5, '2026-03-18', 'Lab 1'),    (5, '2026-05-22', 'Lab 1'),
    (6, '2026-03-20', 'Lab 2'),    (6, '2026-05-24', 'Lab 2'),
    (7, '2026-03-22', 'Hall B'),   (7, '2026-05-26', 'Hall B'),
    (8, '2026-03-24', 'Hall C'),   (8, '2026-05-28', 'Hall C');

-- ── ENROLLMENTS (junction table) ──────────────────────────
-- Generate them with a CROSS JOIN + a filter, instead of typing 160 rows.
INSERT INTO student_subjects (student_id, sub_id)
SELECT s.id, sub.sub_id
FROM students s
CROSS JOIN subjects sub
WHERE (s.id + sub.sub_id) % 3 <> 0;