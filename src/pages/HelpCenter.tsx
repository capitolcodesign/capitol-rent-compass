
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import FooterSection from '@/components/landing/FooterSection';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, LifeBuoy, MessageCircle, Phone } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const HelpCenter: React.FC = () => {
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
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-element-navy mb-6">
                Help Center
              </h1>
              <p className="text-lg text-element-charcoal/80 mb-8">
                Get the support you need to succeed with our platform
              </p>
              
              {/* Search box */}
              <div className="relative max-w-xl mx-auto mb-12">
                <input 
                  type="search" 
                  placeholder="Search for help topics..." 
                  className="w-full px-5 py-4 pr-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-element-orange focus:border-transparent"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-element-orange">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Support card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="bg-orange-50 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                  <LifeBuoy className="text-element-orange" />
                </div>
                <h3 className="text-xl font-semibold text-element-navy mb-2">Technical Support</h3>
                <p className="text-element-charcoal/70 mb-4">Get help with platform features, troubleshooting, and technical issues.</p>
                <Button variant="outline" className="w-full">Contact Support</Button>
              </div>
              
              {/* Chat card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="bg-orange-50 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                  <MessageCircle className="text-element-orange" />
                </div>
                <h3 className="text-xl font-semibold text-element-navy mb-2">Live Chat</h3>
                <p className="text-element-charcoal/70 mb-4">Chat with our support team for immediate assistance during business hours.</p>
                <Button variant="outline" className="w-full">Start Chat</Button>
              </div>
              
              {/* Phone card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="bg-orange-50 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                  <Phone className="text-element-orange" />
                </div>
                <h3 className="text-xl font-semibold text-element-navy mb-2">Phone Support</h3>
                <p className="text-element-charcoal/70 mb-4">Call our dedicated support line for personalized assistance.</p>
                <Button variant="outline" className="w-full">(916) 552-6000</Button>
              </div>
            </div>
            
            <Separator className="my-16" />
            
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-element-navy mb-6 text-center">Frequently Asked Questions</h2>
              
              <div className="space-y-6 mt-8">
                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-semibold text-element-navy mb-2">How do I reset my password?</h3>
                  <p className="text-element-charcoal/70">Visit the login page and click on "Forgot Password". Enter your email address and follow the instructions sent to your inbox.</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-semibold text-element-navy mb-2">Can I export my reports to PDF?</h3>
                  <p className="text-element-charcoal/70">Yes, all reports can be exported to PDF format. Simply navigate to the report you want to export and click the "Export" button in the top-right corner.</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-semibold text-element-navy mb-2">How do I add new properties to the database?</h3>
                  <p className="text-element-charcoal/70">To add a new property, navigate to the Properties section and click "Add Property". Fill in the required information and click "Save" to add it to the database.</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-semibold text-element-navy mb-2">How are rent reasonableness scores calculated?</h3>
                  <p className="text-element-charcoal/70">Rent reasonableness scores are calculated based on multiple factors including location, size, amenities, and comparison with similar properties in the area. Refer to our Documentation section for detailed information.</p>
                </div>
              </div>
              
              <div className="text-center mt-12">
                <Link to="/documentation">
                  <Button variant="outline" className="bg-element-orange text-white hover:bg-element-orange/90">
                    View All Documentation <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
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

export default HelpCenter;
