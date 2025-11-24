import React, { useState, useEffect } from 'react';
import { Post, CreatePostData, User } from './types';
import { PostCard } from './components/PostCard';
import { CreatePostModal } from './components/CreatePostModal';
import { PlusIcon } from './components/Icons';

// Mock current user
const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Developer',
  avatar: 'https://picsum.photos/seed/alex/100/100',
};

// Initial data to prevent empty screen (preventing "Black Screen" feeling)
const INITIAL_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'u2',
    user: { id: 'u2', name: 'Sarah Nature', avatar: 'https://picsum.photos/seed/sarah/100/100' },
    imageUrl: 'https://picsum.photos/seed/mountain/600/600',
    caption: 'Nothing beats a morning hike in the mist! 🏔️ #nature #hiking',
    tags: ['#nature', '#hiking', '#morning'],
    likes: 42,
    createdAt: Date.now() - 10000000,
    likedByCurrentUser: false,
  },
  {
    id: 'p2',
    userId: 'u3',
    user: { id: 'u3', name: 'Tech Daily', avatar: 'https://picsum.photos/seed/tech/100/100' },
    imageUrl: 'https://picsum.photos/seed/computer/600/600',
    caption: 'Coding setup for the weekend. Dark mode always. 💻 #coding #setup',
    tags: ['#coding', '#setup', '#workspace'],
    likes: 128,
    createdAt: Date.now() - 5000000,
    likedByCurrentUser: true,
  }
];

export default function App() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading to show smooth transition
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleCreatePost = (data: CreatePostData) => {
    const newPost: Post = {
      id: Date.now().toString(),
      userId: CURRENT_USER.id,
      user: CURRENT_USER,
      imageUrl: data.imageUrl,
      caption: data.caption,
      tags: data.tags,
      likes: 0,
      createdAt: Date.now(),
      likedByCurrentUser: false,
    };
    setPosts([newPost, ...posts]);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.likedByCurrentUser ? post.likes - 1 : post.likes + 1,
          likedByCurrentUser: !post.likedByCurrentUser
        };
      }
      return post;
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-medium animate-pulse">Initializing PhotoStream...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text font-sans">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-dark-bg/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-brand-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-white">
              PhotoStream
            </h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-600 hover:bg-brand-500 text-white p-2 rounded-full transition-all hover:scale-110 active:scale-95 shadow-lg shadow-brand-900/50"
            aria-label="Create Post"
          >
            <PlusIcon className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-10 px-4 max-w-lg mx-auto">
        <div className="space-y-6">
          {posts.map(post => (
            <PostCard key={post.id} post={post} onLike={handleLike} />
          ))}

          {posts.length === 0 && (
            <div className="text-center py-20 bg-dark-card rounded-xl border border-dashed border-slate-700">
              <p className="text-slate-400">No posts yet. Be the first!</p>
            </div>
          )}
        </div>
      </main>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
}