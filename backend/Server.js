const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/db');
const Todo = require('./models/Todo');

const app = express();
app.use(cors());
app.use(express.json());

// Sync Database
sequelize.sync()
  .then(() => console.log('MySQL connected and synced'))
  .catch(err => console.error('Database connection error:', err));

// GET all todos
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.findAll({ order: [['createdAt', 'DESC']] });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new todo
app.post('/api/todos', async (req, res) => {
  try {
    const { task } = req.body;
    if (!task) {
      return res.status(400).json({ error: 'Task is required' });
    }
    const newTodo = await Todo.create({ task });
    res.json(newTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE (mark done/undone)
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByPk(id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    todo.done = !todo.done;
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByPk(id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    await todo.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));