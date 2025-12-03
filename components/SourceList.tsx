import React, { useState } from 'react';
import { GroundingChunk } from '../types';
import { ExternalLink, Search, ChevronDown, ChevronUp } from 'lucide-react';

interface SourceListProps {
  sources?: GroundingChunk[];
}

export const SourceList: React.FC<SourceListProps> = ({ sources }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!sources || sources.length === 0) return null;

  // Deduplicate sources based on URI
  const uniqueSourcesMap = new Map<string, GroundingChunk>();
  sources.forEach((item: GroundingChunk) => {
    if (item.web?.uri) {
      uniqueSourcesMap.set(item.web.uri, item);
    }
  });

  const uniqueSources = Array.from(uniqueSourcesMap.values());
  if (uniqueSources.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] w-full max-w-3xl md:rounded-t-xl overflow-hidden pointer-events-auto transition-all duration-300 transform translate-y-0">
        
        {/* Toggle Header */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 p-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-700 transition-colors"
        >
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Search className="w-4 h-4" />
            <span>Verified Sources ({uniqueSources.length})</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
            {isOpen ? 'Hide' : 'Show'}
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </button>

        {/* Scrollable Content */}
        {isOpen && (
           <div className="max-h-60 overflow-y-auto p-4 bg-white dark:bg-slate-900 animate-in slide-in-from-bottom-2 duration-200">
             <div className="grid grid-cols-1 gap-2">
                {uniqueSources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.web?.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 group border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 font-serif text-xs font-bold">
                      {idx + 1}
                    </div>
                    <span className="text-sm font-medium truncate flex-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {source.web?.title || "Unknown Source"}
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-400 dark:text-slate-500 group-hover:text-indigo-400" />
                  </a>
                ))}
             </div>
           </div>
        )}
      </div>
    </div>
  );
};