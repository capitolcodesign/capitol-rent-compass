
import React from 'react';
import { 
  Settings, 
  Home, 
  BarChart2, 
  FileText, 
  Users, 
  Search, 
  CheckCircle, 
  Database
} from 'lucide-react';

const features = [
  {
    icon: <Home className="h-10 w-10 text-element-orange" />,
    title: 'Property Management',
    description: 'Easily manage properties in the SHRA system with comprehensive tracking and analysis tools.'
  },
  {
    icon: <BarChart2 className="h-10 w-10 text-element-orange" />,
    title: 'Rent Analysis',
    description: 'Leverage advanced algorithms to analyze market rates and determine reasonable rent values.'
  },
  {
    icon: <FileText className="h-10 w-10 text-element-orange" />,
    title: 'Customizable Reports',
    description: 'Generate detailed reports for stakeholders with customizable parameters and visualizations.'
  },
  {
    icon: <Database className="h-10 w-10 text-element-orange" />,
    title: 'Data Integration',
    description: 'Seamlessly integrate with existing housing databases and systems for comprehensive insights.'
  },
  {
    icon: <Users className="h-10 w-10 text-element-orange" />,
    title: 'User Management',
    description: 'Manage roles and permissions for administrators, staff members, and external stakeholders.'
  },
  {
    icon: <Search className="h-10 w-10 text-element-orange" />,
    title: 'Advanced Search',
    description: 'Quickly find properties with powerful filtering and search capabilities across all data points.'
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <span className="text-element-orange font-medium mb-4 block">POWERFUL FEATURES</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-element-navy mb-6">
            Comprehensive Rent Analysis Platform
          </h2>
          <p className="text-lg text-element-charcoal/70 max-w-2xl mx-auto">
            Our platform provides the tools needed to ensure fair and reasonable rent 
            determinations across Sacramento's diverse housing market.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="p-4 bg-element-lightBlue inline-block rounded-lg mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-element-navy mb-3">
                {feature.title}
              </h3>
              <p className="text-element-charcoal/70">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-element-lightBlue p-8 md:p-12 rounded-xl border border-gray-200">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center justify-between">
            <div className="md:w-1/2">
              <h3 className="text-2xl md:text-3xl font-bold text-element-navy mb-4">
                Transforming Housing Assistance Programs
              </h3>
              <p className="text-element-charcoal/70 mb-6">
                Our platform streamlines the rent reasonableness determination process, ensuring fair pricing across all neighborhoods while meeting program requirements.
              </p>
              <ul className="space-y-3">
                {[
                  'Reduce administrative burden with automated analysis',
                  'Ensure fair and equitable rent determinations',
                  'Generate detailed documentation for compliance',
                  'Support data-driven decision making'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-element-orange flex-shrink-0 mt-1" />
                    <span className="text-element-charcoal">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 transform rotate-3">
                  <img 
                    src="/lovable-uploads/33c86c21-a65a-47cc-bc48-c84732a3e5fd.png" 
                    alt="Analytics Dashboard" 
                    className="rounded-lg w-full max-w-md"
                  />
                </div>
                <div className="absolute -z-10 -bottom-3 -right-3 w-full h-full bg-element-orange/20 rounded-xl transform -rotate-3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
