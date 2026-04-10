const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let tasks = [];

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const newTask = {
    id: Date.now().toString(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.patch('/tasks/:id', (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  task.completed = !task.completed;
  res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  tasks = tasks.filter((t) => t.id !== req.params.id);
  res.json({ message: 'Task deleted' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});