
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import FooterSection from '@/components/landing/FooterSection';
import { useAuth } from '@/contexts/AuthContext';

const LandingPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // If user is authenticated, redirect them to the dashboard
  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  // Show loading state while auth is determining
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-capitol-cream">
        <div className="text-center">
          <Logo size="lg" />
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] mt-6"></div>
        </div>
      </div>
    );
  }
  
  // If user is authenticated, don't render the landing page at all
  if (isAuthenticated) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-capitol-cream">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <Logo size="lg" />
        <div className="flex items-center space-x-4">
          <Link 
            to="/login" 
            className="text-capitol-charcoal hover:text-capitol-orange transition-colors"
          >
            Log in
          </Link>
          <Link to="/login?tab=signup">
            <Button size="sm">
              Sign up <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default LandingPage;
