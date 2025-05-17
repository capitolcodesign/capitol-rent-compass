
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-capitol-cream">
      <Logo size="lg" />
      
      <h1 className="mt-8 text-4xl font-bold text-capitol-charcoal">404</h1>
      <p className="mt-4 text-xl text-capitol-gray mb-6">Page not found</p>
      
      <p className="text-center max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      
      <Button asChild>
        <Link to="/">Return to Dashboard</Link>
      </Button>
    </div>
  );
};

export default NotFound;
