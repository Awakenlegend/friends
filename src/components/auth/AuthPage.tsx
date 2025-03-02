
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/feed');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await login(email);
      // Navigate is handled by the useEffect
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-primary flex items-center justify-center p-8">
          <div className="max-w-md mx-auto animate-scale-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">FriendFeed</h1>
            <p className="text-white/90 text-lg mb-6">
              A private space for you and your friends to share moments that matter.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-xs p-4 rounded-lg">
                <h3 className="font-medium text-white mb-2">Private</h3>
                <p className="text-white/80 text-sm">
                  Only our small group can access the content we share.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-4 rounded-lg">
                <h3 className="font-medium text-white mb-2">Simple</h3>
                <p className="text-white/80 text-sm">
                  Clean design focused on our photos and videos.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-4 rounded-lg">
                <h3 className="font-medium text-white mb-2">Social</h3>
                <p className="text-white/80 text-sm">
                  Comment, like, and search shared content.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-4 rounded-lg">
                <h3 className="font-medium text-white mb-2">Memories</h3>
                <p className="text-white/80 text-sm">
                  Preserve our college memories in one place.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-background">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8 animate-slide-down">
              <h2 className="text-3xl font-bold mb-2">Welcome</h2>
              <p className="text-muted-foreground">
                Enter your email to sign in to your private account.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up">
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  disabled={isLoading || isSubmitting}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={!email.trim() || isLoading || isSubmitting}
              >
                <Mail className="mr-2 h-4 w-4" />
                {isSubmitting ? "Signing In..." : "Sign In with Email"}
              </Button>
              
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors underline"
                >
                  {showHint ? "Hide hint" : "Need a hint?"}
                </button>
                
                {showHint && (
                  <div className="mt-2 p-3 bg-muted rounded-md text-sm animate-fade-in">
                    <p>This is a closed platform for Jugaad Junction team and demo users.</p>
                    <p className="mt-1">Try one of these emails:</p>
                    <div className="mt-1 space-y-1 text-left pl-4">
                      <p className="font-semibold mt-2">Demo emails:</p>
                      <ul className="space-y-1">
                        <li>alex@example.com</li>
                        <li>taylor@example.com</li>
                        <li>jordan@example.com</li>
                        <li>casey@example.com</li>
                        <li>riley@example.com</li>
                      </ul>
                      
                      <p className="font-semibold mt-2">Alliance University emails:</p>
                      <ul className="space-y-1">
                        <li>ashahulbtech23@ced.alliance.edu.in</li>
                        <li>fmohammedbtech23@ced.alliance.edu.in</li>
                        <li>uchandrubtech23@ced.alliance.edu.in</li>
                        <li>akashrbtech23@ced.alliance.edu.in</li>
                        <li>yrohithbtech23@ced.alliance.edu.in</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
