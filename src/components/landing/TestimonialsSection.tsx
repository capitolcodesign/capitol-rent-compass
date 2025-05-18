
import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "The SHRA platform has revolutionized how we approach rent reasonableness determinations. The data-driven insights save us countless hours.",
    author: "Jane Smith",
    title: "Housing Specialist",
    rating: 5
  },
  {
    quote: "The analytics provided by this tool have helped us ensure fair pricing across all neighborhoods while meeting program requirements.",
    author: "Michael Johnson",
    title: "Program Director",
    rating: 5
  },
  {
    quote: "Implementing this system has improved our efficiency by over 40% while increasing accuracy. The reporting features are exceptional.",
    author: "Sarah Williams",
    title: "Data Analyst",
    rating: 5
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-element-navy text-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <span className="text-element-orange font-medium mb-4 block">TESTIMONIALS</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Trusted by Housing Professionals
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Hear from the experts using our platform to transform housing assistance programs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-xl hover:bg-white/15 transition-colors"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-element-orange fill-element-orange" />
                ))}
              </div>
              <p className="text-white mb-6 text-lg">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-element-orange/20 flex items-center justify-center text-element-orange font-bold text-xl">
                  {testimonial.author.charAt(0)}
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-white">{testimonial.author}</p>
                  <p className="text-sm text-gray-300">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-block p-4 bg-element-orange/10 rounded-lg mb-6">
            <div className="flex items-center justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-element-orange fill-element-orange" />
              ))}
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Join 50+ Housing Agencies Already Using Our Platform</h3>
          <p className="text-gray-300 max-w-3xl mx-auto mb-8">
            Improve efficiency, ensure compliance, and make data-driven decisions with SHRA's Rent Reasonableness Analysis Platform.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
