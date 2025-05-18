
import React from 'react';
import { Home, Users, FileCheck, TrendingUp } from 'lucide-react';

const stats = [
  {
    icon: <Home className="h-8 w-8 text-element-orange" />,
    value: "15,000+",
    label: "Properties Analyzed",
    description: "Comprehensive database of housing units across Sacramento"
  },
  {
    icon: <Users className="h-8 w-8 text-element-orange" />,
    value: "40+",
    label: "Housing Agencies",
    description: "Trusted by housing authorities throughout the region"
  },
  {
    icon: <FileCheck className="h-8 w-8 text-element-orange" />,
    value: "98%",
    label: "Compliance Rate",
    description: "Ensuring HUD compliance across all determinations"
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-element-orange" />,
    value: "30%",
    label: "Efficiency Increase",
    description: "Average time saved on rent reasonableness processes"
  },
];

const StatSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-element-lightBlue">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <span className="text-element-orange font-medium mb-4 block">BY THE NUMBERS</span>
          <h2 className="text-3xl md:text-4xl font-bold text-element-navy mb-6">
            Making a Measurable Impact
          </h2>
          <p className="text-lg text-element-charcoal/70 max-w-2xl mx-auto">
            Our platform has helped housing authorities streamline processes and ensure fair housing practices.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow text-center"
            >
              <div className="bg-element-orange/10 p-4 rounded-full inline-flex items-center justify-center mb-6">
                {stat.icon}
              </div>
              <div className="text-4xl font-bold text-element-navy mb-2">{stat.value}</div>
              <div className="text-lg font-semibold text-element-orange mb-2">{stat.label}</div>
              <p className="text-element-charcoal/70">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatSection;
