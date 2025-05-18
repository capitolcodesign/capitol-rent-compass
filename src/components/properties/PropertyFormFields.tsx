
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertyTypeSelect from './PropertyTypeSelect';
import PropertyImageUpload from './PropertyImageUpload';
import PropertyImageGallery from './PropertyImageGallery';
import PropertyAmenitiesSelect from './PropertyAmenitiesSelect';
import PropertyTagsSelect from './PropertyTagsSelect';
import PropertyCategoriesSelect from './PropertyCategoriesSelect';
import PropertyCustomFields from './PropertyCustomFields';

interface PropertyFormData {
  id?: string;
  property_id?: string;
  name: string;
  address: string;
  type: string;
  units: number;
  built_year: number;
  zip: string;
}

interface PropertyFormFieldsProps {
  propertyData: PropertyFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTypeChange: (value: string) => void;
  isNew?: boolean;
}

const PropertyFormFields: React.FC<PropertyFormFieldsProps> = ({
  propertyData,
  handleChange,
  handleTypeChange,
  isNew = true,
}) => {
  return (
    <Tabs defaultValue="basic" className="space-y-6">
      <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-4">
        <TabsTrigger value="basic" className="text-sm">Basic Info</TabsTrigger>
        {!isNew && (
          <>
            <TabsTrigger value="categories" className="text-sm">Categories</TabsTrigger>
            <TabsTrigger value="images" className="text-sm">Images</TabsTrigger>
            <TabsTrigger value="amenities" className="text-sm">Amenities</TabsTrigger>
            <TabsTrigger value="tags" className="text-sm">Tags</TabsTrigger>
            <TabsTrigger value="custom" className="text-sm">Custom Fields</TabsTrigger>
          </>
        )}
      </TabsList>
      
      <TabsContent value="basic" className="space-y-4">
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
        
        <div className="space-y-2">
          <Label htmlFor="address">Address*</Label>
          <Input 
            id="address" 
            name="address"
            placeholder="Enter property address" 
            value={propertyData.address}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="zip">ZIP Code*</Label>
          <Input 
            id="zip" 
            name="zip"
            placeholder="Enter ZIP code" 
            value={propertyData.zip}
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
      </TabsContent>
      
      {!isNew && propertyData.id && (
        <>
          <TabsContent value="categories" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Property Categories</h3>
              <p className="text-sm text-muted-foreground">
                Categorize this property by assigning it to one or more categories.
              </p>
              <PropertyCategoriesSelect propertyId={propertyData.id} />
            </div>
          </TabsContent>
          
          <TabsContent value="images" className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Upload New Image</h3>
                <PropertyImageUpload 
                  propertyId={propertyData.id} 
                  onImageUploaded={() => {}} 
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Image Gallery</h3>
                <p className="text-sm text-muted-foreground">
                  Manage property images. Set a featured image that will display as the primary image.
                </p>
                <PropertyImageGallery 
                  propertyId={propertyData.id} 
                  editable={true} 
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="amenities" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Property Amenities</h3>
              <p className="text-sm text-muted-foreground">
                Add amenities that are available at this property.
              </p>
              <PropertyAmenitiesSelect propertyId={propertyData.id} />
            </div>
          </TabsContent>
          
          <TabsContent value="tags" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Property Tags</h3>
              <p className="text-sm text-muted-foreground">
                Add tags to categorize this property.
              </p>
              <PropertyTagsSelect propertyId={propertyData.id} />
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Custom Fields</h3>
              <p className="text-sm text-muted-foreground">
                Add custom fields to store additional information about this property.
              </p>
              <PropertyCustomFields propertyId={propertyData.id} />
            </div>
          </TabsContent>
        </>
      )}
    </Tabs>
  );
};

export default PropertyFormFields;
