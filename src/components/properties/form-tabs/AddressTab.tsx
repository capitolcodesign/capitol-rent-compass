
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';
import AddressAutocomplete from '@/components/AddressAutocomplete';

interface AddressTabProps {
  propertyData: {
    address: string;
    street?: string;
    city?: string;
    state?: string;
    zip: string;
    latitude?: number | null;
    longitude?: number | null;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddressSelect: (address: any) => void;
}

const AddressTab: React.FC<AddressTabProps> = ({
  propertyData,
  handleChange,
  handleAddressSelect,
}) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default AddressTab;
