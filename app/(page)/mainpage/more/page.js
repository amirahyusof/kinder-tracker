"use client"
import React, { useEffect, useState, useContext} from 'react';
import { ThemeContext } from '@/app/context/ThemeContext';
import ReminderBanner from '@/app/components/ReminderBanner';

export default function ParentToolsPage() {
  const {theme, toggleTheme} = useContext(ThemeContext);
  const [dailyReminder, setDailyReminder] = useState(false);
  const [journal, setJournal] = useState('');
  const [reminderTime, setReminderTime] = useState("09:00"); // Default reminder time
  const [loaded, setLoaded] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    setDailyReminder(JSON.parse(localStorage.getItem('dailyReminder') || "false"));
    setJournal(localStorage.getItem('journal') || '');
    setReminderTime(localStorage.getItem('reminderTime') || '09:00');
    setLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('dailyReminder', JSON.stringify(dailyReminder));
    localStorage.setItem('journal', journal);
    localStorage.setItem('reminderTime', reminderTime);
  }, [theme, dailyReminder, journal, reminderTime]);

  // Notification Logic
  useEffect(() => {
    if (!dailyReminder) return;

    if(Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        if(permission === 'granted') return;
      });
    }

    if(Notification.permission !== 'granted') return;
    
    const now = new Date();
    const reminderTimeDate = new Date();
    const [hour, minute] = reminderTime.split(':').map(Number);
    reminderTimeDate.setHours(hour, minute, 0, 0); // User can enter time reminder

    if (now > reminderTimeDate) {
      reminderTimeDate.setDate(reminderTimeDate.getDate() + 1);// schedule for the next day
    }

    const timeout = reminderTimeDate.getTime() - now.getTime();

    const timer = setTimeout(() => {
      new Notification('🌸 Daily Reminder', {
        body: "Don't forget to check your children's activities today!"
      });

      // Set interval for daily reminder
      setInterval(() => {
        new Notification('🌸 Daily Reminder', {
          body: 'Check back for your children progress today 🌼'
        });
      }, 24 * 60 * 60 * 1000);
    }, timeout);

    return () => clearTimeout(timer);
  }, [dailyReminder, reminderTime]);

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
        journal, 
        reminderTime,
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

        {loaded && (
          <section>
            <h2 className="text-xl font-semibold text-[#FF9494] mb-2">Daily Reminder</h2>
            <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={dailyReminder}
              onChange={(e) => setDailyReminder(e.target.checked)}
              className="toggle bg-[#FFB4B4] border-gray-300 checked:bg-[#FFB4B4]/80 checked:border-[#FF9494] checked:text-orange-800"
            />
              Enable Reminder
            </label>

            {dailyReminder && (
              <div className="flex items-center gap-2">
                <label htmlFor="reminderTime" className="text-sm text-gray-700 dark:text-gray-300">
                  Reminder Time:
                </label>
                <input
                  id="reminderTime"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 bg-white"
                />
              </div>
            )}
          </section>
        )}


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
