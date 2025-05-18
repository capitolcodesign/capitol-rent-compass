
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import FooterSection from '@/components/landing/FooterSection';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Calendar, MessageSquare } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Community: React.FC = () => {
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
                Community
              </h1>
              <p className="text-lg text-element-charcoal/80 mb-8">
                Connect with housing professionals and share knowledge
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-16">
                <Button className="bg-element-orange hover:bg-element-orange/90 text-white">
                  Join the Community <Users className="ml-1 h-4 w-4" />
                </Button>
                <Button variant="outline">
                  Browse Forums <MessageSquare className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-element-navy mb-4">Discussion Forums</h2>
                <p className="text-element-charcoal/80 mb-6">
                  Engage with other housing professionals in our moderated discussion forums. Share experiences, ask questions, and learn from others in the field.
                </p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <span className="font-medium">Rent Reasonableness Methodologies</span>
                    <span className="text-sm text-gray-500">124 posts</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <span className="font-medium">HUD Compliance Discussions</span>
                    <span className="text-sm text-gray-500">87 posts</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <span className="font-medium">Software Tips & Tricks</span>
                    <span className="text-sm text-gray-500">209 posts</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-element-navy mb-4">Upcoming Events</h2>
                <p className="text-element-charcoal/80 mb-6">
                  Join virtual and in-person events to network with other professionals and stay updated with industry trends.
                </p>
                <div className="space-y-6">
                  <div className="border-l-4 border-element-orange pl-4">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 text-element-orange mr-2" />
                      <span className="text-sm text-element-orange">June 15, 2025 • Virtual</span>
                    </div>
                    <h3 className="font-medium mb-1">Webinar: 2025 HUD Guidelines Updates</h3>
                    <p className="text-sm text-element-charcoal/70">Learn about the latest changes to HUD guidelines and how they affect rent reasonableness studies.</p>
                  </div>
                  
                  <div className="border-l-4 border-element-orange pl-4">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 text-element-orange mr-2" />
                      <span className="text-sm text-element-orange">July 8, 2025 • Sacramento, CA</span>
                    </div>
                    <h3 className="font-medium mb-1">Workshop: Advanced Property Comparison Techniques</h3>
                    <p className="text-sm text-element-charcoal/70">Hands-on workshop for housing professionals to improve rent reasonableness assessments.</p>
                  </div>
                  
                  <div className="border-l-4 border-element-orange pl-4">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 text-element-orange mr-2" />
                      <span className="text-sm text-element-orange">August 22, 2025 • Virtual</span>
                    </div>
                    <h3 className="font-medium mb-1">Panel Discussion: Affordable Housing Challenges</h3>
                    <p className="text-sm text-element-charcoal/70">Industry experts discuss challenges and solutions in the affordable housing sector.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="my-16" />
            
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-element-navy mb-8 text-center">Featured Community Members</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
                  <h3 className="font-semibold mb-1">Sarah Johnson</h3>
                  <p className="text-sm text-center text-element-charcoal/70">Housing Policy Expert<br />Sacramento Housing Authority</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
                  <h3 className="font-semibold mb-1">Michael Rodriguez</h3>
                  <p className="text-sm text-center text-element-charcoal/70">Data Analyst<br />HUD Regional Office</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
                  <h3 className="font-semibold mb-1">Lisa Wong</h3>
                  <p className="text-sm text-center text-element-charcoal/70">Program Director<br />Fair Housing Coalition</p>
                </div>
              </div>
              
              <div className="bg-element-navy text-white p-8 rounded-lg text-center">
                <h3 className="text-xl font-bold mb-4">Become a Community Contributor</h3>
                <p className="mb-6">Share your expertise and help shape the future of rent reasonableness assessments by becoming an active community member.</p>
                <Button className="bg-white text-element-navy hover:bg-gray-100">
                  Learn More About Contributing
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

export default Community;
