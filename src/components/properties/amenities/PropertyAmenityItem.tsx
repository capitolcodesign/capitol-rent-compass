
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface PropertyAmenityItemProps {
  name: string;
  isSelected: boolean;
  onToggle: (isChecked: boolean) => void;
  isLoading: boolean;
}

const PropertyAmenityItem: React.FC<PropertyAmenityItemProps> = ({
  name,
  isSelected,
  onToggle,
  isLoading
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={`amenity-${name}`}
        checked={isSelected}
        onCheckedChange={(isChecked) => onToggle(!!isChecked)}
        disabled={isLoading}
      />
      <label
        htmlFor={`amenity-${name}`}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {name}
      </label>
      {isLoading && (
        <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-r-transparent ml-2"></div>
      )}
    </div>
  );
};

export default PropertyAmenityItem;
