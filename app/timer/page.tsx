'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Zap, Clock, Play, Pause, RotateCcw, Volume2, VolumeX, Award } from 'lucide-react';

export default function CramTimerPage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessions, setSessions] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const modes = {
    focus: { time: 25 * 60, label: 'Focus Time', color: 'from-red-600 to-red-500', icon: '🎯' },
    shortBreak: { time: 5 * 60, label: 'Short Break', color: 'from-green-600 to-green-500', icon: '☕' },
    longBreak: { time: 15 * 60, label: 'Long Break', color: 'from-blue-600 to-blue-500', icon: '🌟' },
  };

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
        if (mode === 'focus') {
          setTotalFocusTime(prev => prev + 1);
        }
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (soundEnabled && audioRef.current) {
        audioRef.current.play().catch((e: Error) => console.log('Audio play failed:', e));
      }
      if (mode === 'focus') {
        const newSessions = sessions + 1;
        setSessions(newSessions);
        if (newSessions % 4 === 0) {
          setMode('longBreak');
          setTimeLeft(modes.longBreak.time);
        } else {
          setMode('shortBreak');
          setTimeLeft(modes.shortBreak.time);
        }
      } else {
        setMode('focus');
        setTimeLeft(modes.focus.time);
      }
    }
    return () => {
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, [isActive, timeLeft, mode, sessions, soundEnabled]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(modes[mode].time);
  };

  const changeMode = (newMode: 'focus' | 'shortBreak' | 'longBreak') => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(modes[newMode].time);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  const progress = ((modes[mode].time - timeLeft) / modes[mode].time) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg" preload="auto" />

      {/* Header */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 purple-gradient rounded-lg flex items-center justify-center">
                <Clock size={24} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-800">Cram Timer</h1>
                <p className="text-xs text-gray-500">Cram & Conquer</p>
              </div>
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-800">← Back to Dashboard</Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">🎯 Cramming Timer</h2>
            <p className="text-gray-600">Focus mode powered by Pomodoro technique</p>
          </div>

          {/* Mode Selector */}
          <div className="flex justify-center gap-2 mb-8">
            {Object.entries(modes).map(([key, value]) => (
              <button
                key={key}
                onClick={() => changeMode(key as 'focus' | 'shortBreak' | 'longBreak')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  mode === key 
                    ? `bg-linear-to-r ${value.color} text-white shadow-lg` 
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{value.icon}</span>
                {value.label}
              </button>
            ))}
          </div>

          {/* Timer Display */}
          <div className={`bg-linear-to-br ${modes[mode].color} rounded-3xl p-8 mb-8 text-white shadow-xl`}>
            <div className="text-center">
              {/* Progress Circle */}
              <div className="relative w-64 h-64 mx-auto mb-6">
                <svg className="w-full h-full progress-ring" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="white"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-6xl font-bold mb-2">{formatTime(timeLeft)}</p>
                    <p className="text-lg opacity-80">{modes[mode].label}</p>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={toggleTimer}
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                >
                  {isActive ? (
                    <Pause size={32} className="text-red-600" />
                  ) : (
                    <Play size={32} className="text-green-600" />
                  )}
                </button>
                <button
                  onClick={resetTimer}
                  className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <RotateCcw size={32} className="text-white" />
                </button>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  {soundEnabled ? (
                    <Volume2 size={32} className="text-white" />
                  ) : (
                    <VolumeX size={32} className="text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-100 text-center card-hover">
              <Clock size={32} className="mx-auto mb-2 text-purple-600" />
              <p className="text-3xl font-bold text-gray-800">{sessions}</p>
              <p className="text-sm text-gray-600">Focus Sessions</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 text-center card-hover">
              <Zap size={32} className="mx-auto mb-2 text-yellow-600" />
              <p className="text-3xl font-bold text-gray-800">{formatTotalTime(totalFocusTime)}</p>
              <p className="text-sm text-gray-600">Total Focus Time</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 text-center card-hover">
              <Award size={32} className="mx-auto mb-2 text-green-600" />
              <p className="text-3xl font-bold text-gray-800">{Math.round(sessions / 4)}</p>
              <p className="text-sm text-gray-600">Complete Cycles</p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white p-6 rounded-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">💡 Cramming Tips</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Focus for 25 minutes, then take a 5-minute break</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>After 4 sessions, take a longer 15-minute break</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Stay hydrated and stretch during breaks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Keep your phone away during focus sessions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Track your progress and celebrate milestones</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
