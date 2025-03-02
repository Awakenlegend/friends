
export interface User {
  id: string;
  name: string;
  email: string;
  birthdate?: string;
  profilePicture?: string;
  bio?: string;
}

export interface Media {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  type: 'video' | 'image';
  userId: string;
  createdAt: string;
  tags?: string[];
  likes: number;
  hasLiked?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  mediaId: string;
  createdAt: string;
  user?: User;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  users: User[];
}

export interface MediaContextType {
  medias: Media[];
  comments: Record<string, Comment[]>;
  addMedia: (media: Omit<Media, 'id' | 'createdAt' | 'likes' | 'hasLiked'>) => void;
  deleteMedia: (id: string) => void;
  likeMedia: (id: string) => void;
  addComment: (mediaId: string, content: string) => void;
  deleteComment: (mediaId: string, commentId: string) => void;
  getMediasByUser: (userId: string) => Media[];
  searchMedia: (query: string) => Media[];
}
