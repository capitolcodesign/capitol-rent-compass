
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PropertyDetails, Metrics, EvaluationResult } from '@/types/rental-fairness';
import PropertyDetailsForm from '@/components/rental-fairness/PropertyDetailsForm';
import MetricsForm from '@/components/rental-fairness/MetricsForm';
import MarketDataForm from '@/components/rental-fairness/MarketDataForm';
import FairnessResult from '@/components/rental-fairness/FairnessResult';

interface FairnessCalculatorProps {
  propertyDetails?: Partial<PropertyDetails>;
}

const FairnessCalculator: React.FC<FairnessCalculatorProps> = ({ propertyDetails = {} }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [details, setDetails] = useState<PropertyDetails>({
    rent: propertyDetails.rent || 0,
    squareFeet: propertyDetails.squareFeet || 0,
    bedrooms: propertyDetails.bedrooms || 0,
    bathrooms: propertyDetails.bathrooms || 0,
    location: propertyDetails.location || '',
    locationDetails: propertyDetails.locationDetails,
    amenities: propertyDetails.amenities || [],
    condition: propertyDetails.condition || ''
  });
  const [metrics, setMetrics] = useState<Metrics>({
    locationImportance: 50,
    conditionImportance: 50,
    sizeImportance: 50,
    amenitiesImportance: 50,
    marketRateImportance: 50
  });
  const [marketData, setMarketData] = useState<{
    useAutoMarketData: boolean;
    averageRent: number;
    comparableProperties: {
      rent: number;
      squareFeet: number;
      bedrooms: number;
      bathrooms: number;
      distance?: number;
      address?: string;
    }[];
  }>({
    useAutoMarketData: true,
    averageRent: 0,
    comparableProperties: []
  });
  
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  // Effect to update details when propertyDetails prop changes
  useEffect(() => {
    if (propertyDetails) {
      setDetails(prevDetails => ({
        ...prevDetails,
        rent: propertyDetails.rent || prevDetails.rent,
        squareFeet: propertyDetails.squareFeet || prevDetails.squareFeet,
        bedrooms: propertyDetails.bedrooms || prevDetails.bedrooms,
        bathrooms: propertyDetails.bathrooms || prevDetails.bathrooms,
        location: propertyDetails.location || prevDetails.location,
        locationDetails: propertyDetails.locationDetails || prevDetails.locationDetails,
        amenities: propertyDetails.amenities || prevDetails.amenities,
        condition: propertyDetails.condition || prevDetails.condition
      }));
    }
  }, [propertyDetails]);

  const handleCalculate = async () => {
    // Validate inputs
    if (!details.location || !details.rent || !details.squareFeet) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields in the Property Details.",
        variant: "destructive"
      });
      setActiveTab('details');
      return;
    }

    setIsCalculating(true);

    try {
      const payload = {
        propertyDetails: details,
        metrics,
        marketData: marketData.useAutoMarketData ? undefined : {
          averageRent: marketData.averageRent,
          comparableProperties: marketData.comparableProperties
        }
      };

      // Call to the edge function endpoint
      const response = await fetch('/api/rental-fairness', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate rental fairness');
      }

      const data = await response.json();
      setResult(data);
      setActiveTab('result');
    } catch (error) {
      console.error('Fairness calculation error:', error);
      toast({
        title: "Calculation Error",
        description: `Failed to calculate rental fairness: ${(error as Error).message}`,
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleNext = (current: string) => {
    switch (current) {
      case 'details':
        // Validate property details
        if (!details.location || !details.rent || !details.squareFeet || !details.bedrooms || !details.bathrooms) {
          toast({
            title: "Validation Error",
            description: "Please fill in all required fields before continuing.",
            variant: "destructive"
          });
          return;
        }
        setActiveTab('metrics');
        break;
      case 'metrics':
        setActiveTab('market');
        break;
      case 'market':
        handleCalculate();
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="details">Property Details</TabsTrigger>
          <TabsTrigger value="metrics">Fairness Metrics</TabsTrigger>
          <TabsTrigger value="market">Market Data</TabsTrigger>
          <TabsTrigger value="result" disabled={!result}>Results</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <PropertyDetailsForm 
            propertyDetails={details} 
            onPropertyDetailsChange={setDetails} 
          />
          <div className="flex justify-end mt-6">
            <Button onClick={() => handleNext('details')}>
              Next: Fairness Metrics
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <MetricsForm 
            metrics={metrics} 
            setMetrics={setMetrics} 
          />
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setActiveTab('details')}>
              Back
            </Button>
            <Button onClick={() => handleNext('metrics')}>
              Next: Market Data
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <MarketDataForm
            marketData={marketData}
            setMarketData={setMarketData}
            propertyDetails={{
              bedrooms: details.bedrooms,
              bathrooms: details.bathrooms,
              squareFeet: details.squareFeet,
              location: details.location
            }}
          />
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setActiveTab('metrics')}>
              Back
            </Button>
            <Button 
              onClick={() => handleNext('market')}
              disabled={isCalculating}
            >
              {isCalculating ? 
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2" /> : 
                null}
              Calculate Fairness
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="result">
          <FairnessResult result={result} isLoading={isCalculating} />
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setActiveTab('market')}>
              Back to Market Data
            </Button>
            <Button 
              variant="default"
              onClick={() => {
                setResult(null);
                setActiveTab('details');
              }}
            >
              Start New Analysis
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FairnessCalculator;
