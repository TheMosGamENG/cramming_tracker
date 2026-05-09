'use client';

import { useEffect } from 'react';
import { X, Bell, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface NotificationProps {
  id: string;
  message: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  duration?: number;
  onDismiss: (id: string) => void;
}

export default function Notification({ 
  id, 
  message, 
  type = 'info', 
  duration = 5000, 
  onDismiss 
}: NotificationProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onDismiss]);

  const icons = {
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
    info: Bell,
  };

  const colors = {
    success: 'bg-green-50 border-green-500 text-green-800',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
    error: 'bg-red-50 border-red-500 text-red-800',
    info: 'bg-blue-50 border-blue-500 text-blue-800',
  };

  const iconColors = {
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    info: 'text-blue-600',
  };

  const Icon = icons[type];

  return (
    <div className={`notification flex items-center justify-between p-4 rounded-lg border-l-4 ${colors[type]} shadow-lg mb-2 animate-slide-in`}>
      <div className="flex items-center gap-3">
        <Icon size={20} className={iconColors[type]} />
        <p className="font-medium">{message}</p>
      </div>
      <button 
        onClick={() => onDismiss(id)}
        className="ml-4 hover:opacity-70 transition-opacity"
      >
        <X size={18} />
      </button>
    </div>
  );
}

// Notification Container Component
interface NotificationContainerProps {
  notifications: Array<{
    id: string;
    message: string;
    type?: 'success' | 'warning' | 'error' | 'info';
  }>;
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function NotificationContainer({ 
  notifications, 
  onDismiss,
  position = 'top-right'
}: NotificationContainerProps) {
  if (!notifications || notifications.length === 0) return null;

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 w-96 max-w-[calc(100vw-2rem)]`}>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    message: string;
    type: 'success' | 'warning' | 'error' | 'info';
  }>>([]);

  const addNotification = (message: string, type: 'success' | 'warning' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    setNotifications(prev => [...prev, { id, message, type }]);
    return id;
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const success = (message: string) => addNotification(message, 'success');
  const warning = (message: string) => addNotification(message, 'warning');
  const error = (message: string) => addNotification(message, 'error');
  const info = (message: string) => addNotification(message, 'info');

  const clearAll = () => setNotifications([]);

  return {
    notifications,
    addNotification,
    dismissNotification,
    success,
    warning,
    error,
    info,
    clearAll,
  };
}

// Add this at the top
import { useState } from 'react';
