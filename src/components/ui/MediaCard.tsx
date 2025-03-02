
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Media, User } from '@/types';
import { Heart, MessageCircle, Clock } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { useMedia } from '@/context/MediaContext';
import { formatDateShort } from '@/utils/media';
import UserAvatar from './UserAvatar';
import { useNavigate } from 'react-router-dom';

interface MediaCardProps {
  media: Media;
}

const MediaCard: React.FC<MediaCardProps> = ({ media }) => {
  const { users } = useAuth();
  const { comments, likeMedia } = useMedia();
  const navigate = useNavigate();
  
  const user = users.find(u => u.id === media.userId) as User;
  const commentCount = comments[media.id]?.length || 0;
  
  const imageUrl = media.type === 'image' 
    ? media.url 
    : media.thumbnailUrl || 'https://images.unsplash.com/photo-1618090584176-7132b9911657?q=80&w=500&auto=format&fit=crop';
  
  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-md group"
      onClick={() => navigate(`/media/${media.id}`)}
    >
      <div className="relative aspect-video overflow-hidden bg-black/5">
        <img 
          src={imageUrl} 
          alt={media.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {media.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center backdrop-blur-sm">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-14 border-l-primary border-b-8 border-b-transparent ml-1"></div>
            </div>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
          <Clock size={12} className="inline mr-1" />
          {formatDateShort(media.createdAt)}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <UserAvatar user={user} size="sm" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{media.title}</h3>
            <p className="text-sm text-muted-foreground">{user.name}</p>
          </div>
        </div>
        {media.description && (
          <p className="mt-3 text-sm text-gray-700 line-clamp-2">{media.description}</p>
        )}
        {media.tags && media.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {media.tags.map(tag => (
              <span 
                key={tag} 
                className="px-2 py-0.5 bg-secondary text-xs rounded-full text-secondary-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <button 
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            likeMedia(media.id);
          }}
        >
          <Heart 
            size={18} 
            className={media.hasLiked ? "fill-red-500 text-red-500" : ""} 
          />
          <span>{media.likes}</span>
        </button>
        
        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
          <MessageCircle size={18} />
          <span>{commentCount}</span>
        </button>
      </CardFooter>
    </Card>
  );
};

export default MediaCard;
