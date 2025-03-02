
import React, { useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Search, Upload, Home, User, LogOut } from 'lucide-react';
import UserAvatar from '@/components/ui/UserAvatar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border sticky top-0 z-10 bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/feed" className="font-semibold text-lg">
            <span className="text-primary">Friend</span>Feed
          </Link>
          
          <div className="flex items-center space-x-4">
            <NavLink
              to="/feed"
              className={({ isActive }) => 
                `button-transition p-2 rounded-full ${isActive ? 'bg-secondary text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`
              }
            >
              <Home size={20} />
            </NavLink>
            
            <NavLink
              to="/search"
              className={({ isActive }) => 
                `button-transition p-2 rounded-full ${isActive ? 'bg-secondary text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`
              }
            >
              <Search size={20} />
            </NavLink>
            
            <NavLink
              to="/upload"
              className={({ isActive }) => 
                `button-transition p-2 rounded-full ${isActive ? 'bg-secondary text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`
              }
            >
              <Upload size={20} />
            </NavLink>
            
            <div className="relative group">
              <Link to={`/profile/${user.id}`}>
                <UserAvatar user={user} size="sm" />
              </Link>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <NavLink
                  to={`/profile/${user.id}`}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-secondary"
                >
                  <User size={16} className="mr-2" />
                  My Profile
                </NavLink>
                
                <button
                  onClick={logout}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-secondary"
                >
                  <LogOut size={16} className="mr-2" />
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="border-t border-border py-4 text-center text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          FriendFeed &copy; {new Date().getFullYear()} — A private space for friends
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
