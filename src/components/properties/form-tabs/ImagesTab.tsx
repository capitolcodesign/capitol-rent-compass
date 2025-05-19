
import React from 'react';
import { Map } from 'lucide-react';
import PropertyImageUpload from '../PropertyImageUpload';
import PropertyImageGallery from '../PropertyImageGallery';

interface ImagesTabProps {
  propertyId?: string;
  isNew: boolean;
}

const ImagesTab: React.FC<ImagesTabProps> = ({
  propertyId,
  isNew,
}) => {
  return (
    <>
      {!isNew && propertyId ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Upload New Image</h3>
            <PropertyImageUpload 
              propertyId={propertyId} 
              onImageUploaded={() => {}} 
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Image Gallery</h3>
            <p className="text-sm text-muted-foreground">
              Manage property images. Set a featured image that will display as the primary image.
            </p>
            <PropertyImageGallery 
              propertyId={propertyId} 
              editable={true} 
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg">
          <Map className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Save Property First</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Please save the basic property information first. Once saved, you'll be able to upload and manage images for this property.
          </p>
        </div>
      )}
    </>
  );
};

export default ImagesTab;
