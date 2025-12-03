import React, { useState } from 'react';
import { TimelineEvent } from '../types';
import { ArrowRight, CheckCircle2, AlertCircle, RefreshCw, XCircle, ChevronDown, ChevronUp, ExternalLink, Wand2 } from 'lucide-react';

interface TimelineCardProps {
  event: TimelineEvent;
  index: number;
  onVisualize?: (prompt: string) => void;
}

const StatusIcon = ({ status }: { status: TimelineEvent['status'] }) => {
  switch (status) {
    case 'Confirmed': return <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400" />;
    case 'Debunked': return <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" />;
    case 'Changed': return <RefreshCw className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
    case 'Evolved': return <ArrowRight className="w-5 h-5 text-purple-500 dark:text-purple-400" />;
    default: return <AlertCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />;
  }
};

const StatusBadge = ({ status }: { status: TimelineEvent['status'] }) => {
  const colors = {
    Confirmed: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
    Debunked: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
    Changed: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
    Evolved: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
  };
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[status] || 'bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-300'}`}>
      {status.toUpperCase()}
    </span>
  );
};

export const TimelineCard: React.FC<TimelineCardProps> = ({ event, index, onVisualize }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Check for "mystical" categories for the easter egg
  const isMystical = ['Urban Legends', 'Superstition', 'Myth', 'Belief'].some(cat => event.category.includes(cat));

  return (
    <div className="relative pl-8 md:pl-0">
      {/* Timeline connector line (desktop) */}
      <div className="hidden md:block absolute left-1/2 -ml-0.5 w-0.5 h-full bg-slate-200 dark:bg-slate-700 top-0"></div>
      
      {/* Timeline dot */}
      <div className="absolute left-0 md:left-1/2 md:-ml-3 w-6 h-6 bg-white dark:bg-slate-900 border-4 border-indigo-500 dark:border-indigo-400 rounded-full z-10 top-6 shadow-sm"></div>

      <div className={`md:flex items-center justify-between w-full mb-8 ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
        
        {/* Spacer for alignment */}
        <div className="hidden md:block w-5/12" />

        {/* Content Card */}
        <div className="w-full md:w-5/12 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-black/20 transition-all duration-300">
          <div 
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-serif text-slate-800 dark:text-slate-100">{event.year}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium px-2 py-1 bg-white dark:bg-slate-700 rounded border dark:border-slate-600 uppercase tracking-wide">{event.category}</span>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={event.status} />
              {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </div>

          {isExpanded && (
            <div className="p-0 animate-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-700">
                
                {/* OLD BELIEF */}
                <div className="p-6 bg-amber-50/30 dark:bg-amber-900/10">
                  <div className="text-xs font-bold text-amber-700 dark:text-amber-500 uppercase tracking-wider mb-2">Then (The Past)</div>
                  <p className="text-slate-700 dark:text-slate-300 font-serif text-lg leading-relaxed">
                    "{event.originalBelief}"
                  </p>
                </div>

                {/* MODERN REALITY */}
                <div className="p-6 bg-indigo-50/30 dark:bg-indigo-900/10">
                  <div className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    Now (The Truth)
                    <StatusIcon status={event.status} />
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {event.modernReality}
                  </p>
                  <div className="mt-4 text-sm text-slate-500 dark:text-slate-400 italic border-t border-indigo-100 dark:border-indigo-900/50 pt-3">
                    {event.context}
                  </div>
                  
                  {/* Footer Actions: Source & Easter Egg */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-2">
                    {event.sourceUrl ? (
                      <a 
                        href={event.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Source
                      </a>
                    ) : <span />}

                    {/* Easter Egg / Visualize Feature */}
                    {isMystical && onVisualize && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onVisualize(`A mysterious and artistic representation of the urban legend: ${event.originalBelief}. Dark, atmospheric, cinematic style.`);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-bold hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                        title="Create art from this myth"
                      >
                        <Wand2 className="w-3 h-3" />
                        Visualize This
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};