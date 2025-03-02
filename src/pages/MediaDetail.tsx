
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useMedia } from '@/context/MediaContext';
import { useAuth } from '@/context/AuthContext';
import MediaPlayer from '@/components/ui/MediaPlayer';
import CommentSection from '@/components/ui/CommentSection';
import UserAvatar from '@/components/ui/UserAvatar';
import { formatDate } from '@/utils/media';
import { Button } from '@/components/ui/button';
import { Heart, ArrowLeft, Trash2 } from 'lucide-react';

const MediaDetail = () => {
  const { mediaId } = useParams<{ mediaId: string }>();
  const { medias, likeMedia, deleteMedia } = useMedia();
  const { user, users } = useAuth();
  const navigate = useNavigate();
  
  const media = medias.find(m => m.id === mediaId);
  
  if (!media) {
    return (
      <MainLayout>
        <div className="page-container">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Media Not Found</h1>
            <p className="text-muted-foreground mb-6">The media you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/feed')}>Return to Feed</Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  const mediaUser = users.find(u => u.id === media.userId);
  const isOwner = user?.id === media.userId;
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this media?')) {
      deleteMedia(media.id);
      navigate('/feed');
    }
  };
  
  return (
    <MainLayout>
      <div className="page-container">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} className="mr-1" />
          Back
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <MediaPlayer media={media} autoPlay={media.type === 'video'} />
            
            <div className="mt-4">
              <h1 className="text-2xl font-bold">{media.title}</h1>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  {mediaUser && (
                    <Link to={`/profile/${mediaUser.id}`} className="flex items-center gap-2 hover:underline">
                      <UserAvatar user={mediaUser} size="sm" />
                      <span>{mediaUser.name}</span>
                    </Link>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => likeMedia(media.id)}
                    className={media.hasLiked ? "text-red-500" : ""}
                  >
                    <Heart size={16} className={`mr-1 ${media.hasLiked ? "fill-red-500" : ""}`} />
                    {media.likes}
                  </Button>
                  
                  {isOwner && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDelete}
                      className="text-destructive"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Delete
                    </Button>
                  )}
                </div>
              </div>
              
              {media.description && (
                <div className="mt-4 p-4 bg-secondary/50 rounded-md">
                  <p>{media.description}</p>
                </div>
              )}
              
              {media.tags && media.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1">
                  {media.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 bg-secondary text-xs rounded-full text-secondary-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="mt-4 text-sm text-muted-foreground">
                Uploaded on {formatDate(media.createdAt)}
              </div>
              
              <CommentSection media={media} />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold mb-4">More from {mediaUser?.name}</h3>
            
            {/* This would be implemented in a real app */}
            <div className="bg-muted/50 rounded-md p-6 text-center">
              <p className="text-muted-foreground">
                Related media would be shown here in a real application.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MediaDetail;
