
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Metrics } from "@/types/rental-fairness";
import MetricsSlider from './MetricsSlider';

interface MetricsFormProps {
  metrics: Metrics;
  setMetrics: React.Dispatch<React.SetStateAction<Metrics>>;
}

const MetricsForm: React.FC<MetricsFormProps> = ({ 
  metrics, 
  setMetrics 
}) => {
  const updateMetric = (key: keyof Metrics) => (value: number[]) => {
    setMetrics(prev => ({
      ...prev,
      [key]: value[0]
    }));
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <MetricsSlider 
          label="Location Value" 
          value={metrics.locationImportance} 
          onChange={updateMetric('locationImportance')}
          description="How important is the property's location in determining fair rent?"
        />
        
        <MetricsSlider 
          label="Property Condition" 
          value={metrics.conditionImportance} 
          onChange={updateMetric('conditionImportance')}
          description="How much should the property's condition affect the rent evaluation?"
        />
        
        <MetricsSlider 
          label="Size and Layout" 
          value={metrics.sizeImportance} 
          onChange={updateMetric('sizeImportance')}
          description="Impact of square footage and bedroom/bathroom count on fairness"
        />
        
        <MetricsSlider 
          label="Amenities" 
          value={metrics.amenitiesImportance} 
          onChange={updateMetric('amenitiesImportance')}
          description="How much value do amenities add to the rental price?"
        />
        
        <MetricsSlider 
          label="Market Rate Comparison" 
          value={metrics.marketRateImportance} 
          onChange={updateMetric('marketRateImportance')}
          description="How important are local market rates in determining fairness?"
        />
      </CardContent>
    </Card>
  );
};

export default MetricsForm;
