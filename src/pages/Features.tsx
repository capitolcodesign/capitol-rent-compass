
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Logo from '@/components/Logo';
import FooterSection from '@/components/landing/FooterSection';

const Features: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Logo size="md" />
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-element-charcoal hover:text-element-orange transition-colors">Home</Link>
            <Link to="/features" className="text-element-orange font-medium transition-colors">Features</Link>
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
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-element-navy mb-6">
                Platform Features
              </h1>
              <p className="text-lg text-element-charcoal/80 mb-8">
                Discover all the powerful tools and capabilities of our Rent Reasonableness Analysis Platform.
              </p>
            </div>
          </div>
        </section>
        
        {/* Feature Categories */}
        <section className="py-16 bg-white">
          <div className="container px-4 mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-element-lightBlue p-8 rounded-xl">
                <h2 className="text-2xl font-bold text-element-navy mb-4">Property Analysis</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-element-orange text-white flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">✓</div>
                    <span>Advanced property comparison algorithm</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-element-orange text-white flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">✓</div>
                    <span>Historical rent data analysis</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-element-orange text-white flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">✓</div>
                    <span>Neighborhood market insights</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-element-lightBlue p-8 rounded-xl">
                <h2 className="text-2xl font-bold text-element-navy mb-4">Reporting Tools</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-element-orange text-white flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">✓</div>
                    <span>Customizable report templates</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-element-orange text-white flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">✓</div>
                    <span>PDF and CSV export options</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-element-orange text-white flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">✓</div>
                    <span>HUD compliance documentation</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-element-lightBlue p-8 rounded-xl">
                <h2 className="text-2xl font-bold text-element-navy mb-4">User Management</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-element-orange text-white flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">✓</div>
                    <span>Role-based access control</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-element-orange text-white flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">✓</div>
                    <span>Audit trails and activity logs</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-element-orange text-white flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">✓</div>
                    <span>Team collaboration tools</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 bg-element-navy text-white">
          <div className="container px-4 mx-auto max-w-7xl text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to experience these features?</h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Get started with our platform today and streamline your rent reasonableness determinations.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/login?tab=signup">
                <Button size="lg" className="bg-element-orange hover:bg-element-orange/90 text-white font-medium px-6">
                  Sign Up Now <ArrowRight className="ml-1 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-6">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default Features;
