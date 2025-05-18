
import React from 'react';
import { Settings, Home, Info } from 'lucide-react';

const features = [
  {
    icon: <Home className="h-10 w-10 text-capitol-orange" />,
    title: 'Property Management',
    description: 'Easily manage properties in the SHRA system with comprehensive tracking and analysis tools.'
  },
  {
    icon: <Info className="h-10 w-10 text-capitol-orange" />,
    title: 'Rent Analysis',
    description: 'Leverage advanced algorithms to analyze market rates and determine reasonable rent values.'
  },
  {
    icon: <Settings className="h-10 w-10 text-capitol-orange" />,
    title: 'Customizable Reports',
    description: 'Generate detailed reports for stakeholders with customizable parameters and visualizations.'
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-capitol-charcoal mb-4">
            Comprehensive Rent Analysis Platform
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform provides the tools needed to ensure fair and reasonable rent 
            determinations across Sacramento's diverse housing market.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-capitol-cream p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="p-4 bg-white inline-block rounded-lg mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-capitol-charcoal mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
