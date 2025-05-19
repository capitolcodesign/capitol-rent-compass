
import React from 'react';
import { Map } from 'lucide-react';
import PropertyCategoriesSelect from '../PropertyCategoriesSelect';
import PropertyTagsSelect from '../PropertyTagsSelect';

interface CategoriesTabProps {
  propertyId?: string;
  isNew: boolean;
}

const CategoriesTab: React.FC<CategoriesTabProps> = ({
  propertyId,
  isNew,
}) => {
  return (
    <>
      {!isNew && propertyId ? (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Property Categories</h3>
            <p className="text-sm text-muted-foreground">
              Categorize this property by assigning it to one or more categories.
            </p>
            <PropertyCategoriesSelect propertyId={propertyId} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Property Tags</h3>
            <p className="text-sm text-muted-foreground">
              Add tags to categorize this property.
            </p>
            <PropertyTagsSelect propertyId={propertyId} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg">
          <Map className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Save Property First</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Please save the basic property information first. Once saved, you'll be able to add categories and tags to this property.
          </p>
        </div>
      )}
    </>
  );
};

export default CategoriesTab;
