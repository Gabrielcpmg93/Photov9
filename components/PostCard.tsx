import React, { useState } from 'react';
import { Post } from '../types';
import { HeartIcon, ImageIcon } from './Icons';

interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-dark-card rounded-xl overflow-hidden shadow-lg border border-slate-700/50 mb-6 transition-all hover:border-slate-600">
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <img
          src={post.user.avatar}
          alt={post.user.name}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-500/20"
        />
        <div>
          <h3 className="text-white font-medium text-sm">{post.user.name}</h3>
          <p className="text-dark-muted text-xs">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Image */}
      <div className="relative aspect-square sm:aspect-video w-full bg-black/50 flex items-center justify-center">
        {!imageError ? (
          <img
            src={post.imageUrl}
            alt="Post content"
            className="w-full h-full object-contain bg-black"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-500 gap-2">
            <ImageIcon className="w-12 h-12 opacity-50" />
            <span className="text-sm">Image failed to load</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center gap-4 mb-3">
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-2 transition-colors ${
              post.likedByCurrentUser ? 'text-red-500' : 'text-white hover:text-red-400'
            }`}
          >
            <HeartIcon
              className={`w-7 h-7 ${post.likedByCurrentUser ? 'animate-pulse' : ''}`}
              fill={post.likedByCurrentUser ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* Likes Count */}
        <p className="text-white font-bold text-sm mb-2">{post.likes} likes</p>

        {/* Caption */}
        <div className="mb-2">
          <span className="text-white font-semibold mr-2">{post.user.name}</span>
          <span className="text-slate-300">{post.caption}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags.map((tag, idx) => (
            <span key={idx} className="text-brand-500 text-xs font-medium hover:underline cursor-pointer">
              {tag.startsWith('#') ? tag : `#${tag}`}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};