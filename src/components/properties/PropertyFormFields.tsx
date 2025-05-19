
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BasicInfoTab from './form-tabs/BasicInfoTab';
import AddressTab from './form-tabs/AddressTab';
import DescriptionTab from './form-tabs/DescriptionTab';
import ImagesTab from './form-tabs/ImagesTab';
import AmenitiesTab from './form-tabs/AmenitiesTab';
import CategoriesTab from './form-tabs/CategoriesTab';

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
  latitude?: number | null;
  longitude?: number | null;
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
      
      <TabsContent value="basic">
        <BasicInfoTab 
          propertyData={propertyData} 
          handleChange={handleChange}
          handleTypeChange={handleTypeChange}
        />
      </TabsContent>
      
      <TabsContent value="address">
        <AddressTab
          propertyData={propertyData}
          handleChange={handleChange}
          handleAddressSelect={handleAddressSelect}
        />
      </TabsContent>
      
      <TabsContent value="description">
        <DescriptionTab 
          description={propertyData.description || ''}
          handleChange={handleChange}
        />
      </TabsContent>
      
      <TabsContent value="images">
        <ImagesTab 
          propertyId={propertyData.id} 
          isNew={isNew} 
        />
      </TabsContent>
      
      <TabsContent value="amenities">
        <AmenitiesTab 
          propertyId={propertyData.id} 
          isNew={isNew} 
        />
      </TabsContent>
      
      <TabsContent value="categories">
        <CategoriesTab 
          propertyId={propertyData.id} 
          isNew={isNew} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default PropertyFormFields;
