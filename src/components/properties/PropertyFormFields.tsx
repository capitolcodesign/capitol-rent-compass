
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Map, MapPin, Trash2, Plus, X } from 'lucide-react';
import PropertyTypeSelect from './PropertyTypeSelect';
import PropertyImageUpload from './PropertyImageUpload';
import PropertyImageGallery from './PropertyImageGallery';
import PropertyAmenitiesSelect from './PropertyAmenitiesSelect';
import PropertyTagsSelect from './PropertyTagsSelect';
import PropertyCategoriesSelect from './PropertyCategoriesSelect';
import PropertyCustomFields from './PropertyCustomFields';
import AddressAutocomplete from '@/components/AddressAutocomplete';

interface PropertyFormData {
  id?: string;
  property_id?: string;
  name: string;
  address: string;
  type: string;
  units: number;
  built_year: number;
  zip: string;
  city?: string;
  state?: string;
  street?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
}

interface PropertyFormFieldsProps {
  propertyData: PropertyFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleTypeChange: (value: string) => void;
  updateCoordinates?: (lat: number, lng: number) => void;
  updateAddress?: (addressComponents: {street?: string, city?: string, state?: string, zip?: string}) => void;
  isNew?: boolean;
}

const PropertyFormFields: React.FC<PropertyFormFieldsProps> = ({
  propertyData,
  handleChange,
  handleTypeChange,
  updateCoordinates,
  updateAddress,
  isNew = true,
}) => {
  
  const handleAddressSelect = (address: any) => {
    // Create a synthetic event to update the address field
    const addressEvent = {
      target: {
        name: 'address',
        value: address.full
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleChange(addressEvent);
    
    // Update address component fields if available
    if (updateAddress) {
      updateAddress({
        street: address.street,
        city: address.city,
        state: address.state,
        zip: address.zip
      });
    }
    
    // Update coordinates if available
    if (updateCoordinates && address.lat && address.lng) {
      updateCoordinates(address.lat, address.lng);
    }
    
    // If we have a zip code, update that too
    if (address.zip) {
      const zipEvent = {
        target: {
          name: 'zip',
          value: address.zip
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleChange(zipEvent);
    }
  };

  const defaultTab = isNew ? "basic" : "basic";
  
  return (
    <Tabs defaultValue={defaultTab} className="space-y-6">
      <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-4">
        <TabsTrigger value="basic" className="text-sm">Basic Info</TabsTrigger>
        <TabsTrigger value="address" className="text-sm">Address Details</TabsTrigger>
        <TabsTrigger value="description" className="text-sm">Description</TabsTrigger>
        <TabsTrigger value="images" className="text-sm">Images</TabsTrigger>
        <TabsTrigger value="amenities" className="text-sm">Amenities</TabsTrigger>
        <TabsTrigger value="categories" className="text-sm">Categories/Tags</TabsTrigger>
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
      
      <TabsContent value="address" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">Full Address*</Label>
          <AddressAutocomplete
            onAddressSelect={handleAddressSelect}
            defaultValue={propertyData.address}
            placeholder="Enter property address"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Search for the property address to automatically populate the fields below
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="street">Street</Label>
            <Input 
              id="street" 
              name="street"
              placeholder="Street address" 
              value={propertyData.street || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input 
              id="city" 
              name="city"
              placeholder="City" 
              value={propertyData.city || ''}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input 
              id="state" 
              name="state"
              placeholder="State" 
              value={propertyData.state || ''}
              onChange={handleChange}
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input 
              id="latitude" 
              name="latitude"
              type="number"
              step="any"
              placeholder="Latitude" 
              value={propertyData.latitude || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input 
              id="longitude" 
              name="longitude"
              type="number"
              step="any" 
              placeholder="Longitude" 
              value={propertyData.longitude || ''}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-center mt-4">
          <div className="bg-muted rounded-lg p-6 text-center w-full">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              GPS coordinates will be automatically populated when you select an address using the search box above.
            </p>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="description" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description">Property Description</Label>
          <Textarea 
            id="description" 
            name="description"
            placeholder="Enter a detailed description of the property" 
            value={propertyData.description || ''}
            onChange={handleChange}
            className="min-h-[200px]"
          />
        </div>
      </TabsContent>
      
      <TabsContent value="images" className="space-y-4">
        {!isNew && propertyData.id ? (
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
        ) : (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg">
            <Map className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Save Property First</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Please save the basic property information first. Once saved, you'll be able to upload and manage images for this property.
            </p>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="amenities" className="mt-4">
        {!isNew && propertyData.id ? (
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Property Amenities</h3>
            <p className="text-sm text-muted-foreground">
              Add amenities that are available at this property.
            </p>
            <PropertyAmenitiesSelect propertyId={propertyData.id} />
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
      </TabsContent>
      
      <TabsContent value="categories" className="mt-4">
        {!isNew && propertyData.id ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Property Categories</h3>
              <p className="text-sm text-muted-foreground">
                Categorize this property by assigning it to one or more categories.
              </p>
              <PropertyCategoriesSelect propertyId={propertyData.id} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Property Tags</h3>
              <p className="text-sm text-muted-foreground">
                Add tags to categorize this property.
              </p>
              <PropertyTagsSelect propertyId={propertyData.id} />
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
      </TabsContent>
    </Tabs>
  );
};

export default PropertyFormFields;
