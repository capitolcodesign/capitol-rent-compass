import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
const HeroSection: React.FC = () => {
  return <section className="py-16 md:py-24 bg-gradient-to-b from-element-lightBlue to-white">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-block animate-fade-in mb-6">
            <img src="/lovable-uploads/33c86c21-a65a-47cc-bc48-c84732a3e5fd.png" alt="CAPITOL codesign and SHRA" className="h-40 md:h-20 w-auto" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-element-navy animate-slide-up mb-6 leading-tight">
            Rent Reasonableness <span className="text-element-orange">Analysis Platform</span>
          </h1>
          <p className="text-lg md:text-xl text-element-charcoal/80 mb-8 max-w-3xl mx-auto animate-slide-up">
            Sacramento Housing and Redevelopment Agency's comprehensive platform for accurately determining fair market rent values across Sacramento's diverse housing markets.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12 animate-slide-up">
            <Link to="/login">
              <Button size="lg" className="bg-element-orange hover:bg-element-orange/90 text-white font-medium px-6">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login?tab=signup">
              <Button variant="outline" size="lg" className="border-element-orange text-element-orange hover:bg-element-orange/10 px-6">
                Schedule Demo
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 text-left">
            {[{
            text: "Analyze market rents with advanced algorithms",
            id: 1
          }, {
            text: "Generate detailed property comparison reports",
            id: 2
          }, {
            text: "Support housing assistance program compliance",
            id: 3
          }].map(item => <div key={item.id} className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-element-orange flex-shrink-0" />
                <span className="text-element-charcoal">{item.text}</span>
              </div>)}
          </div>
        </div>

        <div className="relative rounded-xl overflow-hidden shadow-2xl mt-16 max-w-5xl mx-auto">
          <div className="bg-white p-4 md:p-8 rounded-xl border border-gray-200">
            <div className="aspect-[16/9] bg-element-lightBlue rounded-lg overflow-hidden">
              <img src="/lovable-uploads/33c86c21-a65a-47cc-bc48-c84732a3e5fd.png" alt="Platform Demo" className="w-full h-full object-cover" style={{
              opacity: 0.8
            }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button size="lg" className="bg-element-orange hover:bg-element-orange/90 text-white rounded-full w-16 h-16 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </Button>
              </div>
            </div>
            <div className="mt-6 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-element-navy mb-2">Data-Driven Analysis</h3>
              <p className="text-element-charcoal/80">Supporting equitable housing opportunities across Sacramento through advanced analytics, market insights, and comprehensive reporting.</p>
            </div>
          </div>
          <div className="absolute -z-10 top-6 left-6 w-full h-full bg-element-orange/10 rounded-xl"></div>
        </div>
      </div>
    </section>;
};
export default HeroSection;