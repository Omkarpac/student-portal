// ExamTable — pure presentational component.
// Receives ONE prop: `subjects` (an array). Renders a table. That's it.
// No state, no fetching — just "given this data, show this markup."

function formatDate(dateStr) {
  if (!dateStr) return 'Not scheduled';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

function ExamTable({ subjects }) {   // ← destructure the prop right in the parameter
  if (subjects.length === 0) {
    return <p className="status">No subjects enrolled.</p>;
  }
  return (
    <table className="exam-table">
      <thead>
        <tr><th>Code</th><th>Subject</th><th>Exam Date</th><th>Location</th></tr>
      </thead>
      <tbody>
        {subjects.map((sub, i) => (
          <tr key={i}>
            <td>{sub.subject_code}</td>
            <td>{sub.subject_name}</td>
            <td>{formatDate(sub.exam_date)}</td>
            <td>{sub.location || '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ExamTable;