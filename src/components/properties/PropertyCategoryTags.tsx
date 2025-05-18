
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface PropertyCategoryTagsProps {
  categories: { id: string; name: string }[];
  className?: string;
}

const PropertyCategoryTags: React.FC<PropertyCategoryTagsProps> = ({ 
  categories,
  className = ''
}) => {
  if (!categories || categories.length === 0) return null;
  
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {categories.map((category) => (
        <Badge 
          key={category.id} 
          variant="outline" 
          className="bg-element-lightBlue/20 text-element-navy hover:bg-element-lightBlue/30"
        >
          {category.name}
        </Badge>
      ))}
    </div>
  );
};

export default PropertyCategoryTags;
