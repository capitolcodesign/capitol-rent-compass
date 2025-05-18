
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Twitter, Facebook, Instagram, Linkedin, Github, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const FooterSection: React.FC = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to subscribe.",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Subscription Successful",
      description: "Thank you for subscribing to our newsletter!",
    });
    setEmail('');
  };

  return (
    <footer className="bg-element-lightBlue py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-10">
          {/* Logo and Description */}
          <div className="md:w-1/3">
            <Logo size="md" />
            <p className="text-element-charcoal/70 mt-4 max-w-md">
              Sacramento Housing and Redevelopment Agency's official platform for rent reasonableness determination and analysis.
            </p>
            <div className="flex items-center mt-6 space-x-4">
              <a href="#" className="text-element-charcoal/60 hover:text-element-orange transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-element-charcoal/60 hover:text-element-orange transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-element-charcoal/60 hover:text-element-orange transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-element-charcoal/60 hover:text-element-orange transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 md:w-2/3">
            <div>
              <h3 className="font-bold text-element-navy mb-4">Platform</h3>
              <ul className="space-y-3">
                <li><Link to="/login" className="text-element-charcoal/70 hover:text-element-orange">Login</Link></li>
                <li><Link to="/login?tab=signup" className="text-element-charcoal/70 hover:text-element-orange">Sign Up</Link></li>
                <li><a href="#" className="text-element-charcoal/70 hover:text-element-orange">Pricing</a></li>
                <li><Link to="/features" className="text-element-charcoal/70 hover:text-element-orange">Features</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-element-navy mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><Link to="/documentation" className="text-element-charcoal/70 hover:text-element-orange">Documentation</Link></li>
                <li><Link to="/help-center" className="text-element-charcoal/70 hover:text-element-orange">Help Center</Link></li>
                <li><Link to="/api-access" className="text-element-charcoal/70 hover:text-element-orange">API Access</Link></li>
                <li><Link to="/community" className="text-element-charcoal/70 hover:text-element-orange">Community</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-element-navy mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Mail size={16} className="mr-2 text-element-orange" />
                  <a href="mailto:info@shra.org" className="text-element-charcoal/70 hover:text-element-orange">info@shra.org</a>
                </li>
                <li className="flex items-center">
                  <Phone size={16} className="mr-2 text-element-orange" />
                  <a href="tel:+19165526000" className="text-element-charcoal/70 hover:text-element-orange">(916) 552-6000</a>
                </li>
                <li className="flex items-start">
                  <MapPin size={16} className="mr-2 text-element-orange mt-1 flex-shrink-0" />
                  <span className="text-element-charcoal/70">801 12th Street, Sacramento, CA 95814</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Newsletter Subscription */}
        <div className="py-8 border-t border-b border-gray-200 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-bold text-element-navy text-xl mb-3">Subscribe to our newsletter</h3>
            <p className="text-element-charcoal/70 mb-6">
              Stay updated with the latest features, news, and housing market trends.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 rounded-md border border-gray-200 flex-grow focus:outline-none focus:ring-2 focus:ring-element-orange focus:border-transparent"
              />
              <Button 
                type="submit"
                variant="primary"
                className="px-6 py-3 whitespace-nowrap"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-element-charcoal/70 text-sm">
          <p>© 2025 Sacramento Housing & Redevelopment Agency. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-element-orange">Privacy Policy</a>
            <a href="#" className="hover:text-element-orange">Terms of Service</a>
            <a href="#" className="hover:text-element-orange">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
