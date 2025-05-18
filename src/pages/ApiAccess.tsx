
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import FooterSection from '@/components/landing/FooterSection';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Key, Lock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const ApiAccess: React.FC = () => {
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
              <h1 className="text-4xl md:text-5xl font-bold text-element-navy mb-6 text-center">
                API Access
              </h1>
              <p className="text-lg text-element-charcoal/80 mb-8 text-center">
                Integrate our rent reasonableness tools directly into your applications
              </p>
              
              <div className="flex flex-col md:flex-row gap-6 mt-12 items-center justify-center">
                <Button className="bg-element-orange hover:bg-element-orange/90 text-white">
                  Request API Access <Key className="ml-1 h-4 w-4" />
                </Button>
                <Link to="/documentation">
                  <Button variant="outline">
                    View API Documentation <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              
              <Separator className="my-16" />
              
              <div className="space-y-12">
                <div>
                  <h2 className="text-2xl font-bold text-element-navy mb-4 flex items-center">
                    <Code className="mr-2 text-element-orange" /> API Features
                  </h2>
                  <ul className="space-y-3 text-element-charcoal/80">
                    <li className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-element-orange text-white flex items-center justify-center mr-3 flex-shrink-0">✓</div>
                      <span>Property data retrieval and submission</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-element-orange text-white flex items-center justify-center mr-3 flex-shrink-0">✓</div>
                      <span>Automated rent reasonableness analysis</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-element-orange text-white flex items-center justify-center mr-3 flex-shrink-0">✓</div>
                      <span>Report generation and retrieval</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-element-orange text-white flex items-center justify-center mr-3 flex-shrink-0">✓</div>
                      <span>User management and access controls</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-element-navy mb-4 flex items-center">
                    <Lock className="mr-2 text-element-orange" /> Security and Authentication
                  </h2>
                  <p className="text-element-charcoal/80 mb-4">
                    Our API uses industry-standard OAuth 2.0 authentication and HTTPS encryption to ensure your data remains secure. All API requests require valid authentication tokens that can be managed through your account dashboard.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <code className="text-sm text-element-navy block overflow-x-auto">
                      <span className="text-purple-600">GET</span> /api/v1/properties <br />
                      <span className="text-gray-500">Authorization: Bearer YOUR_API_TOKEN</span>
                    </code>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-element-navy mb-4">Getting Started</h2>
                  <ol className="list-decimal list-inside space-y-4 text-element-charcoal/80">
                    <li>Register for an account or log in to your existing account.</li>
                    <li>Navigate to your account settings and select "API Access".</li>
                    <li>Generate an API key for your application.</li>
                    <li>Review the documentation for implementation details.</li>
                    <li>Start integrating with your systems!</li>
                  </ol>
                </div>
              </div>
              
              <div className="bg-element-navy text-white p-8 rounded-lg mt-12">
                <h3 className="text-xl font-bold mb-4">Enterprise API Solutions</h3>
                <p className="mb-6">Need custom API integrations or higher usage limits? Our enterprise solutions provide dedicated support, custom endpoints, and increased rate limits to meet your organization's specific needs.</p>
                <Button className="bg-white text-element-navy hover:bg-gray-100">
                  Contact Enterprise Sales
                </Button>
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

export default ApiAccess;
