'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [editId, setEditId] = useState(null); // Track which todo is being edited

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch('/api/todos');
      const data = await res.json();
      setTodos(data.todos);
      
    } catch (error) {
      
      toast.error(data.message||"Unable to fetch")
    }
  };

  const handleSubmit = async () => {
    
    try {
      if (!title.trim()) return;
    
      if (editId) {
        // Update existing todo
        const res = await fetch(`/api/todos/${editId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title }),
        });
        const data =  await res.json();
        if(data.success){
          toast.success(data.message||"todo edited success")
        }else{
          toast.error(data.message||"unable to edit todo")
        }
        setEditId(null);
      } else {
        // Add new todo
        const res = await fetch('/api/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title }),
        });
        const data =  await res.json();
        if(data.success){
          toast.success(data.message||"todo added success")
        }else{
          toast.error(data.message||"unable to add todo")
        }
        
      }
    
      setTitle('');
      fetchTodos();
      
    } catch (error) {
      toast.error("Serevr issue")
    }
  };

  const startEdit = async (id) => {
    const res = await fetch(`/api/todos/${id}`);
    const todoData = await res.json();
    setTitle(todoData.title);
    setEditId(id);
  };

  const toggleTodo = async (id, completed) => {
    await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed }),
    });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if(data.success){
        toast.success(data.message||"todo deleted success")

      }
      fetchTodos();
      
    } catch (error) {
      toast.error("Unable top delete",error.msg)
    }
  };

  return (
   <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 sm:p-6">
  <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-4 sm:p-6 w-full max-w-lg">
    <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
      Todo List
    </h1>

    {/* Input & Button */}
    <div className="flex mb-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter todo..."
        className="flex-1 px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
      />
      <button
        onClick={handleSubmit}
        className={`${
          editId
            ? 'bg-green-500 hover:bg-green-600'
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white font-semibold px-3 sm:px-4 py-2 rounded-r-lg transition`}
      >
        {editId ? 'Update' : 'Add'}
      </button>
    </div>

    {/* Todo List */}
    <ul className="space-y-3">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex flex-col sm:flex-row justify-between sm:items-center bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 sm:px-4 py-3 shadow-sm hover:shadow-md transition"
        >
          <span
            className={`cursor-pointer text-lg break-words ${
              todo.completed
                ? 'line-through text-gray-400 dark:text-gray-500'
                : 'text-gray-800 dark:text-gray-100'
            }`}
            onClick={() => toggleTodo(todo.id, todo.completed)}
          >
            {todo.title}
          </span>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <button
              onClick={() => startEdit(todo.id)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
</div>

  );
}
