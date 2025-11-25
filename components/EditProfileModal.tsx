import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { XIcon } from './Icons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSubmit: (name: string, bio: string) => void;
}

const MAX_BIO_LENGTH = 160;

export const EditProfileModal: React.FC<Props> = ({ isOpen, onClose, user, onSubmit }) => {
  const [editingName, setEditingName] = useState(user.name);
  const [editingBio, setEditingBio] = useState(user.bio || '');

  // Reset form when modal opens or user prop changes
  useEffect(() => {
    if (isOpen) {
      setEditingName(user.name);
      setEditingBio(user.bio || '');
    }
  }, [isOpen, user]);

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_BIO_LENGTH) {
      setEditingBio(value);
    }
  };

  const handleSubmit = () => {
    onSubmit(editingName, editingBio);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-dark-card w-full max-w-lg rounded-2xl shadow-2xl border border-slate-700 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Edit Profile</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              placeholder="Your Name"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Biography Input */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-2">
              Biography
            </label>
            <textarea
              id="bio"
              value={editingBio}
              onChange={handleBioChange}
              placeholder="Tell us about yourself..."
              rows={4}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none"
            />
            <p className="text-right text-xs text-slate-500 mt-1">
              {editingBio.length}/{MAX_BIO_LENGTH}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-300 hover:text-white font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!editingName.trim()} // Disable if name is empty
            className="bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-lg shadow-brand-900/20"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};