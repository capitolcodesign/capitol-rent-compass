
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import FooterSection from '@/components/landing/FooterSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import PartnerSection from '@/components/landing/PartnerSection';
import StatSection from '@/components/landing/StatSection';
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
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <Logo size="lg" />
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-element-orange border-r-transparent align-[-0.125em] mt-6"></div>
        </div>
      </div>
    );
  }
  
  // If user is authenticated, don't render the landing page at all
  if (isAuthenticated) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Logo size="md" />
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-element-orange font-medium transition-colors">Home</Link>
            <Link to="/features" className="text-element-charcoal hover:text-element-orange transition-colors">Features</Link>
            <Link to="/about" className="text-element-charcoal hover:text-element-orange transition-colors">About</Link>
            <Link to="/contact" className="text-element-charcoal hover:text-element-orange transition-colors">Contact</Link>
            <Link to="/rental-fairness" className="text-element-charcoal hover:text-element-orange transition-colors">Rental Fairness</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-element-charcoal hover:text-element-orange transition-colors hidden md:block"
            >
              Log in
            </Link>
            <Link to="/login?tab=signup">
              <Button size="sm" className="bg-element-orange hover:bg-element-orange/90 text-white">
                Sign up <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <HeroSection />
        <StatSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PartnerSection />
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default LandingPage;
