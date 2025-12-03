import React, { useState, useEffect } from 'react';
import { TimelineView } from './components/TimelineView';
import { ImageEditorView } from './components/ImageEditorView';
import { History, Wand2, Moon, Sun, Github } from 'lucide-react';

enum View {
  TIMELINE = 'TIMELINE',
  EDITOR = 'EDITOR'
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.TIMELINE);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [editorInitialPrompt, setEditorInitialPrompt] = useState('');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleVisualize = (prompt: string) => {
    setEditorInitialPrompt(prompt);
    setCurrentView(View.EDITOR);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors duration-300">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold font-serif">
                T
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-slate-100">TimeCapsule</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button
                  onClick={() => setCurrentView(View.TIMELINE)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    currentView === View.TIMELINE
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <History className="w-4 h-4" />
                  History
                </button>
                <button
                  onClick={() => setCurrentView(View.EDITOR)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    currentView === View.EDITOR
                      ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Wand2 className="w-4 h-4" />
                  Editor
                </button>
              </div>

              <div className="hidden md:flex items-center gap-4 border-l border-slate-200 dark:border-slate-700 pl-4">
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
                   className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
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
         <button
           onClick={() => setIsDarkMode(!isDarkMode)}
           className="text-slate-500 dark:text-slate-400"
         >
           {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
         </button>
      </div>

      {/* Main Content Area */}
      <main className="transition-all duration-500 ease-in-out">
        {currentView === View.TIMELINE ? (
          <TimelineView onVisualize={handleVisualize} />
        ) : (
          <ImageEditorView initialPrompt={editorInitialPrompt} />
        )}
      </main>

    </div>
  );
};

export default App;