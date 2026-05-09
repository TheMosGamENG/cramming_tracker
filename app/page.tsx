'use client';

import Link from 'next/link';
import { Zap, Calendar, Bell, Users, Trophy, ArrowRight, Clock, Star } from 'lucide-react';

export default function Home() {
  const features = [
    { icon: Calendar, title: 'Track Assignments', desc: 'Never miss a deadline', color: 'bg-red-100 text-red-600' },
    { icon: Bell, title: 'Smart Reminders', desc: 'Get notified before due', color: 'bg-yellow-100 text-yellow-600' },
    { icon: Users, title: 'Group Tracker', desc: 'Conquer together', color: 'bg-blue-100 text-blue-600' },
    { icon: Clock, title: 'Cram Timer', desc: 'Focus with Pomodoro', color: 'bg-purple-100 text-purple-600' },
    { icon: Trophy, title: 'Conquer Goals', desc: 'Celebrate victories', color: 'bg-green-100 text-green-600' },
    { icon: Star, title: 'Track Progress', desc: 'See your improvement', color: 'bg-pink-100 text-pink-600' },
  ];

  const testimonials = [
    { name: 'Sarah M.', role: 'College Student', text: 'This app saved my GPA! The reminders are a lifesaver.' },
    { name: 'John D.', role: 'High School Senior', text: 'The cram timer helps me focus during study sessions.' },
    { name: 'Emily R.', role: 'Graduate Student', text: 'Group tracker made our project collaboration so easy!' },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b border-gray-100 sticky top-0 z-40 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 cram-gradient rounded-lg flex items-center justify-center">
                <Zap size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Cramming Tracker</h1>
                <p className="text-xs text-gray-500">Cram & Conquer</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">Login</button>
              </Link>
              <Link href="/login">
                <button className="px-5 py-2 cram-gradient text-white rounded-lg font-medium btn-hover">Sign Up Free</button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-6 animate-fade-in">
            🎓 #1 Student Success Tracker
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 animate-slide-up">
            Cram Smart. <span className="text-red-600">Conquer All.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-slide-up">
            Track assignments, set smart reminders, focus with our cram timer, and conquer your school goals with the ultimate student companion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link href="/login">
              <button className="px-8 py-4 cram-gradient text-white rounded-xl font-semibold text-lg btn-hover flex items-center justify-center gap-2">
                Start Conquering Free
                <ArrowRight size={20} />
              </button>
            </Link>
            <Link href="#features">
              <button className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-lg hover:border-red-300 transition-colors">
                Learn More
              </button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">✓ No credit card required ✓ Free forever</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-white border-y border-gray-100">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-red-600 mb-2">10,000+</p>
              <p className="text-gray-600">Active Students</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-red-600 mb-2">500,000+</p>
              <p className="text-gray-600">Tasks Completed</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-red-600 mb-2">98%</p>
              <p className="text-gray-600">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Your Weapons for Conquest</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Everything you need to dominate your schoolwork</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="text-center p-6 rounded-xl border border-gray-100 card-hover bg-white">
                <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Students Love Us</h2>
            <p className="text-gray-600">Join thousands of successful students</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 card-hover">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-gray-800">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 cram-gradient">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Conquer Your Deadlines?</h2>
          <p className="text-red-100 mb-8 text-lg">Join thousands of students who never miss a deadline</p>
          <Link href="/login">
            <button className="px-8 py-4 bg-white text-red-600 rounded-xl font-semibold text-lg btn-hover">
              Start Your Journey Free
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-800 text-gray-400">
        <div className="container mx-auto text-center">
          <p>© 2024 Cramming Tracker. Cram & Conquer.</p>
        </div>
      </footer>
    </div>
  );
}
