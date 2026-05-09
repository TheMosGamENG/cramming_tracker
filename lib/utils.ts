import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to readable string
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

// Format date with time
export function formatDateTime(date: string, time: string): string {
  const d = new Date(`${date}T${time}`);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d);
}

// Calculate time until due
export function getTimeUntilDue(dueDate: string, dueTime: string): {
  hours: number;
  minutes: number;
  isOverdue: boolean;
  text: string;
} {
  const now = new Date();
  const due = new Date(`${dueDate}T${dueTime}`);
  const diffMs = due.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffMinutes = diffMs / (1000 * 60);

  const hours = Math.floor(Math.abs(diffHours));
  const minutes = Math.floor(Math.abs(diffMinutes % 60));
  const isOverdue = diffMs < 0;

  let text = '';
  if (isOverdue) {
    if (hours > 24) {
      text = `${Math.floor(hours / 24)} days overdue`;
    } else if (hours > 0) {
      text = `${hours} hours overdue`;
    } else {
      text = `${minutes} minutes overdue`;
    }
  } else {
    if (hours > 24) {
      text = `In ${Math.floor(hours / 24)} days`;
    } else if (hours > 0) {
      text = `In ${hours} hours`;
    } else {
      text = `In ${minutes} minutes`;
    }
  }

  return { hours, minutes, isOverdue, text };
}

// Get due status badge
export function getDueStatus(dueDate: string, dueTime: string, status: string): {
  text: string;
  color: string;
  bg: string;
} {
  if (status === 'completed') {
    return { text: 'Completed', color: 'text-green-600', bg: 'bg-green-100' };
  }

  const { isOverdue, hours } = getTimeUntilDue(dueDate, dueTime);

  if (isOverdue) {
    return { text: 'Overdue', color: 'text-red-600', bg: 'bg-red-100' };
  }
  if (hours < 2) {
    return { text: 'Due in <2 hours!', color: 'text-red-600', bg: 'bg-red-100' };
  }
  if (hours < 24) {
    return { text: 'Due soon', color: 'text-yellow-600', bg: 'bg-yellow-100' };
  }
  return { text: 'On track', color: 'text-green-600', bg: 'bg-green-100' };
}

// Format timer seconds to MM:SS
export function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Format total focus time
export function formatTotalTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (password.length < 6) return 'weak';
  if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) return 'medium';
  return 'strong';
}

// Local storage helpers
export const storage = {
  get: (key: string): any => {
    if (typeof window === 'undefined') return null;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  set: (key: string, value: any): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },
  clear: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  },
};

// Auth helpers
export const auth = {
  isAuthenticated: (): boolean => {
    return storage.get('isAuthenticated') === true;
  },
  getUser: (): { name?: string; email?: string } | null => {
    return {
      name: storage.get('userName'),
      email: storage.get('userEmail'),
    };
  },
  login: (name: string, email: string): void => {
    storage.set('isAuthenticated', true);
    storage.set('userName', name);
    storage.set('userEmail', email);
  },
  logout: (): void => {
    storage.remove('isAuthenticated');
    storage.remove('userName');
    storage.remove('userEmail');
  },
};

// Task helpers
export const tasks = {
  getAll: (): any[] => {
    return storage.get('tasks') || [];
  },
  save: (tasks: any[]): void => {
    storage.set('tasks', tasks);
  },
  add: (task: any): void => {
    const all = tasks.getAll();
    tasks.save([...all, task]);
  },
  update: (id: string, updates: any): void => {
    const all = tasks.getAll();
    tasks.save(all.map(t => t.id === id ? { ...t, ...updates } : t));
  },
  delete: (id: string): void => {
    const all = tasks.getAll();
    tasks.save(all.filter(t => t.id !== id));
  },
  complete: (id: string): void => {
    tasks.update(id, { status: 'completed' });
  },
};

// Group helpers
export const groups = {
  getAll: (): any[] => {
    return storage.get('groups') || [];
  },
  save: (groups: any[]): void => {
    storage.set('groups', groups);
  },
};

// Timer helpers
export const timer = {
  getSessions: (): number => {
    return storage.get('timerSessions') || 0;
  },
  getTotalTime: (): number => {
    return storage.get('timerTotalTime') || 0;
  },
  addSession: (seconds: number): void => {
    const sessions = timer.getSessions() + 1;
    const totalTime = timer.getTotalTime() + seconds;
    storage.set('timerSessions', sessions);
    storage.set('timerTotalTime', totalTime);
  },
  reset: (): void => {
    storage.remove('timerSessions');
    storage.remove('timerTotalTime');
  },
};

// Check for upcoming deadlines
export function checkUpcomingDeadlines(tasks: any[]): any[] {
  const now = new Date();
  return tasks
    .filter(task => {
      if (task.status === 'completed' || task.status === 'overdue') return false;
      const taskDateTime = new Date(`${task.dueDate}T${task.dueTime}`);
      const hoursUntilDue = (taskDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      return hoursUntilDue > 0 && hoursUntilDue <= 24;
    })
    .map(task => {
      const taskDateTime = new Date(`${task.dueDate}T${task.dueTime}`);
      const hoursUntilDue = Math.round((taskDateTime.getTime() - now.getTime()) / (1000 * 60 * 60));
      return {
        id: task.id,
        taskId: task.id,
        message: `${task.title} is due in ${hoursUntilDue} hours!`,
        type: 'warning' as const,
        hoursUntilDue,
      };
    });
}

// Priority calculator
export function calculatePriority(dueDate: string, dueTime: string, status: string): 'high' | 'medium' | 'low' {
  if (status === 'completed') return 'low';
  if (status === 'overdue') return 'high';
  
  const { hours, isOverdue } = getTimeUntilDue(dueDate, dueTime);
  
  if (isOverdue || hours < 2) return 'high';
  if (hours < 24) return 'medium';
  return 'low';
}

// Stats calculator
export function calculateStats(tasks: any[]) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const overdue = tasks.filter(t => t.status === 'overdue').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    pending,
    overdue,
    completionRate,
  };
}
