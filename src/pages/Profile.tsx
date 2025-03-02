
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { useMedia } from '@/context/MediaContext';
import MediaCard from '@/components/ui/MediaCard';
import UserAvatar from '@/components/ui/UserAvatar';
import { formatBirthdate } from '@/utils/media';
import { CalendarDays, Video, Image, Clock } from 'lucide-react';

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { users } = useAuth();
  const { getMediasByUser } = useMedia();
  
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return <Navigate to="/feed" />;
  }
  
  const userMedias = getMediasByUser(user.id);
  const sortedMedias = [...userMedias].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  const videosCount = userMedias.filter(m => m.type === 'video').length;
  const imagesCount = userMedias.filter(m => m.type === 'image').length;
  
  const joinedDate = '2023'; // In a real app, we would store this in the user object
  
  return (
    <MainLayout>
      <div>
        <div className="bg-gradient-to-b from-primary/10 to-background/0 py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <UserAvatar user={user} size="lg" className="h-24 w-24 sm:h-32 sm:w-32" />
              
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                {user.bio && (
                  <p className="mt-2 text-muted-foreground max-w-lg">{user.bio}</p>
                )}
                
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4">
                  {user.birthdate && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarDays size={16} className="mr-1" />
                      <span>Born {formatBirthdate(user.birthdate)}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock size={16} className="mr-1" />
                    <span>Joined {joinedDate}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Video size={16} className="mr-1" />
                    <span>{videosCount} videos</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Image size={16} className="mr-1" />
                    <span>{imagesCount} photos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="page-container pt-6">
          <h2 className="text-2xl font-semibold mb-6">
            {user.name}'s Media
          </h2>
          
          {sortedMedias.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No media shared yet.</p>
            </div>
          ) : (
            <div className="media-grid">
              {sortedMedias.map(media => (
                <MediaCard key={media.id} media={media} />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
