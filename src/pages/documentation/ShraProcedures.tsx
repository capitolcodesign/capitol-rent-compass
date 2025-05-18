
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import FooterSection from '@/components/landing/FooterSection';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, ArrowLeft, Download, Printer } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const ShraProcedures: React.FC = () => {
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
                    SHRA Procedures Manual
                  </h1>
                  <p className="text-lg text-element-charcoal/80">
                    Agency-specific guidance for rent studies
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-8">
                <Button variant="outline" size="sm" className="flex items-center">
                  <Download className="mr-1 h-4 w-4" /> Download PDF
                </Button>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Printer className="mr-1 h-4 w-4" /> Print
                </Button>
              </div>
              
              <Separator className="mb-8" />
              
              {/* Document Content */}
              <div className="prose max-w-none">
                <h2>1. Sacramento Housing & Redevelopment Agency Overview</h2>
                <p>The Sacramento Housing and Redevelopment Agency (SHRA) serves as the local housing authority for the City and County of Sacramento. This procedures manual outlines the specific methodologies and processes used by SHRA to conduct rent reasonableness determinations in compliance with HUD requirements while addressing the unique housing market conditions in the Sacramento region.</p>
                
                <h2>2. Sacramento Market Area Definitions</h2>
                <p>For rent reasonableness purposes, SHRA has divided the Sacramento region into the following market areas:</p>
                <ul>
                  <li><strong>Downtown/Midtown:</strong> Urban core with higher density housing</li>
                  <li><strong>North Sacramento:</strong> Including Del Paso Heights, Hagginwood, and North Highlands</li>
                  <li><strong>South Sacramento:</strong> Including Florin, Meadowview, and Valley Hi</li>
                  <li><strong>East Sacramento:</strong> Including East Sacramento, Tahoe Park, and Elmhurst</li>
                  <li><strong>Arden-Arcade:</strong> Including Arden-Arcade and North Oak Park</li>
                  <li><strong>Natomas:</strong> North and South Natomas areas</li>
                  <li><strong>Elk Grove/South County:</strong> Including Elk Grove, Laguna, and Franklin</li>
                  <li><strong>Rancho Cordova/Folsom:</strong> Eastern county areas</li>
                  <li><strong>Citrus Heights/Carmichael:</strong> Northeastern county areas</li>
                </ul>
                <p>Market comparisons should generally be made within the same market area unless insufficient comparable units exist within that area.</p>
                
                <h2>3. SHRA's Rent Reasonableness Methodology</h2>
                <p>SHRA uses a point-based system for determining rent reasonableness. This system assigns weighted values to different property and unit characteristics, creating a comprehensive score that can be used to compare assisted units with unassisted units in the same market area.</p>
                <h3>3.1 Point System Breakdown</h3>
                <p>The following factors are assigned point values in SHRA's system:</p>
                <ul>
                  <li><strong>Location (25 points):</strong> Assessed based on neighborhood quality, proximity to amenities, schools, transportation</li>
                  <li><strong>Size (20 points):</strong> Based on square footage and number of bedrooms/bathrooms</li>
                  <li><strong>Quality (20 points):</strong> Assessment of overall construction quality and materials</li>
                  <li><strong>Age/Condition (15 points):</strong> Based on year built and level of maintenance</li>
                  <li><strong>Amenities (10 points):</strong> Unit and property amenities</li>
                  <li><strong>Utilities (10 points):</strong> Based on which utilities are included in rent</li>
                </ul>
                
                <h2>4. Required Documentation</h2>
                <p>SHRA staff must complete the following documentation for each rent reasonableness determination:</p>
                <ul>
                  <li>SHRA Form RR-100 (Rent Reasonableness Certification)</li>
                  <li>Comparable Unit Documentation Form (at least 3 comparables required)</li>
                  <li>Property photos (minimum of 3, showing exterior, kitchen, and bathroom)</li>
                  <li>Map showing subject property and comparable properties</li>
                  <li>Notes explaining any special considerations</li>
                </ul>
                
                <h2>5. Specific Procedures for SHRA Staff</h2>
                <h3>5.1 Initial Inspections</h3>
                <p>During the initial HQS inspection, inspectors should:</p>
                <ul>
                  <li>Document all amenities present in the unit</li>
                  <li>Take required photographs</li>
                  <li>Note the general condition of the unit</li>
                  <li>Complete the Unit Characteristics section of Form RR-100</li>
                </ul>
                
                <h3>5.2 Collecting Market Data</h3>
                <p>SHRA maintains a database of unassisted rental units throughout Sacramento County. This database is updated through:</p>
                <ul>
                  <li>Regular market surveys conducted quarterly</li>
                  <li>Local real estate listings</li>
                  <li>Information from property management companies</li>
                  <li>Staff observations of available units</li>
                </ul>
                
                <h3>5.3 Approval Process</h3>
                <p>Rent reasonableness determinations must be reviewed and approved by a supervisor before a HAP contract can be executed. The review process ensures that:</p>
                <ul>
                  <li>At least three appropriate comparables were used</li>
                  <li>Point calculations were performed correctly</li>
                  <li>All required documentation is complete</li>
                  <li>The determination is consistent with SHRA policies</li>
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

export default ShraProcedures;
