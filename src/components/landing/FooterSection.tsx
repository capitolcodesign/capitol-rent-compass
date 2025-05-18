
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

const FooterSection: React.FC = () => {
  return (
    <footer className="bg-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="mb-6 md:mb-0">
            <Logo size="md" />
            <p className="text-gray-500 mt-4 max-w-md">
              Sacramento Housing and Redevelopment Agency's official platform for rent reasonableness determination and analysis.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-capitol-charcoal mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link to="/login" className="text-gray-600 hover:text-capitol-orange">Login</Link></li>
                <li><Link to="/login?tab=signup" className="text-gray-600 hover:text-capitol-orange">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-capitol-charcoal mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-capitol-orange">Documentation</a></li>
                <li><a href="#" className="text-gray-600 hover:text-capitol-orange">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-capitol-charcoal mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-capitol-orange">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-capitol-orange">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>© 2025 Sacramento Housing &amp; Redevelopment Agency. All rights reserved.</p>
          <p className="mt-2">Designed and developed by CAPITOL codesign.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
