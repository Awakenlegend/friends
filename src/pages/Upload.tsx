
import React, { useState, useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useMedia } from '@/context/MediaContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getMediaType, generateThumbnail } from '@/utils/media';
import { toast } from "sonner";
import { Camera, Upload as UploadIcon, X, Plus } from 'lucide-react';

const Upload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { addMedia } = useMedia();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const fileType = selectedFile.type;
      const mediaType = getMediaType(fileType);
      
      if (!mediaType) {
        toast.error("Unsupported file type. Please upload an image or video.");
        return;
      }
      
      const fileURL = URL.createObjectURL(selectedFile);
      setFile(selectedFile);
      setPreview(fileURL);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const fileType = droppedFile.type;
      const mediaType = getMediaType(fileType);
      
      if (!mediaType) {
        toast.error("Unsupported file type. Please upload an image or video.");
        return;
      }
      
      const fileURL = URL.createObjectURL(droppedFile);
      setFile(droppedFile);
      setPreview(fileURL);
    }
  };
  
  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleTagAdd = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };
  
  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagAdd();
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !file || !title.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, we would upload the file to a server
      // For this demo, we'll use the object URL
      const mediaType = getMediaType(file.type) as 'image' | 'video';
      let thumbnailUrl = undefined;
      
      if (mediaType === 'video') {
        thumbnailUrl = await generateThumbnail(file);
      }
      
      const mediaObject = {
        title,
        description,
        url: preview as string,
        thumbnailUrl,
        type: mediaType,
        userId: user.id,
        tags: tags.length > 0 ? tags : undefined,
      };
      
      addMedia(mediaObject);
      navigate('/feed');
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("There was a problem uploading your media. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="page-container max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Media</h1>
          <p className="text-muted-foreground">
            Share your photos and videos with your friends
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div 
            className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
              file ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/30'
            } text-center cursor-pointer`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => !file && fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*, video/*"
              className="hidden"
            />
            
            {file && preview ? (
              <div className="relative">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                >
                  <X size={16} />
                </Button>
                
                {file.type.startsWith('image/') ? (
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="max-h-80 mx-auto rounded-md animate-blur-in"
                  />
                ) : (
                  <video 
                    src={preview} 
                    controls 
                    className="max-h-80 mx-auto rounded-md"
                  />
                )}
                
                <p className="mt-2 text-sm text-muted-foreground">
                  {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              </div>
            ) : (
              <div className="py-8">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Camera size={24} className="text-primary" />
                </div>
                <p className="text-lg font-medium mb-1">
                  Drag and drop your media here
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to select a file
                </p>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadIcon size={16} className="mr-2" />
                  Browse Files
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Supports: JPG, PNG, GIF, MP4, MOV, up to 50MB
                </p>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="block mb-1">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a title to your media"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="block mb-1">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell your friends more about this media"
                rows={3}
              />
            </div>
            
            <div>
              <Label className="block mb-1">
                Tags
              </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                  <div 
                    key={tag} 
                    className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="ml-1 text-muted-foreground hover:text-foreground"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Add tags (e.g., nature, friends)"
                  className="rounded-r-none"
                />
                <Button 
                  type="button" 
                  onClick={handleTagAdd}
                  className="rounded-l-none"
                  disabled={!tagInput.trim()}
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate('/feed')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!file || !title.trim() || isSubmitting}
              className="min-w-24"
            >
              {isSubmitting ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default Upload;
