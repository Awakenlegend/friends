
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { CameraIcon, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Feed = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Check if the user is allowed to upload
  const canUpload = user && [
    'ashahulbtech23@ced.alliance.edu.in',
    'fmohammedbtech23@ced.alliance.edu.in',
    'uchandrubtech23@ced.alliance.edu.in',
    'akashrbtech23@ced.alliance.edu.in',
    'yrohithbtech23@ced.alliance.edu.in'
  ].includes(user.email);
  
  return (
    <MainLayout>
      <div className="page-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Feed</h1>
          <p className="text-muted-foreground">
            Share and discover content with your friends
          </p>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-primary/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CameraIcon className="h-10 w-10 text-primary" />
            </div>
            
            <h2 className="text-2xl font-semibold mb-2">No content yet</h2>
            <p className="text-muted-foreground mb-6">
              This feed is currently empty. Be the first to share something with your friends!
            </p>
            
            {canUpload ? (
              <Button 
                onClick={() => navigate('/upload')}
                className="flex items-center gap-2"
              >
                <Upload size={16} />
                Upload Content
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Only Alliance University users can upload content to this platform.
              </p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Feed;
