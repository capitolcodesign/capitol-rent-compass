
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-capitol-charcoal mb-6">
              SHRA Rent Reasonableness Analysis
            </h1>
            <p className="text-lg md:text-xl text-secondary mb-8">
              Advanced analytics and reporting tools for accurately determining fair market rent values across Sacramento housing markets.
            </p>
            <div className="flex space-x-4">
              <Link to="/login">
                <Button size="lg">
                  Get Started <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link to="/login?tab=signup">
                <Button variant="outline" size="lg">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <div className="bg-gradient-to-br from-capitol-orange/20 to-capitol-orange/10 rounded-2xl p-8 shadow-xl">
                <img 
                  src="/lovable-uploads/33c86c21-a65a-47cc-bc48-c84732a3e5fd.png" 
                  alt="CAPITOL codesign and SHRA" 
                  className="w-full h-auto object-contain"
                />
                <div className="mt-6 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-capitol-charcoal mb-2">Streamlined Rent Analysis</h3>
                  <p className="text-gray-600">Supporting equitable housing opportunities across Sacramento through data-driven insights and analytics.</p>
                </div>
              </div>
              <div className="absolute -z-10 top-10 right-10 w-full h-full bg-capitol-orange/5 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
