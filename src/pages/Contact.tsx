
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail, Phone, MapPin, Send, Check } from 'lucide-react';
import Logo from '@/components/Logo';
import FooterSection from '@/components/landing/FooterSection';
import { useToast } from '@/components/ui/use-toast';

const ContactUs: React.FC = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 1000);
  };

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
            <Link to="/contact" className="text-element-orange font-medium transition-colors">Contact</Link>
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
                Contact Us
              </h1>
              <p className="text-lg text-element-charcoal/80 mb-8">
                Have questions about our platform? We're here to help. Reach out to our team using the contact information below.
              </p>
            </div>
          </div>
        </section>
        
        {/* Contact Information */}
        <section className="py-12 bg-white">
          <div className="container px-4 mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-element-lightBlue p-8 rounded-xl text-center">
                <div className="bg-white h-16 w-16 mx-auto rounded-full flex items-center justify-center mb-4">
                  <Mail className="h-8 w-8 text-element-orange" />
                </div>
                <h3 className="text-xl font-bold text-element-navy mb-3">Email Us</h3>
                <a href="mailto:info@shra.org" className="text-element-charcoal hover:text-element-orange transition-colors">
                  info@shra.org
                </a>
              </div>
              
              <div className="bg-element-lightBlue p-8 rounded-xl text-center">
                <div className="bg-white h-16 w-16 mx-auto rounded-full flex items-center justify-center mb-4">
                  <Phone className="h-8 w-8 text-element-orange" />
                </div>
                <h3 className="text-xl font-bold text-element-navy mb-3">Call Us</h3>
                <a href="tel:+19165526000" className="text-element-charcoal hover:text-element-orange transition-colors">
                  (916) 552-6000
                </a>
              </div>
              
              <div className="bg-element-lightBlue p-8 rounded-xl text-center">
                <div className="bg-white h-16 w-16 mx-auto rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-8 w-8 text-element-orange" />
                </div>
                <h3 className="text-xl font-bold text-element-navy mb-3">Visit Us</h3>
                <p className="text-element-charcoal">
                  801 12th Street<br />
                  Sacramento, CA 95814
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Form */}
        <section className="py-16 bg-white">
          <div className="container px-4 mx-auto max-w-7xl">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-element-navy mb-8 text-center">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="bg-element-lightBlue p-8 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-element-navy font-medium mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-element-orange focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-element-navy font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-element-orange focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-element-navy font-medium mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-element-orange focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-element-navy font-medium mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-element-orange focus:border-transparent"
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Billing Question">Billing Question</option>
                      <option value="Partnership Opportunity">Partnership Opportunity</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6">
                  <label htmlFor="message" className="block text-element-navy font-medium mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-element-orange focus:border-transparent"
                  ></textarea>
                </div>
                
                <div className="mt-8">
                  <Button 
                    type="submit" 
                    className="w-full bg-element-orange hover:bg-element-orange/90 text-white py-3"
                  >
                    {submitted ? (
                      <>
                        Message Sent <Check className="ml-2 h-5 w-5" />
                      </>
                    ) : (
                      <>
                        Send Message <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
        
        {/* Map Section */}
        <section className="py-16 bg-white">
          <div className="container px-4 mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-element-navy mb-8 text-center">Our Location</h2>
            <div className="aspect-[16/9] bg-gray-200 rounded-xl overflow-hidden">
              {/* Replace with actual map embed */}
              <div className="w-full h-full flex items-center justify-center bg-element-lightBlue">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-element-orange mx-auto mb-4" />
                  <p className="text-lg font-medium">Map placeholder - SHRA location</p>
                  <p>801 12th Street, Sacramento, CA 95814</p>
                </div>
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

export default ContactUs;
