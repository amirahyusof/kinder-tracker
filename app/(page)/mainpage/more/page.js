"use client"
import React, { useEffect, useState, useContext} from 'react';
import { ThemeContext } from '@/app/context/ThemeContext';

export default function ParentToolsPage() {
  const {theme, toggleTheme} = useContext(ThemeContext);
  const [dailyReminder, setDailyReminder] = useState(false);
  const [journal, setJournal] = useState('');

  // Load settings from localStorage
  useEffect(() => {
    setDailyReminder(localStorage.getItem('dailyReminder') === 'true');
    setJournal(localStorage.getItem('journal') || '');
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('dailyReminder', dailyReminder.toString());
    localStorage.setItem('journal', journal);
  }, [theme, dailyReminder, journal]);

  // Notification Logic
  useEffect(() => {
    if (!dailyReminder) return;
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    const now = new Date();
    const reminderTime = new Date();
    reminderTime.setHours(9, 0, 0, 0); // 9 AM

    if (now > reminderTime) reminderTime.setDate(reminderTime.getDate() + 1);

    const timeout = reminderTime.getTime() - now.getTime();
    const timer = setTimeout(() => {
      new Notification('🌸 Daily Reminder', {
        body: 'Check your parenting activities today!'
      });

      setInterval(() => {
        new Notification('🌸 Daily Reminder', {
          body: 'Check your parenting activities today!'
        });
      }, 24 * 60 * 60 * 1000);
    }, timeout);

    return () => clearTimeout(timer);
  }, [dailyReminder]);

  // Reset App
  const handleReset = () => {
    if (confirm('Are you sure you want to reset all app data?')) {
      localStorage.clear();
      location.reload();
    }
  };

  // Backup Function
  const handleBackup = () => {
    const data = {
      childrenData: JSON.parse(localStorage.getItem('childrenData') || '[]'),
      activities: JSON.parse(localStorage.getItem('activities') || '[]'),
      preferences: {
        theme,
        dailyReminder,
        journal
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'parent-app-backup.json';
    link.click();
  };

  return (
    <main className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-[#FFF9CA]'}`}>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-[#FF9494]">More Tools</h1>

        <section>
          <h2 className="text-xl font-semibold text-[#FF9494] mb-2">Appearance</h2>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-md bg-[#FFB4B4] text-white hover:bg-[#FFB4B4]/80 transition"
          >
            Toggle {theme === "dark" ? "Light" : "Dark"} Mode
      </button>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#FF9494] mb-2">Daily Reminder</h2>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={dailyReminder}
              onChange={(e) => setDailyReminder(e.target.checked)}
              className='h-4 w-4 bg-white border-gray-300 rounded focus:ring-[#FF9494]'
            />
            Enable 9 AM Reminder
          </label>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#FF9494] mb-2">Parent Journal</h2>
          <textarea
            className="w-full h-32 p-2 border border-gray-300 rounded bg-white"
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            placeholder="Reflect on your child's growth..."
          ></textarea>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#FF9494] mb-2">Data Options</h2>
          <div className="flex flex-row gap-2">
            <button onClick={handleBackup} className="rounded-md bg-[#FFB4B4] text-white hover:bg-[#FFB4B4]/80 px-4 py-2 w-full">Backup Data</button>
            <button onClick={handleReset} className="bg-red-500 text-white px-4 py-2 hover:bg-red-500/50 rounded-md w-full">Reset App</button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#FF9494] mb-2">About the App</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            This parenting web app helps you track your children’s daily activities, manage their profiles, and reflect on your journey.
            <br/>Built with ❤️ using Next.js, TailwindCSS, and localStorage.
          </p>
        </section>
      </div>
    </main>
  );
}
