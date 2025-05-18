
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Tag, Check } from 'lucide-react';

interface PropertyTagItemProps {
  name: string;
  isSelected: boolean;
  onToggle: (isChecked: boolean) => void;
  isLoading: boolean;
}

const PropertyTagItem: React.FC<PropertyTagItemProps> = ({
  name,
  isSelected,
  onToggle,
  isLoading
}) => {
  return (
    <div className="flex items-center">
      <div className="relative">
        <Checkbox
          id={`tag-${name}`}
          className="absolute opacity-0"
          checked={isSelected}
          onCheckedChange={(isChecked) => onToggle(!!isChecked)}
          disabled={isLoading}
        />
        <label
          htmlFor={`tag-${name}`}
          className={`cursor-pointer flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full
            ${isSelected 
              ? 'bg-primary/10 text-primary border border-primary/30' 
              : 'bg-secondary text-secondary-foreground border border-secondary hover:bg-secondary/80'}`}
        >
          <Tag className="h-3 w-3" />
          {name}
          {isSelected && <Check className="h-3 w-3 ml-1" />}
        </label>
      </div>
      {isLoading && (
        <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-r-transparent ml-2"></div>
      )}
    </div>
  );
};

export default PropertyTagItem;
