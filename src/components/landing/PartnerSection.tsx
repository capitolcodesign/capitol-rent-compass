
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PartnerSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <span className="text-element-orange font-medium mb-4 block">TRUSTED PARTNERS</span>
          <h2 className="text-3xl md:text-4xl font-bold text-element-navy mb-6">
            Supporting Housing Agencies Across California
          </h2>
          <p className="text-lg text-element-charcoal/70 max-w-2xl mx-auto">
            Our platform helps housing authorities ensure fair and reasonable rent determinations.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center mb-16">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center justify-center h-16 opacity-70 hover:opacity-100 transition-opacity">
              <img 
                src="/lovable-uploads/33c86c21-a65a-47cc-bc48-c84732a3e5fd.png" 
                alt={`Partner logo ${i + 1}`} 
                className="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 transition-all"
              />
            </div>
          ))}
        </div>
        
        <div className="bg-element-lightBlue rounded-xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-2/3">
              <h3 className="text-2xl md:text-3xl font-bold text-element-navy mb-4">
                Ready to transform your rent analysis process?
              </h3>
              <p className="text-element-charcoal/70">
                Schedule a demo today to see how our platform can help your agency ensure fair housing practices.
              </p>
            </div>
            <div>
              <Button size="lg" className="bg-element-orange hover:bg-element-orange/90 text-white px-8 py-6 h-auto text-lg">
                Schedule Demo <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;
