import React, { useState } from 'react';
import { Post, CreatePostData, User } from './types';
import { PostCard } from './components/PostCard';
import { CreatePostModal } from './components/CreatePostModal';
import { PlusIcon, UserIcon } from './components/Icons';
import { ProfileView } from './components/ProfileView';
import { EditProfileModal } from './components/EditProfileModal'; // Import the new modal

// Mock current user
const INITIAL_CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Developer',
  avatar: 'https://picsum.photos/seed/alex/100/100',
  bio: 'Passionate frontend engineer building innovative web experiences. Loves photography, coffee, and open source. #webdev #react #typescript',
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
    user: { id: 'u3', name: 'Tech Daily', avatar: 'https://picsum.photos/seed/computer/600/600' },
    imageUrl: 'https://picsum.photos/seed/computer/600/600',
    caption: 'Coding setup for the weekend. Dark mode always. 💻 #coding #setup',
    tags: ['#coding', '#setup', '#workspace'],
    likes: 128,
    createdAt: Date.now() - 5000000,
    likedByCurrentUser: true,
  },
  {
    id: 'p3',
    userId: 'u1',
    user: INITIAL_CURRENT_USER,
    imageUrl: 'https://picsum.photos/seed/coffee/600/600',
    caption: 'First coffee of the day is essential. ☕ #coffee #morning',
    tags: ['#coffee', '#lifestyle'],
    likes: 15,
    createdAt: Date.now() - 2000000,
    likedByCurrentUser: false,
  }
];

type ViewState = 'feed' | 'profile';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_CURRENT_USER);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false); // New state for edit profile modal
  const [currentView, setCurrentView] = useState<ViewState>('feed');

  const handleCreatePost = (data: CreatePostData) => {
    const newPost: Post = {
      id: Date.now().toString(),
      userId: currentUser.id,
      user: currentUser,
      imageUrl: data.imageUrl,
      caption: data.caption,
      tags: data.tags,
      likes: 0,
      createdAt: Date.now(),
      likedByCurrentUser: false,
    };
    setPosts([newPost, ...posts]);
    setCurrentView('feed'); // Switch back to feed to see new post
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

  const handleUpdateProfile = (updatedName: string, updatedBio: string) => {
    const updatedUser = { ...currentUser, name: updatedName, bio: updatedBio };
    setCurrentUser(updatedUser);
    // Update posts that belong to the current user to reflect the new name/bio if needed (for consistency)
    setPosts(prevPosts => prevPosts.map(post => 
      post.userId === currentUser.id ? { ...post, user: updatedUser } : post
    ));
    setIsEditProfileModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text font-sans pb-20 sm:pb-10">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-dark-bg/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo Area - Click to go home */}
          <button onClick={() => setCurrentView('feed')} className="flex items-center gap-2 focus:outline-none">
            <div className="w-8 h-8 bg-gradient-to-tr from-brand-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-900/20">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-white hidden sm:block">
              PhotoStream
            </h1>
          </button>

          {/* Navigation Actions */}
          <div className="flex items-center gap-4">
             <button
              onClick={() => setIsModalOpen(true)}
              className="bg-brand-600 hover:bg-brand-500 text-white p-2 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-brand-900/50"
              aria-label="Create Post"
            >
              <PlusIcon className="w-5 h-5" />
            </button>

            <button 
              onClick={() => setCurrentView(currentView === 'profile' ? 'feed' : 'profile')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors border ${
                currentView === 'profile' 
                  ? 'bg-slate-800 border-brand-500/50 text-white' 
                  : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {currentView === 'profile' ? (
                 <UserIcon className="w-6 h-6 text-brand-400" />
              ) : (
                 <img src={currentUser.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent hover:ring-brand-500/50" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 px-4 max-w-lg mx-auto">
        {currentView === 'feed' ? (
          <div className="space-y-6 animate-fade-in">
            {posts.map(post => (
              <PostCard key={post.id} post={post} onLike={handleLike} />
            ))}

            {posts.length === 0 && (
              <div className="text-center py-20 bg-dark-card rounded-xl border border-dashed border-slate-700">
                <p className="text-slate-400">No posts yet. Be the first!</p>
              </div>
            )}
          </div>
        ) : (
          <ProfileView 
            user={currentUser} 
            posts={posts} 
            onEditProfile={() => setIsEditProfileModalOpen(true)} // Pass handler to open modal
          />
        )}
      </main>

      {/* Mobile Bottom Navigation (Optional, for better mobile UX) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-dark-card border-t border-slate-800 flex justify-around p-3 z-30">
         <button onClick={() => setCurrentView('feed')} className={`p-2 rounded-lg ${currentView === 'feed' ? 'text-brand-400 bg-brand-900/10' : 'text-slate-500'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
         </button>
         <button onClick={() => setIsModalOpen(true)} className="bg-brand-600 text-white p-3 rounded-full -mt-8 shadow-lg shadow-brand-900/50 border-4 border-dark-bg">
            <PlusIcon className="w-6 h-6" />
         </button>
         <button onClick={() => setCurrentView('profile')} className={`p-2 rounded-lg ${currentView === 'profile' ? 'text-brand-400 bg-brand-900/10' : 'text-slate-500'}`}>
            <UserIcon className="w-6 h-6" />
         </button>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePost}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        user={currentUser}
        onSubmit={handleUpdateProfile}
      />
    </div>
  );
}