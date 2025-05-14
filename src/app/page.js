'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  // Fetch todos
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/todos');
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        const data = await response.json();
        setTodos(data);
        setError(null);
      } catch (err) {
        setError('Failed to load todos. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  // Add a new todo
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTodoTitle }),
      });

      if (!response.ok) {
        throw new Error('Failed to add todo');
      }

      const newTodo = await response.json();
      setTodos([newTodo, ...todos]);
      setNewTodoTitle('');
    } catch (err) {
      setError('Failed to add todo. Please try again.');
      console.error(err);
    }
  };

  // Toggle todo completion status
  const handleToggleTodo = async (id, completed) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completed }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      const updatedTodo = await response.json();
      setTodos(
        todos.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      console.error(err);
    }
  };

  // Delete a todo
  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError('Failed to delete todo. Please try again.');
      console.error(err);
    }
  };

  // Filter todos based on selected filter
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all' filter
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-blue-500 text-white flex items-center justify-between">
          <h1 className="text-xl font-bold">Todo App with Prisma & D1</h1>
          <Image
            src="/next.svg"
            alt="Next.js Logo"
            width={60}
            height={20}
            className="invert"
          />
        </div>

        {/* Add Todo Form */}
        <form onSubmit={handleAddTodo} className="p-6 border-b">
          <div className="flex items-center">
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="Add a new todo..."
              className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 transition-colors"
            >
              Add
            </button>
          </div>
        </form>

        {/* Filter Buttons */}
        <div className="flex justify-center p-4 bg-gray-50">
          <button
            onClick={() => setFilter('all')}
            className={`mx-1 px-3 py-1 rounded ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`mx-1 px-3 py-1 rounded ${
              filter === 'active'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`mx-1 px-3 py-1 rounded ${
              filter === 'completed'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100 text-red-700 border-l-4 border-red-500">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Loading todos...</div>
        ) : (
          /* Todo List */
          <ul className="divide-y divide-gray-200">
            {filteredTodos.length === 0 ? (
              <li className="p-6 text-center text-gray-500">
                {filter === 'all'
                  ? 'No todos yet. Add one above!'
                  : filter === 'active'
                  ? 'No active todos!'
                  : 'No completed todos!'}
              </li>
            ) : (
              filteredTodos.map((todo) => (
                <li key={todo.id} className="p-4 flex items-center">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id, todo.completed)}
                    className="h-5 w-5 text-blue-500 rounded mr-3"
                  />
                  <span
                    className={`flex-grow ${
                      todo.completed ? 'line-through text-gray-400' : ''
                    }`}
                  >
                    {todo.title}
                  </span>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </li>
              ))
            )}
          </ul>
        )}

        {/* Footer */}
        <div className="p-4 bg-gray-50 text-center text-sm text-gray-500">
          <p>
            Built with Next.js, Prisma, and Cloudflare D1
          </p>
        </div>
      </div>
    </div>
  );
}
