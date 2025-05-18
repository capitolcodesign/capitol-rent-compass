
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyDetails, MarketData, Metrics, EvaluationResult, FairnessEvalRequest } from '@/types/rental-fairness';
import { Button } from '@/components/ui/button';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { toast } from '@/components/ui/use-toast';
import PropertyDetailsForm from '@/components/rental-fairness/PropertyDetailsForm';
import MarketDataForm from '@/components/rental-fairness/MarketDataForm';
import MetricsForm from '@/components/rental-fairness/MetricsForm';
import FairnessResult from '@/components/rental-fairness/FairnessResult';

const RentalFairness: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("property-details");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const supabase = useSupabaseClient();
  
  // State for forms
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails>({
    rent: 0,
    squareFeet: 0,
    bedrooms: 0,
    bathrooms: 0,
    location: '',
    amenities: [],
    condition: 'Good'
  });
  
  const [marketData, setMarketData] = useState<MarketData>({
    averageRent: 0,
    comparableProperties: []
  });
  
  const [metrics, setMetrics] = useState<Metrics>({
    locationImportance: 7,
    conditionImportance: 6,
    sizeImportance: 8,
    amenitiesImportance: 5,
    marketRateImportance: 9
  });
  
  const analyzeRentalFairness = async () => {
    if (propertyDetails.rent <= 0) {
      toast({
        title: "Invalid rent amount",
        description: "Please enter a valid rent amount greater than zero.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare the request payload
      const requestData: FairnessEvalRequest = {
        propertyDetails,
        metrics,
        marketData: marketData.averageRent > 0 ? marketData : undefined
      };
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('rental-fairness-gpt', {
        body: requestData
      });
      
      if (error) throw error;
      
      // Update the result state
      setEvaluationResult(data);
      
      // Switch to the results tab
      setActiveTab('results');
      
      toast({
        title: "Analysis Complete",
        description: "The rental fairness analysis has been completed successfully.",
      });
    } catch (error) {
      console.error('Error analyzing rental fairness:', error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing the rental fairness. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNextTab = () => {
    if (activeTab === 'property-details') {
      setActiveTab('market-data');
    } else if (activeTab === 'market-data') {
      setActiveTab('metrics');
    } else if (activeTab === 'metrics') {
      analyzeRentalFairness();
    }
  };
  
  const handlePrevTab = () => {
    if (activeTab === 'market-data') {
      setActiveTab('property-details');
    } else if (activeTab === 'metrics') {
      setActiveTab('market-data');
    } else if (activeTab === 'results') {
      setActiveTab('metrics');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Rental Fairness Evaluator</h1>
        <p className="text-muted-foreground mb-6">
          Use our AI-powered tool to analyze if your rental property is priced fairly based on customizable metrics.
        </p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="property-details">Property Details</TabsTrigger>
            <TabsTrigger value="market-data">Market Data</TabsTrigger>
            <TabsTrigger value="metrics">Evaluation Metrics</TabsTrigger>
            <TabsTrigger value="results" disabled={!evaluationResult && !isLoading}>Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="property-details" className="space-y-6">
            <PropertyDetailsForm 
              propertyDetails={propertyDetails} 
              setPropertyDetails={setPropertyDetails} 
            />
          </TabsContent>
          
          <TabsContent value="market-data" className="space-y-6">
            <MarketDataForm 
              marketData={marketData} 
              setMarketData={setMarketData} 
            />
          </TabsContent>
          
          <TabsContent value="metrics" className="space-y-6">
            <MetricsForm 
              metrics={metrics} 
              setMetrics={setMetrics} 
            />
          </TabsContent>
          
          <TabsContent value="results" className="space-y-6">
            <FairnessResult 
              result={evaluationResult} 
              isLoading={isLoading} 
            />
          </TabsContent>
          
          <div className="flex justify-between mt-6">
            {activeTab !== "property-details" && (
              <Button 
                onClick={handlePrevTab} 
                variant="outline"
                disabled={isLoading}
              >
                Previous
              </Button>
            )}
            
            {activeTab !== "results" && (
              <Button 
                onClick={handleNextTab}
                className="ml-auto"
                disabled={isLoading}
              >
                {activeTab === "metrics" ? "Analyze Now" : "Next"}
              </Button>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default RentalFairness;
