// App.jsx — the root component of the Student Portal frontend.
// A component is a function that returns JSX (markup written in JS).
import './App.css';

function App() {
  // Plain JS can run up here, before the return.
  const title = 'Student Portal';
  const studentCount = 30;   // hardcoded for now; real data arrives tomorrow

  // Everything returned is JSX. It LOOKS like HTML but it's JavaScript.
  return (
    <div className="app">
      <header>
        <h1>{title}</h1>       {/* {curly braces} embed JS expressions into JSX */}
        <p>Tracking {studentCount} students and their exam schedules</p>
      </header>

      <main>
        <p>Student list coming tomorrow…</p>
      </main>
    </div>
  );
}

export default App;   // makes this component importable (main.jsx imports it)