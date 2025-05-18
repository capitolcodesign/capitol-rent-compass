
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import FooterSection from '@/components/landing/FooterSection';

const LandingPage: React.FC = () => {
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
