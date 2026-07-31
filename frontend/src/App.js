import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/todos');
      if (!res.ok) {
        throw new Error('Failed to fetch tasks from server.');
      }
      const data = await res.json();
      setTodos(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  // Add a new todo task
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: newTask.trim() }),
      });

      if (!res.ok) {
        throw new Error('Failed to create task1.');
      }

      const createdTodo = await res.json();
      setTodos((prevTodos) => [createdTodo, ...prevTodos]);
      setNewTask('');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  // Toggle todo status (done / undone)
  const toggleTodo = async (id) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
      });

      if (!res.ok) {
        throw new Error('Failed to update task.');
      }

      const updatedTodo = await res.json();
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete a todo task
  const deleteTodo = async (id) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete task.');
      }

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Filter logic
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.done;
    if (filter === 'completed') return todo.done;
    return true;
  });

  const completedCount = todos.filter((todo) => todo.done).length;
  const totalCount = todos.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="logo-wrapper">
          <div className="logo-icon">✓</div>
          <h1 className="app-title">TaskFlow</h1>
        </div>
        <p className="app-subtitle">Elevate your daily productivity</p>
      </header>

      {/* Main glass card content */}
      <main className="glass-card">
        {/* Error Alert */}
        {error && (
          <div className="error-alert">
            <span>{error}</span>
            <button className="btn-close-alert" onClick={() => setError('')}>
              ×
            </button>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={addTodo} className="todo-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="What needs to be done?"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="todo-input"
              maxLength={255}
            />
          </div>
          <button type="submit" className="btn-add">
            Add Task
          </button>
        </form>

        {/* Meta details & tabs */}
        <div className="todo-meta-header">
          <div className="todo-stats">
            Tasks: <span className="todo-stats-highlight">{completedCount}</span> of{' '}
            <span className="todo-stats-highlight">{totalCount}</span> completed
          </div>

          <div className="filter-tabs">
            <button
              onClick={() => setFilter('all')}
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* List Content */}
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <span>Syncing database...</span>
          </div>
        ) : filteredTodos.length > 0 ? (
          <div className="todo-list">
            {filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`todo-item ${todo.done ? 'completed' : ''}`}
              >
                <div className="todo-item-left" onClick={() => toggleTodo(todo.id)}>
                  <div className="checkbox-custom">
                    <div className="checkbox-icon"></div>
                  </div>
                  <span className="todo-text">{todo.task}</span>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="btn-delete"
                  title="Delete task"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <h3 className="empty-title">
              {filter === 'all'
                ? 'All caught up!'
                : filter === 'active'
                ? 'No pending tasks'
                : 'No completed tasks'}
            </h3>
            <p className="empty-desc">
              {filter === 'all'
                ? 'Add a new task above to get started with your day.'
                : filter === 'active'
                ? 'You have completed all your tasks. Great job!'
                : 'Tasks you complete will appear here.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
