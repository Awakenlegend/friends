
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from '@/types';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-20 w-20',
  };
  
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
  
  return (
    <Avatar className={`${sizeClasses[size]} ${className} ring-1 ring-gray-200 shadow-sm border border-white`}>
      {user.profilePicture ? (
        <AvatarImage 
          src={user.profilePicture} 
          alt={user.name}
          className="object-cover animate-blur-in"
        />
      ) : null}
      <AvatarFallback 
        className="bg-primary/10 text-primary font-medium"
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
