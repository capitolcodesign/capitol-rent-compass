
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import PropertyAmenityItem from './PropertyAmenityItem';

interface PropertyAmenitiesListProps {
  groupedAmenities: Record<string, {name: string, category: string | null}[]>;
  isAmenitySelected: (name: string) => boolean;
  toggleAmenity: (name: string, category: string | null, isChecked: boolean) => void;
  loadingAmenity: string | null;
}

const PropertyAmenitiesList: React.FC<PropertyAmenitiesListProps> = ({
  groupedAmenities,
  isAmenitySelected,
  toggleAmenity,
  loadingAmenity
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Check className="mr-2 h-5 w-5" />
          Property Amenities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedAmenities).map(([category, amenities]) => (
            <div key={category} className="space-y-2">
              <h3 className="text-sm font-medium">{category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {amenities.map((amenity) => (
                  <PropertyAmenityItem 
                    key={amenity.name}
                    name={amenity.name}
                    isSelected={isAmenitySelected(amenity.name)}
                    onToggle={(isChecked) => toggleAmenity(amenity.name, amenity.category, isChecked)}
                    isLoading={loadingAmenity === amenity.name}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyAmenitiesList;
