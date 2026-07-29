import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // ── student list state (yesterday's work) ──
  const [students, setStudents]   = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);

  // ── NEW: which student is selected, and their subjects ──
  const [selectedId, setSelectedId] = useState(null);   // null = none selected yet
  const [detail, setDetail]         = useState(null);   // { student, subjects }
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError]     = useState(null);

  // ── Effect 1: fetch the student list once on mount (unchanged) ──
  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch('http://localhost:3000/api/students');
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        setStudents(await res.json());
      } catch (err) {
        setListError(err.message);
      } finally {
        setListLoading(false);
      }
    }
    fetchStudents();
  }, []);

  // ── Effect 2: NEW — fetch the selected student's subjects ──
  // Runs whenever selectedId changes (not on mount, because it starts null).
  useEffect(() => {
    if (selectedId === null) return;   // nothing selected → do nothing

    async function fetchDetail() {
      setDetailLoading(true);
      setDetailError(null);
      try {
        const res = await fetch(`http://localhost:3000/api/students/${selectedId}/subjects`);
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        setDetail(await res.json());
      } catch (err) {
        setDetailError(err.message);
      } finally {
        setDetailLoading(false);
      }
    }
    fetchDetail();
  }, [selectedId]);   // ← dependency: re-run when the selected student changes

  if (listLoading) return <p className="status">Loading students…</p>;
  if (listError)   return <p className="status error">Could not load: {listError}</p>;

  return (
    <div className="app">
      <header>
        <h1>Student Portal</h1>
        <p>{students.length} students</p>
      </header>

      {/* two-panel layout: list on the left, detail on the right */}
      <main className="layout">
        <ul className="student-list">
          {students.map((student) => (
            <li
              key={student.id}
              className={student.id === selectedId ? 'selected' : ''}
              onClick={() => setSelectedId(student.id)}   
            >
              {student.name}
            </li>
          ))}
        </ul>

        <section className="detail">
          {selectedId === null && <p className="status">Select a student to see their exams.</p>}
          {detailLoading && <p className="status">Loading subjects…</p>}
          {detailError && <p className="status error">Could not load: {detailError}</p>}

          {detail && !detailLoading && (
            <>
              <h2>{detail.student.name}</h2>
              {detail.subjects.length === 0 ? (
                <p className="status">No subjects enrolled.</p>   /* the empty state */
              ) : (
                <table className="exam-table">
                  <thead>
                    <tr><th>Code</th><th>Subject</th><th>Exam Date</th><th>Location</th></tr>
                  </thead>
                  <tbody>
                    {detail.subjects.map((sub, i) => (
                      <tr key={i}>
                        <td>{sub.subject_code}</td>
                        <td>{sub.subject_name}</td>
                        <td>{formatDate(sub.exam_date)}</td>
                        <td>{sub.location || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

// Helper: turn "2026-05-14T00:00:00.000Z" into "14 May 2026".
// Handles null (the CS205 LEFT JOIN case) gracefully.
function formatDate(dateStr) {
  if (!dateStr) return 'Not scheduled';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

export default App;