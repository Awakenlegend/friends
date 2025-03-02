
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Mock users for the closed platform
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    birthdate: '1995-03-15',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    bio: 'Film enthusiast and amateur photographer',
  },
  {
    id: '2',
    name: 'Taylor Smith',
    email: 'taylor@example.com',
    birthdate: '1996-07-22',
    profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    bio: 'Adventure seeker and nature lover',
  },
  {
    id: '3',
    name: 'Jordan Lee',
    email: 'jordan@example.com',
    birthdate: '1995-11-08',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    bio: 'Music producer and coffee addict',
  },
  {
    id: '4',
    name: 'Casey Nguyen',
    email: 'casey@example.com',
    birthdate: '1997-01-30',
    profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    bio: 'Fashion design student and art collector',
  },
  {
    id: '5',
    name: 'Riley Garcia',
    email: 'riley@example.com',
    birthdate: '1996-05-17',
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
    bio: 'Tech enthusiast and gamer',
  },
  // New users from Jugaad Junction
  {
    id: '6',
    name: 'Shahul A',
    email: 'ashahulbtech23@ced.alliance.edu.in',
    birthdate: '2000-01-01',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    bio: 'Engineering student at Alliance University',
  },
  {
    id: '7',
    name: 'Mohammed F',
    email: 'fmohammedbtech23@ced.alliance.edu.in',
    birthdate: '2000-01-01',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    bio: 'Engineering student at Alliance University',
  },
  {
    id: '8',
    name: 'Chandru U',
    email: 'uchandrubtech23@ced.alliance.edu.in',
    birthdate: '2000-01-01',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    bio: 'Engineering student at Alliance University',
  },
  {
    id: '9',
    name: 'Akash R',
    email: 'akashrbtech23@ced.alliance.edu.in',
    birthdate: '2000-01-01',
    profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    bio: 'Engineering student at Alliance University',
  },
  {
    id: '10',
    name: 'Rohith Y',
    email: 'yrohithbtech23@ced.alliance.edu.in',
    birthdate: '2000-01-01',
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
    bio: 'Engineering student at Alliance University',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        toast.success(`Welcome back, ${foundUser.name}!`);
      } else {
        toast.error("Sorry, this is a private platform. You're not on the invite list.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    toast.success("You've been logged out successfully.");
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      users: mockUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
