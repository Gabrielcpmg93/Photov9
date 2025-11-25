export interface User {
  id: string;
  name: string;
  avatar: string;
  bio?: string; // Optional biography field
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  imageUrl: string;
  caption: string;
  tags: string[];
  likes: number;
  createdAt: number;
  likedByCurrentUser: boolean;
}

export interface CreatePostData {
  imageUrl: string;
  caption: string;
  tags: string[];
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
}