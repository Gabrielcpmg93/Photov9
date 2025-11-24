import React, { useState, useRef, useCallback } from 'react';
import { CreatePostData } from '../types';
import { XIcon, ImageIcon, UploadIcon, SparklesIcon, AlertTriangleIcon } from './Icons';
import { analyzeImageForPost } from '../services/geminiService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePostData) => void;
}

export const CreatePostModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiError, setAiError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setSelectedImage(null);
    setCaption('');
    setTags([]);
    setIsAnalyzing(false);
    setAiError(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic validation
      if (file.size > 5 * 1024 * 1024) {
        alert("File size too large (max 5MB)");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAiError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIMagic = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setAiError(false);
    try {
      const result = await analyzeImageForPost(selectedImage);
      setCaption(result.caption);
      setTags(result.tags);
    } catch (e) {
      console.error("AI Error", e);
      setAiError(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = () => {
    if (selectedImage && caption) {
      onSubmit({
        imageUrl: selectedImage,
        caption,
        tags
      });
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative bg-dark-card w-full max-w-lg rounded-2xl shadow-2xl border border-slate-700 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Create New Post</h2>
          <button onClick={handleClose} className="text-slate-400 hover:text-white p-2">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Image Upload Area */}
          <div className="relative group">
            {selectedImage ? (
              <div className="relative rounded-lg overflow-hidden border border-slate-600 bg-black aspect-video">
                <img src={selectedImage} alt="Selected" className="w-full h-full object-contain" />
                <button
                   onClick={() => setSelectedImage(null)}
                   className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-red-500/80 transition-colors"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-600 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:bg-slate-800/50 transition-all gap-3"
              >
                <div className="bg-slate-800 p-4 rounded-full">
                   <ImageIcon className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-300 font-medium">Click to upload photo</p>
                <p className="text-slate-500 text-xs">JPG, PNG up to 5MB</p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* AI Tools & Caption */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">Caption</label>
              {selectedImage && (
                <button
                  onClick={handleAIMagic}
                  disabled={isAnalyzing}
                  className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all ${
                    isAnalyzing
                      ? 'bg-purple-900/30 text-purple-300 cursor-wait'
                      : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/25'
                  }`}
                >
                  <SparklesIcon className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  {isAnalyzing ? 'Magic Working...' : 'AI Magic Write'}
                </button>
              )}
            </div>
            
            {aiError && (
              <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-2 flex items-center gap-2 text-red-300 text-xs">
                <AlertTriangleIcon className="w-4 h-4" />
                <span>AI Service unavailable (404/Network). Using manual mode.</span>
              </div>
            )}

            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none h-28"
            />

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                 {tags.map((t, i) => (
                   <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-md border border-slate-700">
                     {t}
                   </span>
                 ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-slate-300 hover:text-white font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedImage || !caption}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-lg shadow-brand-900/20"
          >
            <UploadIcon className="w-4 h-4" />
            Post
          </button>
        </div>
      </div>
    </div>
  );
};