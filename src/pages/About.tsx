
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Logo from '@/components/Logo';
import FooterSection from '@/components/landing/FooterSection';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Logo size="md" />
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-element-charcoal hover:text-element-orange transition-colors">Home</Link>
            <Link to="/features" className="text-element-charcoal hover:text-element-orange transition-colors">Features</Link>
            <Link to="/about" className="text-element-orange font-medium transition-colors">About</Link>
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
                About Our Platform
              </h1>
              <p className="text-lg text-element-charcoal/80 mb-8">
                Learn about the Sacramento Housing and Redevelopment Agency's mission and how our platform supports fair housing initiatives.
              </p>
            </div>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="container px-4 mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-element-navy mb-4">Our Mission</h2>
                <p className="text-lg text-element-charcoal/80 mb-6">
                  The Sacramento Housing and Redevelopment Agency is committed to improving the quality of life for Sacramento residents through the development of affordable housing, the revitalization of neighborhoods, and the creation of economic opportunities.
                </p>
                <p className="text-lg text-element-charcoal/80">
                  Our Rent Reasonableness Analysis Platform was developed to ensure fair housing practices throughout Sacramento County by providing accurate, data-driven rent determinations that benefit both property owners and residents seeking affordable housing.
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="relative">
                  <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
                    <img 
                      src="/lovable-uploads/33c86c21-a65a-47cc-bc48-c84732a3e5fd.png" 
                      alt="SHRA Logo" 
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                  <div className="absolute -z-10 -bottom-3 -right-3 w-full h-full bg-element-orange/20 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* History Section */}
        <section className="py-16 bg-element-lightBlue">
          <div className="container px-4 mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-element-navy mb-8 text-center">Our History</h2>
            <div className="flex flex-col space-y-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="md:w-1/4 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-element-navy text-white flex items-center justify-center text-xl font-bold">1970</div>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-xl font-bold text-element-navy mb-2">Agency Founding</h3>
                    <p className="text-element-charcoal/80">
                      The Sacramento Housing and Redevelopment Agency was founded to address housing needs and community development in Sacramento County.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="md:w-1/4 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-element-navy text-white flex items-center justify-center text-xl font-bold">2010</div>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-xl font-bold text-element-navy mb-2">Digital Transformation</h3>
                    <p className="text-element-charcoal/80">
                      SHRA began implementing digital solutions to streamline processes and improve service delivery to Sacramento residents.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="md:w-1/4 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-element-navy text-white flex items-center justify-center text-xl font-bold">2023</div>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-xl font-bold text-element-navy mb-2">Platform Launch</h3>
                    <p className="text-element-charcoal/80">
                      The Rent Reasonableness Analysis Platform was launched to provide data-driven rent determinations and support fair housing initiatives across the region.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="container px-4 mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-element-navy mb-8 text-center">Our Leadership Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((index) => (
                <div key={index} className="bg-element-lightBlue rounded-xl p-6 text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4">
                    {/* Placeholder for team member photo */}
                  </div>
                  <h3 className="text-xl font-bold text-element-navy mb-1">Team Member {index}</h3>
                  <p className="text-element-orange mb-3">Executive Role</p>
                  <p className="text-element-charcoal/80">
                    Dedicated to improving housing accessibility and community development in Sacramento.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 bg-element-navy text-white">
          <div className="container px-4 mx-auto max-w-7xl text-center">
            <h2 className="text-3xl font-bold mb-6">Join us in our mission</h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Help us create a more equitable housing market in Sacramento through data-driven rent analysis.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/login?tab=signup">
                <Button size="lg" className="bg-element-orange hover:bg-element-orange/90 text-white font-medium px-6">
                  Get Started <ArrowRight className="ml-1 h-5 w-5" />
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

export default About;
