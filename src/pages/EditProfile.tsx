
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import UserAvatar from '@/components/ui/UserAvatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import { Calendar, Upload, X, Camera, ArrowLeft } from 'lucide-react';

const EditProfile = () => {
  const { user, updateProfile, uploadProfilePicture, isLoading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [birthdate, setBirthdate] = useState(user?.birthdate || '');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.profilePicture || null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  
  const handleRemoveImage = () => {
    setUploadedFile(null);
    if (previewUrl && previewUrl !== user?.profilePicture) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(user?.profilePicture || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // First upload the profile picture if there's a new one
      let pictureUrl = profilePicture;
      
      if (uploadedFile) {
        const uploadResult = await uploadProfilePicture(uploadedFile);
        if (uploadResult) {
          pictureUrl = uploadResult;
        }
      }
      
      // Then update the rest of the profile
      await updateProfile({
        name,
        bio,
        birthdate,
        profilePicture: pictureUrl
      });
      
      navigate(`/profile/${user?.id}`);
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };
  
  if (!user) {
    navigate('/');
    return null;
  }
  
  return (
    <MainLayout>
      <div className="page-container max-w-2xl">
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/profile/${user.id}`)}
          >
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Profile preview"
                    className="h-32 w-32 rounded-full object-cover border-4 border-background"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-full p-1"
                    onClick={handleRemoveImage}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center border-4 border-background">
                  <Camera size={32} className="text-muted-foreground" />
                </div>
              )}
              
              <div className="absolute bottom-0 right-0">
                <Button
                  type="button"
                  size="icon"
                  className="rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={16} />
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mt-2">
              Click the upload button to change your profile picture
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Tell us about yourself"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="birthdate">Birthdate</Label>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2 text-muted-foreground" />
                <Input
                  id="birthdate"
                  type="date"
                  value={birthdate}
                  onChange={e => setBirthdate(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/profile/${user.id}`)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default EditProfile;
