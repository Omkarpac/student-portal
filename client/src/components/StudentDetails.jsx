import ExamTable from './ExamTable.jsx';

// Receives several props describing the detail panel's situation.
function StudentDetail({ selectedId, detail, loading, error }) {
  if (selectedId === null) return <p className="status">Select a student to see their exams.</p>;
  if (loading) return <p className="status">Loading subjects…</p>;
  if (error)   return <p className="status error">Could not load: {error}</p>;
  if (!detail) return null;

  return (
    <>
      <h2>{detail.student.name}</h2>
      <ExamTable subjects={detail.subjects} />   {/* pass data DOWN to the child */}
    </>
  );
}

export default StudentDetail;