import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(); }, []);

  const addTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) throw new Error();

      setTitle('');
      fetchTasks();
    } catch (err) {
      setError('Failed to add task');
    }};

  const toggleTask = async (id) => {
    try {
      await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'PATCH',
      });
      fetchTasks();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'DELETE',
      });
      fetchTasks();
    } catch (err) {
      setError('Failed to delete task');
    }
  }; return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h1>Task Manager</h1>

      <form onSubmit={addTask} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task"
          style={{ padding: '10px', width: '70%' }}
        />
        <button type="submit" style={{ padding: '10px', marginLeft: '10px' }}>
          Add
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((task) => (
          <li
            key={task.id}  style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
              padding: '10px',
              border: '1px solid #ccc',
            }}
          >
            <span
              onClick={() => toggleTask(task.id)}
              style={{
                cursor: 'pointer',
                textDecoration: task.completed ? 'line-through' : 'none',
              }}
            >
              {task.title}
            </span>

            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>  );
}

export default App;