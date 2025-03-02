
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthPage from '@/components/auth/AuthPage';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/feed');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary font-semibold">Loading...</div>
      </div>
    );
  }
  
  return <AuthPage />;
};

export default Index;
