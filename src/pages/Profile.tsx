
import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { useMedia } from '@/context/MediaContext';
import MediaCard from '@/components/ui/MediaCard';
import UserAvatar from '@/components/ui/UserAvatar';
import { Button } from '@/components/ui/button';
import { formatBirthdate } from '@/utils/media';
import { CalendarDays, Video, Image, Clock, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user, users } = useAuth();
  const { medias, getMediasByUser } = useMedia();
  const [profileData, setProfileData] = useState<any>(null);
  const [userMedias, setUserMedias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const isCurrentUser = user?.id === userId;
  
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // Check if we're using mock data from AuthContext
        const mockUser = users.find(u => u.id === userId);
        if (mockUser) {
          setProfileData({
            id: mockUser.id,
            name: mockUser.name,
            email: mockUser.email,
            dob: mockUser.birthdate,
            profile_pic: mockUser.profilePicture,
            bio: mockUser.bio || '',
            created_at: new Date().toISOString()
          });
          
          // For mock users, use the mock media data
          const userMedia = getMediasByUser(userId);
          setUserMedias(userMedia.map(media => ({
            id: media.id,
            title: media.title,
            description: media.description || '',
            media_url: media.url,
            media_type: media.type,
            user_id: media.userId,
            created_at: media.createdAt,
            likes: media.likes,
            hasLiked: media.hasLiked
          })));
          
          setLoading(false);
          return;
        }
        
        // If not using mock data, fetch from Supabase
        console.log('Fetching profile for user ID:', userId);
        
        // Check if userId is a valid UUID before querying
        const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId || '');
        
        if (!isValidUUID) {
          console.error('Invalid UUID format for user ID:', userId);
          toast.error('Invalid user ID format');
          setLoading(false);
          return;
        }
        
        // Fetch profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          toast.error('Failed to load profile data');
          setLoading(false);
          return;
        }
        
        // Fetch user's posts
        const { data: posts, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', userId);
          
        if (postsError) {
          console.error('Error fetching posts:', postsError);
          toast.error('Failed to load media data');
        }
        
        setProfileData(profile);
        setUserMedias(posts || []);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchProfileData();
    }
  }, [userId, users, getMediasByUser]);
  
  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </MainLayout>
    );
  }
  
  if (!profileData && !loading) {
    return <Navigate to="/feed" />;
  }
  
  // Map supabase data format to app's expected format
  const mappedUser = {
    id: profileData.id,
    name: profileData.name,
    email: profileData.email,
    birthdate: profileData.dob,
    profilePicture: profileData.profile_pic,
    bio: profileData.bio || ''
  };
  
  const mappedMedias = userMedias.map(media => ({
    id: media.id,
    title: media.title,
    description: media.description || '',
    url: media.media_url || media.url,
    thumbnailUrl: media.media_type === 'video' ? (media.media_url || media.url) : undefined,
    type: media.media_type || media.type,
    userId: media.user_id || media.userId,
    createdAt: media.created_at || media.createdAt,
    likes: media.likes || 0,
    hasLiked: media.hasLiked || false
  }));
  
  const sortedMedias = [...mappedMedias].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  const videosCount = mappedMedias.filter(m => m.type === 'video').length;
  const imagesCount = mappedMedias.filter(m => m.type === 'image').length;
  
  const joinedDate = profileData.created_at 
    ? new Date(profileData.created_at).getFullYear().toString()
    : new Date().getFullYear().toString();
  
  return (
    <MainLayout>
      <div>
        <div className="bg-gradient-to-b from-primary/10 to-background/0 py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <UserAvatar user={mappedUser} size="lg" className="h-24 w-24 sm:h-32 sm:w-32" />
              
              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h1 className="text-3xl font-bold">{mappedUser.name}</h1>
                  
                  {isCurrentUser && (
                    <Button asChild variant="outline" size="sm" className="flex-shrink-0">
                      <Link to="/edit-profile">
                        <Edit size={16} className="mr-2" />
                        Edit Profile
                      </Link>
                    </Button>
                  )}
                </div>
                
                {mappedUser.bio && (
                  <p className="mt-2 text-muted-foreground max-w-lg">{mappedUser.bio}</p>
                )}
                
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4">
                  {mappedUser.birthdate && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarDays size={16} className="mr-1" />
                      <span>Born {formatBirthdate(mappedUser.birthdate)}</span>
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
            {mappedUser.name}'s Media
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
