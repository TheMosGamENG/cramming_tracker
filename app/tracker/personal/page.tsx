'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, Plus, Calendar, Bell, CheckCircle, Trash2, Search, Clock, Edit2 } from 'lucide-react';
import { NotificationContainer } from '@/components/Notification';

export default function PersonalTrackerPage() {
  const [notifications, setNotifications] = useState<Array<{id: string, message: string, type: 'success' | 'warning' | 'error' | 'info'}>>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    subject: '', 
    dueDate: '', 
    dueTime: '23:59',
    reminder: true 
  });

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
  const fetchTasks = async () => {
    const userId = "demo-user-id"; // Eventually from your Login logic
    const res = await fetch(`/api/tasks?userId=${userId}`);
    const data = await res.json();
    setTasks(data);
  };
  fetchTasks();
}, []);

  // Check for upcoming deadlines
  useEffect(() => {
    const checkDeadlines = () => {
      const now = new Date();
      tasks.forEach(task => {
        if (task.status === 'completed' || task.status === 'overdue') return;
        const taskDateTime = new Date(`${task.dueDate}T${task.dueTime}`);
        const hoursUntilDue = (taskDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
        if (hoursUntilDue > 0 && hoursUntilDue <= 2) {
          addNotification(`${task.title} is due in ${Math.round(hoursUntilDue * 60)} minutes!`, 'warning');
        }
      });
    };
    const interval = setInterval(checkDeadlines, 60000);
    return () => clearInterval(interval);
  }, [tasks]);

  const addNotification = (message: string, type: 'success' | 'warning' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask = { id: Date.now().toString(), ...formData, status: 'pending' };
    setTasks([...tasks, newTask]);
    setFormData({ title: '', subject: '', dueDate: '', dueTime: '23:59', reminder: true });
    setShowAddForm(false);
    addNotification('Mission added successfully! 🎯', 'success');
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task.id);
    setFormData({
      title: task.title,
      subject: task.subject,
      dueDate: task.dueDate,
      dueTime: task.dueTime,
      reminder: task.reminder
    });
  };

  const handleAddTask = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const res = await fetch('/api/tasks', {
    method: 'POST',
    body: JSON.stringify({ ...formData, userId: "demo-user-id" }),
  });

  if (res.ok) {
    const newTask = await res.json();
    setTasks([...tasks, newTask]);
    setShowAddForm(false);
  }
};

  const handleComplete = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: 'completed' } : t));
    addNotification('Mission completed! Great job! 🎉', 'success');
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    addNotification('Mission deleted', 'info');
  };

  const getDueStatus = (task: any) => {
    const now = new Date();
    const taskDateTime = new Date(`${task.dueDate}T${task.dueTime}`);
    const hoursUntilDue = (taskDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (task.status === 'completed') return { text: 'Completed', color: 'text-green-600', bg: 'bg-green-100' };
    if (hoursUntilDue < 0) return { text: 'Overdue', color: 'text-red-600', bg: 'bg-red-100' };
    if (hoursUntilDue < 2) return { text: 'Due in <2 hours!', color: 'text-red-600', bg: 'bg-red-100' };
    if (hoursUntilDue < 24) return { text: 'Due soon', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { text: 'On track', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <NotificationContainer notifications={notifications} onDismiss={dismissNotification} position="top-right" />

      <header className="border-b border-gray-100 bg-white sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 cram-gradient rounded-lg flex items-center justify-center">
                <Zap size={24} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-800">Personal Tracker</h1>
                <p className="text-xs text-gray-500">Cram & Conquer</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/timer" className="px-4 py-2 purple-gradient text-white rounded-lg font-medium flex items-center gap-2 hover:opacity-90">
                <Clock size={18} /> Cram Timer
              </Link>
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-800">← Back to Dashboard</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Your Personal Missions</h2>
            <p className="text-gray-600">Track and conquer your assignments</p>
          </div>
          <button onClick={() => editingTask ? setEditingTask(null) : setShowAddForm(!showAddForm)} className="px-6 py-3 cram-gradient text-white rounded-lg font-medium flex items-center gap-2 hover:opacity-90">
            {editingTask ? <><Edit2 size={20} /> Cancel Edit</> : <><Plus size={20} /> Add Mission</>}
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search missions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>

        {(showAddForm || editingTask) && (
          <form onSubmit={editingTask ? handleUpdateTask : handleAddTask} className="bg-white p-6 rounded-xl border border-gray-100 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{editingTask ? 'Edit Mission' : 'New Mission'}</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Mission Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" required />
              <input type="text" placeholder="Subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" required />
            </div>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Time</label>
                <input type="time" value={formData.dueTime} onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" required />
              </div>
              <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg mt-6">
                <input type="checkbox" checked={formData.reminder} onChange={(e) => setFormData({ ...formData, reminder: e.target.checked })} className="w-4 h-4" />
                <Bell size={18} className="text-gray-600" />
                <span className="text-gray-700">Enable Reminder</span>
              </label>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-6 py-3 cram-gradient text-white rounded-lg font-medium">{editingTask ? 'Update Mission' : 'Save Mission'}</button>
              <button type="button" onClick={() => { setShowAddForm(false); setEditingTask(null); }} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium">Cancel</button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-gray-100 text-center card-hover">
            <p className="text-2xl font-bold text-yellow-600">{tasks.filter(t => t.status === 'pending').length}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 text-center card-hover">
            <p className="text-2xl font-bold text-green-600">{tasks.filter(t => t.status === 'completed').length}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 text-center card-hover">
            <p className="text-2xl font-bold text-red-600">{tasks.filter(t => t.status === 'overdue').length}</p>
            <p className="text-sm text-gray-600">Overdue</p>
          </div>
        </div>

        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-gray-100 text-center">
              <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 mb-4">No missions yet. Add your first one!</p>
              <button onClick={() => setShowAddForm(true)} className="px-6 py-3 cram-gradient text-white rounded-lg font-medium">Add Mission</button>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const dueStatus = getDueStatus(task);
              return (
                <div key={task.id} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between card-hover">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${task.status === 'completed' ? 'bg-green-500' : task.status === 'overdue' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                    <div>
                      <p className="font-medium text-gray-800">{task.title}</p>
                      <p className="text-sm text-gray-600">{task.subject}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar size={12} /> {task.dueDate}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={12} /> {task.dueTime}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${dueStatus.bg} ${dueStatus.color}`}>{dueStatus.text}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleComplete(task.id)} disabled={task.status === 'completed'} className="p-2 hover:bg-green-50 rounded-lg text-green-600 disabled:opacity-50"><CheckCircle size={20} /></button>
                    <button onClick={() => handleEditTask(task)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"><Edit2 size={20} /></button>
                    <button onClick={() => handleDelete(task.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600"><Trash2 size={20} /></button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
