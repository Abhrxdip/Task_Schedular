import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Calendar, Clock, AlertCircle, CheckCircle, XCircle, Users, Bell } from 'lucide-react';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const TaskScheduler = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: 'medium',
    status: 'pending',
    assignee: '',
    email: ''
  });
  const [persons, setPersons] = useState([]);
  const [notifyStatus, setNotifyStatus] = useState('');

  useEffect(() => {
    fetchTasks();
    fetchPersons();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.TASKS}`);
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to fetch tasks. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPersons = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.PERSONS}`);
      setPersons(response.data);
    } catch (err) {
      // optional: could set error
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      // Generate a unique ID
      const taskId = Math.max(...tasks.map(t => t.id), 0) + 1;
      const taskToAdd = { ...newTask, id: taskId };
      
      await axios.post(`${API_BASE_URL}${API_ENDPOINTS.TASKS}`, taskToAdd);
      setTasks([...tasks, taskToAdd]);
      setNewTask({
        title: '',
        description: '',
        deadline: '',
        priority: 'medium',
        status: 'pending',
        assignee: '',
        email: ''
      });
      setShowAddForm(false);
      fetchPersons();
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to add task. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const triggerNotifier = async () => {
    try {
      setNotifyStatus('Running...');
      await axios.post(`${API_BASE_URL}${API_ENDPOINTS.NOTIFY_RUN}`);
      setNotifyStatus('Notifications processed');
    } catch (err) {
      setNotifyStatus(`Failed: ${err.message || 'Unknown error'}`);
    } finally {
      setTimeout(() => setNotifyStatus(''), 4000);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      setLoading(true);
      setError('');
      const task = tasks.find(t => t.id === taskId);
      const updatedTask = { ...task, status: newStatus };
      
      await axios.put(`${API_BASE_URL}${API_ENDPOINTS.TASKS}/${taskId}`, updatedTask);
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task status.');
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      setLoading(true);
      setError('');
      await axios.delete(`${API_BASE_URL}${API_ENDPOINTS.TASKS}/${taskId}`);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task.');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'pending': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default: return <XCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Task Scheduler</h1>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Task
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Add Task Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
            <form onSubmit={addTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assignee
                  </label>
                  <input
                    type="text"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Person name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newTask.email}
                    onChange={(e) => setNewTask({...newTask, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="person@example.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline
                  </label>
                  <input
                    type="datetime-local"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Task'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tasks List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Tasks ({tasks.length})</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchPersons}
                  className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded"
                  title="Refresh persons"
                >
                  <Users className="w-4 h-4" /> Persons
                </button>
                <button
                  onClick={triggerNotifier}
                  className="flex items-center gap-2 text-sm bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-2 rounded"
                  title="Run notifier now"
                >
                  <Bell className="w-4 h-4" /> Notify now
                </button>
              </div>
            </div>
            {notifyStatus && (
              <p className="mt-2 text-sm text-gray-600">{notifyStatus}</p>
            )}
          </div>
          
          {loading && !tasks.length ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No tasks yet. Add your first task to get started!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <div key={task.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(task.status)}
                        <h3 className="text-lg font-medium text-gray-900">
                          {task.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      
                      {task.description && (
                        <p className="text-gray-600 mb-2">{task.description}</p>
                      )}
                      
                      {task.deadline && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>Due: {new Date(task.deadline).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete task"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md mt-6">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2"><Users className="w-5 h-5"/> Persons</h2>
            <button
              onClick={fetchPersons}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded"
            >Refresh</button>
          </div>
          <div className="p-6">
            {persons.length === 0 ? (
              <p className="text-gray-500">No persons yet.</p>
            ) : (
              <div className="divide-y divide-gray-200">
                {persons.map((p, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{p.assignee || 'Unknown'}</p>
                      <p className="text-sm text-gray-500">{p.email || 'No email'}</p>
                    </div>
                    <span className="text-sm text-gray-600">Tasks: {p.taskCount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskScheduler;
