import React, { useState, useRef, useEffect } from 'react';
import { editImageWithGemini } from '../services/geminiService';
import { ImageEditState } from '../types';
import { Upload, Wand2, RefreshCcw, Download, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageEditorViewProps {
  initialPrompt?: string;
}

export const ImageEditorView: React.FC<ImageEditorViewProps> = ({ initialPrompt }) => {
  const [state, setState] = useState<ImageEditState>({
    originalImage: null,
    generatedImage: null,
    prompt: '',
    isGenerating: false,
    error: null,
  });

  // Load initial prompt if provided
  useEffect(() => {
    if (initialPrompt) {
      setState(prev => ({ ...prev, prompt: initialPrompt }));
    }
  }, [initialPrompt]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({
          ...prev,
          originalImage: reader.result as string,
          generatedImage: null,
          error: null
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!state.originalImage || !state.prompt) return;

    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      const result = await editImageWithGemini(state.originalImage, state.prompt);
      setState(prev => ({ ...prev, generatedImage: result }));
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message || "Failed to generate image" }));
    } finally {
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const reset = () => {
    setState({
      originalImage: null,
      generatedImage: null,
      prompt: '',
      isGenerating: false,
      error: null
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white mb-2">Magic Editor</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Transform your photos with text commands. Powered by Gemini Nano Banana.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        
        {/* CONTROL PANEL */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 transition-colors duration-300">
          
          {/* Upload Area */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">1. Upload an Image</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${state.originalImage ? 'border-indigo-300 bg-indigo-50/50 dark:bg-indigo-900/20 dark:border-indigo-500' : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              
              {state.originalImage ? (
                <div className="relative group">
                  <img src={state.originalImage} alt="Original" className="max-h-64 mx-auto rounded-lg shadow-sm" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg text-white font-medium">
                    Click to Change
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-4">
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 font-medium">Click to upload photo</p>
                  <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">JPG, PNG, WebP</p>
                </div>
              )}
            </div>
          </div>

          {/* Prompt Area */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">2. Describe the Change</label>
            <textarea
              value={state.prompt}
              onChange={(e) => setState(prev => ({ ...prev, prompt: e.target.value }))}
              placeholder="E.g., 'Add a retro filter', 'Make it look like a sketch', 'Add fireworks in the sky'"
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 outline-none resize-none h-32 placeholder-slate-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleEdit}
              disabled={!state.originalImage || !state.prompt || state.isGenerating}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl font-bold shadow-md shadow-indigo-200 dark:shadow-none hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {state.isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate Magic
                </>
              )}
            </button>
            <button
              onClick={reset}
              className="px-4 py-3 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-colors"
              title="Reset"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>
          
          {state.error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-sm rounded-lg flex items-start gap-2">
              <span className="mt-0.5">⚠️</span>
              {state.error}
            </div>
          )}
        </div>

        {/* PREVIEW PANEL */}
        <div className="bg-slate-900 rounded-2xl p-1 min-h-[500px] shadow-2xl flex flex-col">
          <div className="bg-slate-800/50 p-4 rounded-t-xl flex justify-between items-center border-b border-slate-700">
             <div className="flex items-center gap-2 text-white font-medium">
               <ImageIcon className="w-5 h-5 text-indigo-400" />
               Output Preview
             </div>
             {state.generatedImage && (
                <a 
                  href={state.generatedImage} 
                  download="magic-edit.png"
                  className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  Download
                </a>
             )}
          </div>
          
          <div className="flex-1 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
            {state.generatedImage ? (
               <img 
                 src={state.generatedImage} 
                 alt="Generated" 
                 className="max-w-full max-h-[600px] rounded-lg shadow-2xl animate-in fade-in zoom-in duration-500"
               />
            ) : state.isGenerating ? (
              <div className="text-center">
                 <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mx-auto mb-4" />
                 <p className="text-slate-400 animate-pulse">Consulting the pixels...</p>
              </div>
            ) : (
              <div className="text-center text-slate-600">
                <div className="w-20 h-20 border-2 border-dashed border-slate-700 rounded-xl mx-auto mb-4 flex items-center justify-center">
                   <ImageIcon className="w-8 h-8 opacity-50" />
                </div>
                <p>Your masterpiece will appear here</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};