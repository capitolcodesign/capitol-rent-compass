
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PropertyTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const PropertyTypeSelect: React.FC<PropertyTypeSelectProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="type">Property Type</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Multi-family">Multi-family</SelectItem>
          <SelectItem value="Single-family">Single-family</SelectItem>
          <SelectItem value="Apartment">Apartment</SelectItem>
          <SelectItem value="Condo">Condo</SelectItem>
          <SelectItem value="Townhouse">Townhouse</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PropertyTypeSelect;
