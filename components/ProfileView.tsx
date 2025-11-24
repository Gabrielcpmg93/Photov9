import React from 'react';
import { User, Post } from '../types';
import { GridIcon, HeartIcon } from './Icons';

interface ProfileViewProps {
  user: User;
  posts: Post[];
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, posts }) => {
  const userPosts = posts.filter(p => p.userId === user.id);
  const totalLikes = userPosts.reduce((acc, curr) => acc + curr.likes, 0);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Profile Header */}
      <div className="bg-dark-card rounded-xl p-6 border border-slate-800/50">
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-24 h-24 rounded-full object-cover ring-4 ring-brand-500/20"
          />
          
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
            <p className="text-brand-400 text-sm mb-4">@alex_dev • Photographer</p>
            
            <div className="flex justify-center sm:justify-start gap-8">
              <div className="text-center">
                <span className="block text-xl font-bold text-white">{userPosts.length}</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">Posts</span>
              </div>
              <div className="text-center">
                <span className="block text-xl font-bold text-white">{totalLikes}</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">Likes</span>
              </div>
              <div className="text-center">
                <span className="block text-xl font-bold text-white">1.2k</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">Followers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="flex items-center gap-6 border-b border-slate-800 px-4">
        <button className="flex items-center gap-2 py-3 border-b-2 border-brand-500 text-white">
          <GridIcon className="w-5 h-5" />
          <span className="font-medium">Posts</span>
        </button>
        <button className="flex items-center gap-2 py-3 border-b-2 border-transparent text-slate-500 hover:text-slate-300 transition-colors">
          <HeartIcon className="w-5 h-5" />
          <span className="font-medium">Liked</span>
        </button>
      </div>

      {/* Photo Grid */}
      {userPosts.length > 0 ? (
        <div className="grid grid-cols-3 gap-1 sm:gap-2">
          {userPosts.map((post) => (
            <div key={post.id} className="aspect-square relative group cursor-pointer overflow-hidden bg-slate-900">
              <img 
                src={post.imageUrl} 
                alt="Post thumbnail" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold">
                <HeartIcon fill="white" className="w-5 h-5" />
                {post.likes}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="bg-slate-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <GridIcon className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-400">No posts yet</p>
        </div>
      )}
    </div>
  );
};