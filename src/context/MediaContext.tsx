
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Media, Comment, MediaContextType } from '../types';
import { useAuth } from './AuthContext';
import { toast } from "sonner";

const mockMedias: Media[] = [
  {
    id: '1',
    title: 'Weekend Hiking Trip',
    description: 'Amazing views from our trip to the mountains last weekend!',
    url: 'https://player.vimeo.com/external/368763065.sd.mp4?s=01ad1ba21dc72c927a51010d7230cff2936e68e9&profile_id=164&oauth2_token_id=57447761',
    thumbnailUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop',
    type: 'video',
    userId: '2',
    createdAt: '2023-11-05T14:32:00Z',
    tags: ['nature', 'hiking', 'friends'],
    likes: 4,
  },
  {
    id: '2',
    title: 'Birthday Celebration',
    description: 'Thanks everyone for making my birthday special!',
    url: 'https://images.unsplash.com/photo-1558439744-2a8f2ad4d50c?q=80&w=1000&auto=format&fit=crop',
    type: 'image',
    userId: '1',
    createdAt: '2023-10-15T20:45:00Z',
    tags: ['birthday', 'celebration', 'party'],
    likes: 5,
  },
  {
    id: '3',
    title: 'Campus Concert',
    description: 'Live footage from the amazing concert at our campus!',
    url: 'https://player.vimeo.com/external/342571552.hd.mp4?s=6aa6f164de3812abadff3dde86d19f7a074a8a66&profile_id=175&oauth2_token_id=57447761',
    thumbnailUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1000&auto=format&fit=crop',
    type: 'video',
    userId: '3',
    createdAt: '2023-12-02T22:10:00Z',
    tags: ['music', 'concert', 'campus'],
    likes: 3,
  },
  {
    id: '4',
    title: 'Spring Break Photos',
    description: 'Collection of our best moments from spring break',
    url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=1000&auto=format&fit=crop',
    type: 'image',
    userId: '5',
    createdAt: '2023-09-20T16:25:00Z',
    tags: ['spring', 'beach', 'vacation'],
    likes: 4,
  },
  {
    id: '5',
    title: 'Study Session Timelapse',
    description: 'How we survived finals week',
    url: 'https://player.vimeo.com/external/434045526.hd.mp4?s=81d8946359cebdbe292e0a7cd2c2ed42dd5ebf57&profile_id=174&oauth2_token_id=57447761',
    thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1000&auto=format&fit=crop',
    type: 'video',
    userId: '4',
    createdAt: '2023-12-10T09:15:00Z',
    tags: ['study', 'finals', 'timelapse'],
    likes: 2,
  },
];

const mockComments: Record<string, Comment[]> = {
  '1': [
    {
      id: 'c1',
      content: 'That view is incredible! Where exactly was this?',
      userId: '3',
      mediaId: '1',
      createdAt: '2023-11-05T16:45:00Z',
    },
    {
      id: 'c2',
      content: 'We should plan another trip there soon!',
      userId: '5',
      mediaId: '1',
      createdAt: '2023-11-06T10:12:00Z',
    },
  ],
  '2': [
    {
      id: 'c3',
      content: 'Happy birthday! The cake looks amazing.',
      userId: '4',
      mediaId: '2',
      createdAt: '2023-10-15T21:30:00Z',
    },
  ],
  '3': [
    {
      id: 'c4',
      content: 'The sound quality is fantastic! Which band was this?',
      userId: '1',
      mediaId: '3',
      createdAt: '2023-12-03T09:20:00Z',
    },
    {
      id: 'c5',
      content: 'I\'m so sad I missed this concert! Looks awesome.',
      userId: '2',
      mediaId: '3',
      createdAt: '2023-12-03T11:45:00Z',
    },
  ],
};

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [medias, setMedias] = useState<Media[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const { user, users } = useAuth();

  useEffect(() => {
    // Load initial data
    setMedias(mockMedias);
    setComments(mockComments);
  }, []);

  useEffect(() => {
    // Mark media items that the current user has liked
    // In a real app, this would come from a user's likes table
    if (user) {
      setMedias(prevMedias => 
        prevMedias.map(media => ({
          ...media,
          hasLiked: media.id === '2' || media.id === '4' // Just for demo purposes
        }))
      );
    }
  }, [user]);

  const addMedia = (mediaData: Omit<Media, 'id' | 'createdAt' | 'likes' | 'hasLiked'>) => {
    if (!user) return;
    
    const newMedia: Media = {
      ...mediaData,
      id: `m${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 0,
      hasLiked: false,
    };
    
    setMedias(prev => [newMedia, ...prev]);
    toast.success("Your media has been uploaded successfully!");
  };

  const deleteMedia = (id: string) => {
    if (!user) return;
    
    setMedias(prev => prev.filter(media => media.id !== id));
    // Also clean up associated comments
    setComments(prev => {
      const newComments = { ...prev };
      delete newComments[id];
      return newComments;
    });
    
    toast.success("Media has been deleted.");
  };

  const likeMedia = (id: string) => {
    if (!user) return;
    
    setMedias(prev => prev.map(media => {
      if (media.id === id) {
        const hasLiked = media.hasLiked;
        return {
          ...media,
          likes: hasLiked ? media.likes - 1 : media.likes + 1,
          hasLiked: !hasLiked
        };
      }
      return media;
    }));
  };

  const addComment = (mediaId: string, content: string) => {
    if (!user) return;
    
    const newComment: Comment = {
      id: `c${Date.now()}`,
      content,
      userId: user.id,
      mediaId,
      createdAt: new Date().toISOString(),
      user: user,
    };
    
    setComments(prev => ({
      ...prev,
      [mediaId]: [...(prev[mediaId] || []), newComment]
    }));
    
    toast.success("Comment added successfully!");
  };

  const deleteComment = (mediaId: string, commentId: string) => {
    if (!user) return;
    
    setComments(prev => ({
      ...prev,
      [mediaId]: prev[mediaId].filter(comment => comment.id !== commentId)
    }));
    
    toast.success("Comment deleted.");
  };

  const getMediasByUser = (userId: string) => {
    return medias.filter(media => media.userId === userId);
  };

  const searchMedia = (query: string) => {
    if (!query.trim()) return medias;
    
    const normalizedQuery = query.toLowerCase().trim();
    
    return medias.filter(media => 
      media.title.toLowerCase().includes(normalizedQuery) || 
      media.description?.toLowerCase().includes(normalizedQuery) || 
      media.tags?.some(tag => tag.toLowerCase().includes(normalizedQuery))
    );
  };

  // Add user information to comments
  const commentsWithUsers: Record<string, Comment[]> = {};
  Object.keys(comments).forEach(mediaId => {
    commentsWithUsers[mediaId] = comments[mediaId].map(comment => ({
      ...comment,
      user: users.find(u => u.id === comment.userId)
    }));
  });

  return (
    <MediaContext.Provider value={{
      medias,
      comments: commentsWithUsers,
      addMedia,
      deleteMedia,
      likeMedia,
      addComment,
      deleteComment,
      getMediasByUser,
      searchMedia
    }}>
      {children}
    </MediaContext.Provider>
  );
};

export const useMedia = () => {
  const context = useContext(MediaContext);
  if (context === undefined) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
};
