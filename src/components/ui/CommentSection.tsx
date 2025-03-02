
import React, { useState } from 'react';
import { Comment, Media } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useMedia } from '@/context/MediaContext';
import { formatDate } from '@/utils/media';
import UserAvatar from './UserAvatar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface CommentSectionProps {
  media: Media;
}

const CommentSection: React.FC<CommentSectionProps> = ({ media }) => {
  const { user } = useAuth();
  const { comments, addComment, deleteComment } = useMedia();
  const [commentText, setCommentText] = useState('');
  
  const mediaComments = comments[media.id] || [];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;
    
    addComment(media.id, commentText);
    setCommentText('');
  };
  
  const handleDelete = (commentId: string) => {
    if (!user) return;
    deleteComment(media.id, commentId);
  };
  
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Comments ({mediaComments.length})</h3>
      
      {user && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <UserAvatar user={user} size="sm" />
            <div className="flex-1">
              <Textarea
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full resize-none mb-2"
                rows={2}
              />
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={!commentText.trim()}
                  size="sm"
                >
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}
      
      <div className="space-y-4">
        {mediaComments.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No comments yet. Be the first to comment!</p>
        ) : (
          mediaComments.map((comment) => (
            <div key={comment.id} className="flex gap-3 animate-fade-in">
              {comment.user && <UserAvatar user={comment.user} size="sm" />}
              <div className="flex-1">
                <div className="bg-secondary/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-medium">
                      {comment.user?.name || 'Unknown User'}
                    </div>
                    {user?.id === comment.userId && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(comment.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatDate(comment.createdAt)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
