
import React from 'react';
import { Map } from 'lucide-react';
import PropertyAmenitiesSelect from '../PropertyAmenitiesSelect';

interface AmenitiesTabProps {
  propertyId?: string;
  isNew: boolean;
}

const AmenitiesTab: React.FC<AmenitiesTabProps> = ({
  propertyId,
  isNew,
}) => {
  return (
    <>
      {!isNew && propertyId ? (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Property Amenities</h3>
          <p className="text-sm text-muted-foreground">
            Add amenities that are available at this property.
          </p>
          <PropertyAmenitiesSelect propertyId={propertyId} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg">
          <Map className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Save Property First</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Please save the basic property information first. Once saved, you'll be able to add amenities to this property.
          </p>
        </div>
      )}
    </>
  );
};

export default AmenitiesTab;
