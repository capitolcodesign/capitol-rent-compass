
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PropertyTypeSelect from '../PropertyTypeSelect';

interface BasicInfoTabProps {
  propertyData: {
    name: string;
    type: string;
    units: number;
    built_year: number;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTypeChange: (value: string) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  propertyData,
  handleChange,
  handleTypeChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Property Name*</Label>
        <Input 
          id="name" 
          name="name"
          placeholder="Enter property name" 
          value={propertyData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PropertyTypeSelect 
          value={propertyData.type} 
          onChange={handleTypeChange} 
        />
        
        <div className="space-y-2">
          <Label htmlFor="units">Number of Units</Label>
          <Input 
            id="units" 
            name="units"
            type="number" 
            min="1"
            value={propertyData.units}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="built_year">Year Built</Label>
          <Input 
            id="built_year" 
            name="built_year"
            type="number" 
            min="1900" 
            max={new Date().getFullYear()}
            value={propertyData.built_year}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoTab;
