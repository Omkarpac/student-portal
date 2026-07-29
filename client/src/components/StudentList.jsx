// Receives `students` (data) and `onSelect` (a FUNCTION prop — the callback).
// When a name is clicked, it calls onSelect(id) — telling the PARENT what happened.
// The list doesn't know or care what selecting does; that's the parent's job.
function StudentList({ students, selectedId, onSelect }) {
  return (
    <ul className="student-list">
      {students.map((student) => (
        <li
          key={student.id}
          className={student.id === selectedId ? 'selected' : ''}
          onClick={() => onSelect(student.id)}  
        >
          {student.name}
        </li>
      ))}
    </ul>
  );
}

export default StudentList;