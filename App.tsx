import React, { useState, useEffect } from 'react';
import { TimelineView } from './components/TimelineView';
import { Orbit, Moon, Sun, Github } from 'lucide-react';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors duration-300">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                <Orbit className="w-6 h-6" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-slate-100 font-serif">Time Capsule</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 pl-4">
                 <button
                   onClick={() => setIsDarkMode(!isDarkMode)}
                   className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                   title="Toggle Dark Mode"
                 >
                   {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                 </button>
                 
                 <a 
                   href="https://github.com/AtomicSiopao/" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                 >
                   <Github className="w-4 h-4" />
                   by James Marco
                 </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Dark Mode & Credit row */}
      <div className="md:hidden flex justify-between px-4 py-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
         <a 
           href="https://github.com/AtomicSiopao/" 
           target="_blank" 
           rel="noopener noreferrer"
           className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600"
         >
           by James Marco
         </a>
      </div>

      {/* Main Content Area */}
      <main className="transition-all duration-500 ease-in-out">
        <TimelineView />
      </main>

    </div>
  );
};

export default App;