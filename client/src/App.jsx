import { useState, useEffect } from 'react';   // import the two hooks
import './App.css';

function App() {
  // ── STATE: three pieces, one per "situation" a fetch can be in ──
  const [students, setStudents] = useState([]);      // the data (starts empty)
  const [loading, setLoading]   = useState(true);    // true until the fetch finishes
  const [error, setError]       = useState(null);    // holds an error message, if any

  // ── EFFECT: fetch once, after the first render ──
  useEffect(() => {
    // We define an async function INSIDE the effect and call it.
    // (The effect callback itself can't be async — a React rule —
    //  so this is the standard workaround.)
    async function fetchStudents() {
      try {
        const res = await fetch('http://localhost:3000/api/students');
        if (!res.ok) {
          // fetch does NOT throw on 404/500 — you must check res.ok yourself.
          // (This is THE fetch gotcha; it only throws on network failure.)
          throw new Error(`Server responded ${res.status}`);
        }
        const data = await res.json();   // parse the JSON body
        setStudents(data);               // store it → triggers a re-render
      } catch (err) {
        setError(err.message);           // network down or bad response
      } finally {
        setLoading(false);               // runs either way → stop showing "Loading"
      }
    }
    fetchStudents();
  }, []);   // empty array = run once on mount

  // ── RENDER: handle all THREE states, in order ──
  if (loading) return <p className="status">Loading students…</p>;
  if (error)   return <p className="status error">Could not load students: {error}</p>;

  return (
    <div className="app">
      <header>
        <h1>Student Portal</h1>
        <p>{students.length} students</p>   {/* real count now, not hardcoded */}
      </header>

      <main>
        <ul className="student-list">
          {students.map((student) => (
            <li key={student.id}>          {/* key — see the explanation below */}
              {student.name}
              <span className="email">{student.email}</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;