'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, Calendar, Bell, Users, Trophy, Plus, Clock, AlertCircle } from 'lucide-react';

type Task = {
  id: string;
  title: string;
  subject: string;
  status: 'pending' | 'overdue' | 'completed';
  dueDate: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('Student');
  const [tasks, setTasks] = useState<Task[]>([]); // Empty - no demo data!

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    const name = localStorage.getItem('userName');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    if (!auth) {
      router.push('/login');
      return;
    }
    
    if (name) setUserName(name);

    // Load tasks from localStorage
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, [router]);

  const handleLogout = () => { 
    localStorage.removeItem('isAuthenticated'); 
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isAdmin');
    router.push('/'); 
  };

  const stats = [
    { label: 'Total Tasks', value: tasks.length, icon: Calendar, color: 'bg-blue-100 text-blue-600' },
    { label: 'Pending', value: tasks.filter(t => t.status === 'pending').length, icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Overdue', value: tasks.filter(t => t.status === 'overdue').length, icon: AlertCircle, color: 'bg-red-100 text-red-600' },
    { label: 'Conquered', value: tasks.filter(t => t.status === 'completed').length, icon: Trophy, color: 'bg-green-100 text-green-600' },
  ];

  const formatDate = (date: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(date));

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50">
      <header className="border-b border-gray-100 bg-white sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 cram-gradient rounded-lg flex items-center justify-center">
                <Zap size={24} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-800">Cramming Tracker</h1>
                <p className="text-xs text-gray-500">Cram & Conquer</p>
              </div>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-800">Dashboard</Link>
              <Link href="/tracker/personal" className="text-sm font-medium text-gray-600 hover:text-gray-800">Personal</Link>
              <Link href="/tracker/group" className="text-sm font-medium text-gray-600 hover:text-gray-800">Group</Link>
              <Link href="/timer" className="text-sm font-medium text-gray-600 hover:text-gray-800">Timer</Link>
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">Logout</button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Ready to Conquer, {userName}? 👋</h2>
          <p className="text-gray-600">Track your tasks and dominate your deadlines</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 card-hover">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Plus size={24} className="text-green-600" />
            Start Your Mission
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/tracker/personal">
              <div className="bg-white p-6 rounded-xl border-2 border-green-100 card-hover cursor-pointer">
                <div className="w-14 h-14 cram-gradient rounded-xl flex items-center justify-center mb-4 text-white">
                  <Calendar size={28} />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">Personal Tracker</h4>
                <p className="text-gray-600 mb-4">Track your own assignments</p>
                <button className="w-full py-2 cram-gradient text-white rounded-lg font-medium">Start Personal Quest</button>
              </div>
            </Link>
            <Link href="/tracker/group">
              <div className="bg-white p-6 rounded-xl border-2 border-blue-100 card-hover cursor-pointer">
                <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4 text-white">
                  <Users size={28} />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">Group Tracker</h4>
                <p className="text-gray-600 mb-4">Conquer with your squad</p>
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium">Start Group Quest</button>
              </div>
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock size={24} className="text-green-600" />
            Recent Missions
          </h3>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {tasks.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 mb-4">No missions yet. Start your first quest!</p>
                <Link href="/tracker/personal">
                  <button className="px-6 py-3 cram-gradient text-white rounded-lg font-medium">Add Your First Mission</button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {tasks.slice(0, 5).map((task: any) => (
                  <div key={task.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${task.status === 'completed' ? 'bg-green-500' : task.status === 'overdue' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                      <div>
                        <p className="font-medium text-gray-800">{task.title}</p>
                        <p className="text-sm text-gray-600">{task.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${task.status === 'completed' ? 'bg-green-100 text-green-800' : task.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {task.status}
                      </span>
                      <span className="text-sm text-gray-600">{formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
