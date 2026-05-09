'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Mail, Lock, User, Bell, Eye, EyeOff } from 'lucide-react';

// Admin credentials
const ADMIN_EMAIL = 'admin2026@gmail.com';
const ADMIN_PASSWORD = '72918346';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    notificationPref: 'all',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (isLogin) {
      // Check for admin account
      if (formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userName', 'Admin');
        localStorage.setItem('userEmail', ADMIN_EMAIL);
        localStorage.setItem('isAdmin', 'true');
        router.push('/dashboard');
        return;
      }

      // Check for regular users (stored in localStorage)
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === formData.email && u.password === formData.password);
      
      if (user) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('isAdmin', 'false');
        router.push('/dashboard');
      } else {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }
    } else {
      // Sign up - validate passwords match
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      // Check if email already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find((u: any) => u.email === formData.email)) {
        setError('Email already registered');
        setIsLoading(false);
        return;
      }

      // Save new user
      users.push({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        notificationPref: formData.notificationPref,
      });
      localStorage.setItem('users', JSON.stringify(users));

      // Auto login after signup
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userName', formData.name);
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('isAdmin', 'false');
      router.push('/dashboard');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50">
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 cram-gradient rounded-lg flex items-center justify-center">
              <Zap size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Cramming Tracker</h1>
              <p className="text-xs text-gray-500">Cram & Conquer</p>
            </div>
          </Link>
        </div>
      </header>

      <section className="py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{isLogin ? 'Welcome Back!' : 'Join the Conquest'}</h2>
            <p className="text-gray-600">{isLogin ? 'Login to continue your journey' : 'Create account to start'}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" 
                    required={!isLogin} 
                  />
                </div>
              )}

              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" 
                  required 
                />
              </div>

              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Password" 
                  value={formData.password} 
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {!isLogin && (
                <>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="password" 
                      placeholder="Confirm Password" 
                      value={formData.confirmPassword} 
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} 
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" 
                      required={!isLogin} 
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Bell size={18} className="text-gray-400" />
                    <select 
                      value={formData.notificationPref} 
                      onChange={(e) => setFormData({ ...formData, notificationPref: e.target.value })} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="gmail">Gmail Notifications</option>
                      <option value="sms">SMS/Phone</option>
                      <option value="push">Push Notifications</option>
                      <option value="all">All</option>
                    </select>
                  </div>
                </>
              )}

              <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full py-3 cram-gradient text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : isLogin ? 'Login' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button 
                  onClick={() => { setIsLogin(!isLogin); setError(''); }} 
                  className="text-green-600 hover:text-green-700 font-medium ml-2 hover:underline"
                >
                  {isLogin ? 'Sign Up' : 'Login'}
                </button>
              </p>
            </div>

            {isLogin && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                <p className="font-semibold mb-1"> Demo Admin Account:</p>
                <p className="text-xs">Email: admin2026@gmail.com</p>
                <p className="text-xs">Password: 72918346</p>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">← Back to Home</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
