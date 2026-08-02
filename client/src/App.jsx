import { useState, useEffect } from 'react';
import StudentList from './components/StudentList.jsx';
import StudentDetail from './components/StudentDetails.jsx';
import './App.css';

function App() {
  const [students, setStudents]   = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);

  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail]         = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError]     = useState(null);
  const [query, setQuery] = useState('');

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

  useEffect(() => {
    if (selectedId === null) return;
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
  }, [selectedId]);

  if (listLoading) return <p className="status">Loading students…</p>;
  if (listError)   return <p className="status error">Could not load: {listError}</p>;
  // Derived state: compute the filtered list each render — don't store it.
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(query.toLowerCase())
  );
  console.log('query:', query, '→ matches:', filteredStudents.length);   // ← add this
  // .toLowerCase() on both sides = case-insensitive match.
  // .includes() = substring match anywhere in the name.

  return (
    <div className="app">
      <header>
        <h1>Student Portal</h1>
        <p>{students.length} students</p>
          <input
          className="search"
          type="text"
          placeholder="Search students…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </header>
      
      <main className="layout">
        {/* pass DATA down and a CALLBACK down */}
        <StudentList
          students={filteredStudents}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <section className="detail">
          <StudentDetail
            selectedId={selectedId}
            detail={detail}
            loading={detailLoading}
            error={detailError}
          />
        </section>
      </main>
    </div>
  );
}

export default App;