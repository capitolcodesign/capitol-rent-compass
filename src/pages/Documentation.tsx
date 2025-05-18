
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Logo from '@/components/Logo';
import FooterSection from '@/components/landing/FooterSection';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Documentation: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Logo size="md" />
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-element-charcoal hover:text-element-orange transition-colors">Home</Link>
            <Link to="/features" className="text-element-charcoal hover:text-element-orange transition-colors">Features</Link>
            <Link to="/about" className="text-element-charcoal hover:text-element-orange transition-colors">About</Link>
            <Link to="/contact" className="text-element-charcoal hover:text-element-orange transition-colors">Contact</Link>
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
        <section className="py-16 md:py-24 bg-gradient-to-b from-element-lightBlue to-white">
          <div className="container px-4 mx-auto max-w-7xl">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-element-navy mb-6">
                Documentation
              </h1>
              <p className="text-lg text-element-charcoal/80 mb-8">
                Resources for conducting rent reasonableness studies
              </p>
              <Separator className="mb-12" />

              <div className="space-y-6">
                {/* HUD Guidelines */}
                <Link 
                  to="/documentation/hud-guidelines"
                  className="block p-6 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start">
                    <div className="mr-4 p-2 bg-orange-50 rounded-md">
                      <FileText className="h-6 w-6 text-element-orange" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-element-navy mb-1">HUD Guidelines</h3>
                      <p className="text-element-charcoal/70">Official HUD rent reasonableness requirements</p>
                    </div>
                  </div>
                </Link>
                
                {/* SHRA Procedures Manual */}
                <Link 
                  to="/documentation/shra-procedures"
                  className="block p-6 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start">
                    <div className="mr-4 p-2 bg-orange-50 rounded-md">
                      <FileText className="h-6 w-6 text-element-orange" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-element-navy mb-1">SHRA Procedures Manual</h3>
                      <p className="text-element-charcoal/70">Agency-specific guidance for rent studies</p>
                    </div>
                  </div>
                </Link>
                
                {/* Quick Start Guide */}
                <Link 
                  to="/documentation/quick-start"
                  className="block p-6 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start">
                    <div className="mr-4 p-2 bg-orange-50 rounded-md">
                      <FileText className="h-6 w-6 text-element-orange" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-element-navy mb-1">Quick Start Guide</h3>
                      <p className="text-element-charcoal/70">Step-by-step tutorial for new users</p>
                    </div>
                  </div>
                </Link>
                
                {/* Additional document - Best Practices */}
                <Link 
                  to="/documentation/best-practices"
                  className="block p-6 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start">
                    <div className="mr-4 p-2 bg-orange-50 rounded-md">
                      <FileText className="h-6 w-6 text-element-orange" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-element-navy mb-1">Best Practices</h3>
                      <p className="text-element-charcoal/70">Industry standards and recommendations for accurate assessments</p>
                    </div>
                  </div>
                </Link>
                
                {/* Additional document - FAQ */}
                <Link 
                  to="/documentation/faq"
                  className="block p-6 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start">
                    <div className="mr-4 p-2 bg-orange-50 rounded-md">
                      <FileText className="h-6 w-6 text-element-orange" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-element-navy mb-1">Frequently Asked Questions</h3>
                      <p className="text-element-charcoal/70">Common questions about rent reasonableness determinations</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default Documentation;
