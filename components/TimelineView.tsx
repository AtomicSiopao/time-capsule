import React, { useState } from 'react';
import { generateTimeline } from '../services/geminiService';
import { TimelineResponse } from '../types';
import { TimelineCard } from './TimelineCard';
import { SourceList } from './SourceList';
import { Calendar, Search, Sparkles, Loader2, Globe, Filter, X } from 'lucide-react';

const TOPICS = ['Education', 'Superstition', 'Belief', 'Urban Legends', 'Records', 'Trivia', 'Religion', 'Health', 'Food', 'Science', 'Technology'];

interface TimelineViewProps {
  // Removed onVisualize prop as the editor feature is removed
}

export const TimelineView: React.FC<TimelineViewProps> = () => {
  const [birthYear, setBirthYear] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  
  const [data, setData] = useState<TimelineResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic) 
        : [...prev, topic]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthYear) return;
    
    const yearNum = parseInt(birthYear);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear()) {
      setError("Please enter a valid birth year (1900 - present).");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await generateTimeline(yearNum, country, selectedTopics, searchTerm);
      setData(response);
    } catch (err) {
      setError("Failed to generate timeline. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Determine background gradient based on selected topics
  const getBackgroundGradient = () => {
    if (selectedTopics.length === 0) return ''; // Default background

    // Priority mapping of topics to gradients
    // If multiple selected, we take the last one selected as priority or find the first match in this list
    const lastSelected = selectedTopics[selectedTopics.length - 1];

    switch (lastSelected) {
      case 'Education':
      case 'Science':
      case 'Technology':
        return 'bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-slate-50 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-slate-950';
      case 'Superstition':
      case 'Urban Legends':
      case 'Belief':
        return 'bg-gradient-to-br from-purple-50/50 via-fuchsia-50/30 to-slate-50 dark:from-purple-950/30 dark:via-fuchsia-950/20 dark:to-slate-950';
      case 'Health':
      case 'Food':
        return 'bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-slate-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-slate-950';
      case 'Records':
      case 'Trivia':
      case 'Religion':
        return 'bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-slate-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-slate-950';
      default:
        return 'bg-gradient-to-br from-slate-50 via-gray-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-black';
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* Dynamic Background Layer */}
      <div className={`fixed inset-0 -z-10 transition-colors duration-1000 ease-in-out ${getBackgroundGradient()}`} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section Removed as requested */}
        <div className="text-center mb-8">
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Discover how facts, superstitions, and beliefs have evolved since your birth.
          </p>
        </div>

        {/* Input Section */}
        <div className="max-w-2xl mx-auto mb-16 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 transition-colors duration-300">
          <form onSubmit={handleGenerate} className="space-y-6">
            
            {/* Main Search Term (Optional) */}
            <div className="relative">
               <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">Specific Topic / Search Term (Optional)</label>
               <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
                 <input
                   type="text"
                   placeholder="e.g. the sun is out while raining"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900 dark:bg-slate-950 border-2 border-slate-800 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 text-white placeholder-slate-500 font-bold text-lg outline-none transition-all"
                 />
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Birth Year Input */}
              <div className="relative">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">Birth Year</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
                  <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    placeholder="YYYY"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900 dark:bg-slate-950 border-2 border-slate-800 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 text-white placeholder-slate-500 font-bold text-lg outline-none transition-all"
                  />
                </div>
              </div>

              {/* Country Input */}
              <div className="relative">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">Country (Optional)</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
                  <input
                    type="text"
                    placeholder="e.g. Japan, Global"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900 dark:bg-slate-950 border-2 border-slate-800 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 text-white placeholder-slate-500 font-bold text-lg outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 ml-1 flex items-center gap-2">
                <Filter className="w-3 h-3" />
                Topics (Optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map(topic => {
                  const isSelected = selectedTopics.includes(topic);
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => toggleTopic(topic)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        isSelected 
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none' 
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {topic}
                    </button>
                  );
                })}
                {selectedTopics.length > 0 && (
                   <button 
                     type="button"
                     onClick={() => setSelectedTopics([])}
                     className="px-2 py-2 rounded-full text-xs font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                     title="Clear filters"
                   >
                     <X className="w-4 h-4" />
                   </button>
                )}
              </div>
            </div>

            {/* Submit Button (Simplified) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-slate-800 dark:hover:bg-indigo-500 active:scale-[0.99] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
                {loading ? <Loader2 className="w-6 h-6 animate-spin text-indigo-300 dark:text-indigo-200" /> : <Sparkles className="w-6 h-6 text-indigo-300 dark:text-indigo-200" />}
                Jump in
            </button>

          </form>

          {error && (
            <div className="text-center mt-4 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 py-2 px-4 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        {data && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="relative">
               {/* Timeline Container */}
              <div className="space-y-0">
                {data.events.map((event, index) => (
                  <TimelineCard key={index} event={event} index={index} />
                ))}
              </div>
            </div>
            
            <SourceList sources={data.groundingChunks} />
          </div>
        )}
      </div>
    </div>
  );
};