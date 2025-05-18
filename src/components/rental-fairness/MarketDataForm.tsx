
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MarketData, ComparableProperty } from "@/types/rental-fairness";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";

interface MarketDataFormProps {
  marketData: MarketData;
  setMarketData: React.Dispatch<React.SetStateAction<MarketData>>;
}

const MarketDataForm: React.FC<MarketDataFormProps> = ({ 
  marketData, 
  setMarketData 
}) => {
  const handleAverageRentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMarketData(prev => ({
      ...prev,
      averageRent: Number(e.target.value) || 0
    }));
  };

  const handleComparablePropertyChange = (index: number, field: keyof ComparableProperty, value: string) => {
    const updatedProperties = [...marketData.comparableProperties];
    updatedProperties[index] = {
      ...updatedProperties[index],
      [field]: Number(value) || 0
    };
    
    setMarketData(prev => ({
      ...prev,
      comparableProperties: updatedProperties
    }));
  };

  const addComparableProperty = () => {
    setMarketData(prev => ({
      ...prev,
      comparableProperties: [
        ...prev.comparableProperties,
        { rent: 0, squareFeet: 0, bedrooms: 0, bathrooms: 0 }
      ]
    }));
  };

  const removeComparableProperty = (index: number) => {
    setMarketData(prev => ({
      ...prev,
      comparableProperties: prev.comparableProperties.filter((_, i) => i !== index)
    }));
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="averageRent">Average Rent in Area ($)</Label>
          <Input
            id="averageRent"
            type="number"
            value={marketData.averageRent}
            onChange={handleAverageRentChange}
            placeholder="1600"
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Comparable Properties</Label>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={addComparableProperty}
              type="button"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Property
            </Button>
          </div>

          {marketData.comparableProperties.map((property, index) => (
            <Card key={index} className="border border-muted p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-medium">Property {index + 1}</h4>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0" 
                  onClick={() => removeComparableProperty(index)}
                >
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor={`rent-${index}`} className="text-xs">Rent ($)</Label>
                  <Input
                    id={`rent-${index}`}
                    type="number"
                    value={property.rent}
                    onChange={(e) => handleComparablePropertyChange(index, 'rent', e.target.value)}
                    placeholder="1500"
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`sqft-${index}`} className="text-xs">Square Feet</Label>
                  <Input
                    id={`sqft-${index}`}
                    type="number"
                    value={property.squareFeet}
                    onChange={(e) => handleComparablePropertyChange(index, 'squareFeet', e.target.value)}
                    placeholder="800"
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`bedroom-${index}`} className="text-xs">Bedrooms</Label>
                  <Input
                    id={`bedroom-${index}`}
                    type="number"
                    value={property.bedrooms}
                    onChange={(e) => handleComparablePropertyChange(index, 'bedrooms', e.target.value)}
                    placeholder="2"
                    className="h-8"
                    min="0"
                    step="1"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`bathroom-${index}`} className="text-xs">Bathrooms</Label>
                  <Input
                    id={`bathroom-${index}`}
                    type="number"
                    value={property.bathrooms}
                    onChange={(e) => handleComparablePropertyChange(index, 'bathrooms', e.target.value)}
                    placeholder="1"
                    className="h-8"
                    min="0"
                    step="0.5"
                  />
                </div>
              </div>
            </Card>
          ))}
          
          {marketData.comparableProperties.length === 0 && (
            <div className="text-center py-4 border border-dashed rounded-md">
              <p className="text-sm text-muted-foreground">No comparable properties added</p>
              <Button 
                variant="ghost" 
                onClick={addComparableProperty} 
                className="mt-2"
                size="sm"
                type="button"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Your First Property
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketDataForm;
