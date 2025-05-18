
import React from 'react';

const testimonials = [
  {
    quote: "The SHRA platform has revolutionized how we approach rent reasonableness determinations.",
    author: "Jane Smith",
    title: "Housing Specialist"
  },
  {
    quote: "The analytics provided by this tool have helped us ensure fair pricing across all neighborhoods.",
    author: "Michael Johnson",
    title: "Program Director"
  },
  {
    quote: "Implementing this system has improved our efficiency by over 40% while increasing accuracy.",
    author: "Sarah Williams",
    title: "Data Analyst"
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-capitol-charcoal text-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
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
              className="bg-white/10 backdrop-blur-sm p-8 rounded-xl"
            >
              <div className="flex justify-center mb-6">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.33334 18.6667C9.33334 20.8758 11.1242 22.6667 13.3333 22.6667C15.5425 22.6667 17.3333 20.8758 17.3333 18.6667C17.3333 16.4575 15.5425 14.6667 13.3333 14.6667V12C10.3878 12 8 14.3878 8 17.3333V24H14.6667V18.6667H9.33334Z" fill="#FF9966"/>
                  <path d="M25.3333 18.6667C25.3333 20.8758 27.1242 22.6667 29.3333 22.6667C31.5425 22.6667 33.3333 20.8758 33.3333 18.6667C33.3333 16.4575 31.5425 14.6667 29.3333 14.6667V12C26.3878 12 24 14.3878 24 17.3333V24H30.6667V18.6667H25.3333Z" fill="#FF9966"/>
                </svg>
              </div>
              <p className="text-white mb-6 italic text-center">
                "{testimonial.quote}"
              </p>
              <div className="text-center">
                <p className="font-semibold text-capitol-orange">{testimonial.author}</p>
                <p className="text-sm text-gray-300">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
