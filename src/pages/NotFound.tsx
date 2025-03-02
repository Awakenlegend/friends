
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const NotFound = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-6xl font-bold text-primary mb-6">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Button asChild>
          <Link to={isAuthenticated ? "/feed" : "/"}>
            {isAuthenticated ? "Return to Feed" : "Return to Home"}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
