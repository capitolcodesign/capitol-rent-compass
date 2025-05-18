
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import FooterSection from '@/components/landing/FooterSection';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, ArrowLeft, Download, Printer } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

const HudGuidelines: React.FC = () => {
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
      const blob = new Blob(["HUD Guidelines PDF content would go here"], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // Create a link element and trigger a download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'hud-guidelines.pdf';
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
                    HUD Guidelines
                  </h1>
                  <p className="text-lg text-element-charcoal/80">
                    Official HUD rent reasonableness requirements
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
                <h2>1. Introduction to Rent Reasonableness</h2>
                <p>The U.S. Department of Housing and Urban Development (HUD) requires that Public Housing Authorities (PHAs) and owners determine that rents are reasonable before entering into a Housing Assistance Payment (HAP) contract. This requirement is designed to ensure that subsidized rents do not exceed the rents for comparable unassisted units in the same market area.</p>
                
                <h2>2. Legal Framework</h2>
                <p>Rent reasonableness requirements are established under 24 CFR 982.507, which states that PHAs must determine whether the rent to owner is a reasonable rent in comparison to rent for other comparable unassisted units. Rent reasonableness determinations are made:</p>
                <ul>
                  <li>Before entering into a HAP contract</li>
                  <li>Before any increase in rent to owner</li>
                  <li>If there is a 10 percent decrease in the published FMR</li>
                  <li>If directed by HUD</li>
                </ul>
                
                <h2>3. Required Factors for Comparison</h2>
                <p>At a minimum, the following factors must be considered when conducting rent reasonableness determinations:</p>
                <ul>
                  <li><strong>Location:</strong> Neighborhood, proximity to public transportation, shopping, schools, etc.</li>
                  <li><strong>Size:</strong> Number of bedrooms, square footage, and overall unit size</li>
                  <li><strong>Unit Type:</strong> Structure type (single-family, duplex, garden, high-rise, etc.)</li>
                  <li><strong>Quality:</strong> Building condition, unit condition, etc.</li>
                  <li><strong>Age:</strong> Year built and subsequent renovations</li>
                  <li><strong>Amenities:</strong> Unit amenities (A/C, dishwasher, etc.) and building/complex amenities (playground, laundry, etc.)</li>
                  <li><strong>Utilities:</strong> Type of utilities, who pays for which utilities</li>
                  <li><strong>Housing Services:</strong> Maintenance and other services provided by the owner</li>
                  <li><strong>Management:</strong> Quality of property management</li>
                </ul>
                
                <h2>4. Documentation Requirements</h2>
                <p>PHAs must maintain documentation that the rent reasonableness system meets the requirements outlined by HUD and that each determination is appropriately documented. Documentation should include:</p>
                <ul>
                  <li>The address of the unit</li>
                  <li>The number of bedrooms</li>
                  <li>The rent amount</li>
                  <li>The utilities included in the rent</li>
                  <li>The comparable units used in the analysis</li>
                  <li>The date of the determination</li>
                  <li>The name of the person who conducted the determination</li>
                </ul>
                
                <h2>5. Methodologies for Rent Reasonableness</h2>
                <p>HUD does not prescribe a specific methodology for rent reasonableness determinations but requires that the chosen method is reasonable, documented, and applied consistently. Common methodologies include:</p>
                <ul>
                  <li><strong>Unit-to-Unit Comparison:</strong> Direct comparison with specific units</li>
                  <li><strong>Unit-to-Market Comparison:</strong> Comparison with a market database</li>
                  <li><strong>Point System:</strong> Assigning points to various features and calculating a total score</li>
                  <li><strong>Rent Comparability Studies:</strong> More comprehensive market analysis</li>
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

export default HudGuidelines;
