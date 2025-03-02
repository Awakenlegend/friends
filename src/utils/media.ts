
import { Media } from '../types';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)} weeks ago`;
  } else {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  }
};

export const formatBirthdate = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export function getMediaType(fileType: string): 'image' | 'video' | null {
  const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const videoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
  
  if (imageTypes.includes(fileType)) {
    return 'image';
  } else if (videoTypes.includes(fileType)) {
    return 'video';
  }
  
  return null;
}

export function generateThumbnail(videoFile: File): Promise<string> {
  return new Promise((resolve) => {
    // In a real app, we would generate a thumbnail from the video
    // For now, we're just using a placeholder
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(videoFile);
  });
}

export function getMediaDuration(mediaUrl: string): Promise<number> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = function() {
      resolve(video.duration);
      video.remove();
    };
    video.src = mediaUrl;
  });
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
