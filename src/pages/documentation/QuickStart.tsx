
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import FooterSection from '@/components/landing/FooterSection';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, ArrowLeft, Download, Printer, CheckSquare } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

const QuickStart: React.FC = () => {
  const { toast } = useToast();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // In a real application, you would generate a PDF using a library like jsPDF
    // For now, we'll simulate the download with a toast notification
    toast({
      title: "PDF Download Started",
      description: "Your PDF is being generated and will download shortly.",
    });
    
    // Simulated delay to represent PDF generation
    setTimeout(() => {
      // Create a blob that simulates a PDF file
      const blob = new Blob(["Quick Start Guide PDF content would go here"], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // Create a link element and trigger a download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'quick-start-guide.pdf';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
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
        <section className="py-12 md:py-16 bg-gradient-to-b from-element-lightBlue to-white">
          <div className="container px-4 mx-auto max-w-7xl">
            {/* Breadcrumb */}
            <div className="mb-8">
              <Link to="/documentation" className="flex items-center text-element-charcoal/70 hover:text-element-orange transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Documentation
              </Link>
            </div>
            
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="flex items-start mb-8">
                <div className="mr-6 p-3 bg-orange-50 rounded-md">
                  <FileText className="h-8 w-8 text-element-orange" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-element-navy mb-4">
                    Quick Start Guide
                  </h1>
                  <p className="text-lg text-element-charcoal/80">
                    Step-by-step tutorial for new users
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-8">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center"
                  onClick={handleDownloadPDF}
                >
                  <Download className="mr-1 h-4 w-4" /> Download PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center"
                  onClick={handlePrint}
                >
                  <Printer className="mr-1 h-4 w-4" /> Print
                </Button>
              </div>
              
              <Separator className="mb-8" />
              
              {/* Document Content */}
              <div className="prose max-w-none">
                <h2>Getting Started with the Rent Reasonableness Platform</h2>
                <p>Welcome to the SHRA Rent Reasonableness Platform! This quick start guide will walk you through the essential steps to get up and running with our system, allowing you to perform accurate rent reasonableness determinations efficiently.</p>
                
                <h3>Step 1: Account Setup</h3>
                <div className="flex items-start mb-4">
                  <CheckSquare className="h-5 w-5 text-element-orange mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="m-0"><strong>Create Your Account</strong></p>
                    <p className="text-element-charcoal/80 mt-1">Click "Sign Up" on the homepage and complete the registration form. You'll need to provide your name, email address, organization, and create a secure password. If you're part of an organization that already has an account, ask your administrator to send you an invitation.</p>
                  </div>
                </div>
                
                <div className="flex items-start mb-4">
                  <CheckSquare className="h-5 w-5 text-element-orange mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="m-0"><strong>Verify Your Email</strong></p>
                    <p className="text-element-charcoal/80 mt-1">Check your inbox for a verification email and click the link to activate your account. If you don't see the email, check your spam folder or request another verification email from the login page.</p>
                  </div>
                </div>
                
                <div className="flex items-start mb-4">
                  <CheckSquare className="h-5 w-5 text-element-orange mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="m-0"><strong>Complete Your Profile</strong></p>
                    <p className="text-element-charcoal/80 mt-1">After logging in for the first time, you'll be prompted to complete your user profile. Add your job title, department, phone number, and profile picture to help colleagues identify you in the system.</p>
                  </div>
                </div>
                
                <h3>Step 2: Navigating the Dashboard</h3>
                <div className="flex items-start mb-4">
                  <CheckSquare className="h-5 w-5 text-element-orange mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="m-0"><strong>Dashboard Overview</strong></p>
                    <p className="text-element-charcoal/80 mt-1">After logging in, you'll land on the dashboard. Here you can see an overview of recent activities, pending tasks, and important metrics related to rent reasonableness determinations.</p>
                  </div>
                </div>
                
                <div className="flex items-start mb-4">
                  <CheckSquare className="h-5 w-5 text-element-orange mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="m-0"><strong>Main Navigation</strong></p>
                    <p className="text-element-charcoal/80 mt-1">The left sidebar contains the main navigation menu with access to Properties, Analysis, Reports, User Management, and Settings.</p>
                  </div>
                </div>
                
                <h3>Step 3: Adding Your First Property</h3>
                <div className="flex items-start mb-4">
                  <CheckSquare className="h-5 w-5 text-element-orange mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="m-0"><strong>Navigate to Properties</strong></p>
                    <p className="text-element-charcoal/80 mt-1">Click on "Properties" in the left sidebar to access the property management section.</p>
                  </div>
                </div>
                
                <div className="flex items-start mb-4">
                  <CheckSquare className="h-5 w-5 text-element-orange mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="m-0"><strong>Add a New Property</strong></p>
                    <p className="text-element-charcoal/80 mt-1">Click the "Add Property" button in the top right corner. Fill in the required information in the form:</p>
                    <ul className="mt-2">
                      <li>Property address</li>
                      <li>Unit details (bedrooms, bathrooms, square footage)</li>
                      <li>Rent amount</li>
                      <li>Utilities included</li>
                      <li>Amenities</li>
                      <li>Property type</li>
                      <li>Year built</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start mb-4">
                  <CheckSquare className="h-5 w-5 text-element-orange mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="m-0"><strong>Upload Photos</strong></p>
                    <p className="text-element-charcoal/80 mt-1">Add property photos by clicking the "Upload Photos" section. At minimum, include exterior, kitchen, and bathroom photos.</p>
                  </div>
                </div>
                
                <h3>Step 4: Running Your First Rent Analysis</h3>
                <div className="flex items-start mb-4">
                  <CheckSquare className="h-5 w-5 text-element-orange mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="m-0"><strong>Select a Property</strong></p>
                    <p className="text-element-charcoal/80 mt-1">From the Properties list, find the property you want to analyze and click "Run Analysis" from the actions menu.</p>
                  </div>
                </div>
                
                <div className="flex items-start mb-4">
                  <CheckSquare className="h-5 w-5 text-element-orange mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="m-0"><strong>Review Comparables</strong></p>
                    <p className="text-element-charcoal/80 mt-1">The system will automatically identify comparable properties based on location, size, and amenities. Review the suggested comparables and make adjustments if needed.</p>
                  </div>
                </div>
                
                <div className="flex items-start mb-4">
                  <CheckSquare className="h-5 w-5 text-element-orange mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="m-0"><strong>Generate Results</strong></p>
                    <p className="text-element-charcoal/80 mt-1">Click "Generate Results" to process the analysis. The system will calculate and display the rent reasonableness determination based on the selected comparables.</p>
                  </div>
                </div>
                
                <h3>Step 5: Creating and Saving Reports</h3>
                <div className="flex items-start mb-4">
                  <CheckSquare className="h-5 w-5 text-element-orange mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="m-0"><strong>Review Analysis Results</strong></p>
                    <p className="text-element-charcoal/80 mt-1">After generating results, review the detailed breakdown of the analysis, including comparable property information, adjustments, and the final rent reasonableness determination.</p>
                  </div>
                </div>
                
                <div className="flex items-start mb-4">
                  <CheckSquare className="h-5 w-5 text-element-orange mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="m-0"><strong>Create a Report</strong></p>
                    <p className="text-element-charcoal/80 mt-1">Click "Create Report" to generate a formal rent reasonableness report. Add any additional notes or observations in the provided fields.</p>
                  </div>
                </div>
                
                <div className="flex items-start mb-4">
                  <CheckSquare className="h-5 w-5 text-element-orange mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="m-0"><strong>Save and Export</strong></p>
                    <p className="text-element-charcoal/80 mt-1">Save the report to your account and export it as a PDF or CSV file by clicking the respective buttons in the report view.</p>
                  </div>
                </div>
                
                <h3>Need More Help?</h3>
                <p>If you need additional assistance, please check out these resources:</p>
                <ul>
                  <li>Visit our <Link to="/documentation">Documentation</Link> section for detailed guides</li>
                  <li>Contact our <Link to="/help-center">Help Center</Link> for technical support</li>
                  <li>Join the <Link to="/community">Community Forum</Link> to connect with other users</li>
                </ul>
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

export default QuickStart;
