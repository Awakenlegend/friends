
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useMedia } from '@/context/MediaContext';
import MediaCard from '@/components/ui/MediaCard';

const Feed = () => {
  const { medias } = useMedia();
  
  // Sort by newest first
  const sortedMedias = [...medias].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  return (
    <MainLayout>
      <div className="page-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Feed</h1>
          <p className="text-muted-foreground">
            Latest updates from your friends
          </p>
        </div>
        
        <div className="media-grid">
          {sortedMedias.map(media => (
            <MediaCard key={media.id} media={media} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Feed;
