
import React from 'react';
import { Search, BarChart2, FileText, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: <Search className="h-8 w-8 text-white" />,
    title: "Property Search",
    description: "Quickly find and filter properties based on location, size, amenities, and other key attributes."
  },
  {
    icon: <BarChart2 className="h-8 w-8 text-white" />,
    title: "Market Analysis",
    description: "Our algorithms analyze comparable properties to determine fair market values based on current data."
  },
  {
    icon: <FileText className="h-8 w-8 text-white" />,
    title: "Report Generation",
    description: "Generate detailed, compliance-ready reports with all necessary documentation and justifications."
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-white" />,
    title: "Determination",
    description: "Make informed, data-backed rent reasonableness determinations with confidence and transparency."
  }
];

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <span className="text-element-orange font-medium mb-4 block">HOW IT WORKS</span>
          <h2 className="text-3xl md:text-4xl font-bold text-element-navy mb-6">
            Streamlined Rent Analysis Process
          </h2>
          <p className="text-lg text-element-charcoal/70 max-w-2xl mx-auto">
            Our platform simplifies the rent reasonableness determination process with a straightforward workflow.
          </p>
        </div>
        
        <div className="relative">
          {/* Connect line */}
          <div className="absolute left-1/2 top-24 bottom-0 w-1 bg-element-orange/20 -translate-x-1/2 hidden md:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`relative ${index % 2 === 1 ? 'md:mt-32' : ''}`}
              >
                {/* Step number for desktop */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-6 w-12 h-12 rounded-full bg-element-orange text-white flex items-center justify-center font-bold text-xl z-10 hidden md:flex">
                  {index + 1}
                </div>
                
                <div className="bg-element-navy rounded-xl p-8 h-full">
                  {/* Step number for mobile */}
                  <div className="md:hidden w-10 h-10 rounded-full bg-element-orange text-white flex items-center justify-center font-bold text-lg mb-4">
                    {index + 1}
                  </div>
                  
                  <div className="bg-element-orange/20 p-4 rounded-full inline-flex items-center justify-center mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
