'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap, Users, Plus, Calendar, UserPlus, Clock, Trash2, Edit2 } from 'lucide-react';

export default function GroupTrackerPage() {
  const [groupName, setGroupName] = useState('Study Squad');
  const [members, setMembers] = useState([
    { id: '1', name: 'You', email: 'you@email.com', role: 'admin' },
    { id: '2', name: 'Teammate 1', email: 'team1@email.com', role: 'member' },
    { id: '3', name: 'Teammate 2', email: 'team2@email.com', role: 'member' },
  ]);
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Group Project Presentation', subject: 'Business Studies', dueDate: '2025-05-05', dueTime: '14:00', assignedTo: 'All' },
    { id: '2', title: 'Research Document', subject: 'Science', dueDate: '2025-05-02', dueTime: '23:59', assignedTo: 'Teammate 1' },
    { id: '3', title: 'Slide Deck', subject: 'Business Studies', dueDate: '2025-05-04', dueTime: '18:00', assignedTo: 'Teammate 2' },
  ]);
  const [showInvite, setShowInvite] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [formData, setFormData] = useState({ 
    title: '', 
    subject: '', 
    dueDate: '', 
    dueTime: '23:59',
    assignedTo: 'All' 
  });

  const handleInvite = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMembers([...members, { id: Date.now().toString(), name: inviteEmail.split('@')[0], email: inviteEmail, role: 'member' }]);
    setInviteEmail('');
    setShowInvite(false);
  };

  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTasks([...tasks, { id: Date.now().toString(), ...formData }]);
    setFormData({ title: '', subject: '', dueDate: '', dueTime: '23:59', assignedTo: 'All' });
    setShowAddTask(false);
  };

  const handleEditTask = (task: typeof tasks[0]) => {
    setEditingTask(task.id);
    setFormData({
      title: task.title,
      subject: task.subject,
      dueDate: task.dueDate,
      dueTime: task.dueTime,
      assignedTo: task.assignedTo
    });
  };

  const handleUpdateTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTasks(tasks.map(t => t.id === editingTask ? { ...t, ...formData } : t));
    setEditingTask(null);
    setFormData({ title: '', subject: '', dueDate: '', dueTime: '23:59', assignedTo: 'All' });
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap size={24} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-800">Group Tracker</h1>
                <p className="text-xs text-gray-500">Cram & Conquer</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/timer" className="px-4 py-2 purple-gradient text-white rounded-lg font-medium flex items-center gap-2 hover:opacity-90">
                <Clock size={18} />
                Cram Timer
              </Link>
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-800">← Back to Dashboard</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{groupName}</h2>
            <p className="text-gray-600">{members.length} members in your squad</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowInvite(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700">
              <UserPlus size={18} /> Invite
            </button>
            <button onClick={() => editingTask ? setEditingTask(null) : setShowAddTask(!showAddTask)} className="px-4 py-2 cram-gradient text-white rounded-lg font-medium flex items-center gap-2 hover:opacity-90">
              <Plus size={18} /> {editingTask ? 'Cancel' : 'Add Mission'}
            </button>
          </div>
        </div>

        {/* Members */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users size={20} className="text-blue-600" />
            Squad Members
          </h3>
          <div className="flex flex-wrap gap-2">
            {members.map((member) => (
              <div key={member.id} className={`px-4 py-2 rounded-full text-sm font-medium ${member.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                {member.name} {member.role === 'admin' && '👑'}
              </div>
            ))}
          </div>
        </div>

        {/* Add/Edit Task Form */}
        {(showAddTask || editingTask) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">{editingTask ? 'Edit Group Mission' : 'New Group Mission'}</h3>
              <form onSubmit={editingTask ? handleUpdateTask : handleAddTask}>
                <div className="space-y-4">
                  <input type="text" placeholder="Mission Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                  <input type="text" placeholder="Subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                    <input type="time" value={formData.dueTime} onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                  </div>
                  <select value={formData.assignedTo} onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                    <option value="All">All Members</option>
                    {members.map((m) => (<option key={m.id} value={m.name}>{m.name}</option>))}
                  </select>
                </div>
                <div className="flex gap-2 mt-4">
                  <button type="submit" className="flex-1 py-2 cram-gradient text-white rounded-lg">{editingTask ? 'Update Mission' : 'Save Mission'}</button>
                  <button type="button" onClick={() => { setShowAddTask(false); setEditingTask(null); }} className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tasks */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-red-600" />
            Group Missions
          </h3>
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="bg-white p-12 rounded-xl border border-gray-100 text-center">
                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">No group missions yet</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="bg-white p-4 rounded-xl border border-gray-100 card-hover">
                  <div className="flex items-center justify-between">
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
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Assigned to: {task.assignedTo}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEditTask(task)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDeleteTask(task.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Invite Squad Member</h3>
            <form onSubmit={handleInvite}>
              <input type="email" placeholder="teammate@email.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4" required />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-lg">Send Invite</button>
                <button type="button" onClick={() => setShowInvite(false)} className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
