
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PropertyDetails } from "@/types/rental-fairness";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import AddressAutocomplete from '@/components/AddressAutocomplete';

interface PropertyDetailsFormProps {
  propertyDetails: PropertyDetails;
  setPropertyDetails: React.Dispatch<React.SetStateAction<PropertyDetails>>;
}

const commonAmenities = [
  "In-unit washer/dryer",
  "Central AC",
  "Dishwasher",
  "Parking",
  "Gym",
  "Pool",
  "Elevator",
  "Balcony",
  "Pet-friendly",
  "Storage space",
];

const PropertyDetailsForm: React.FC<PropertyDetailsFormProps> = ({
  propertyDetails,
  setPropertyDetails,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPropertyDetails((prev) => ({
      ...prev,
      [name]: name === 'rent' || name === 'squareFeet' || name === 'bedrooms' || name === 'bathrooms' 
        ? Number(value)
        : value,
    }));
  };

  const handleConditionChange = (value: string) => {
    setPropertyDetails((prev) => ({
      ...prev,
      condition: value,
    }));
  };

  const handleAmenityToggle = (amenity: string, checked: boolean) => {
    setPropertyDetails((prev) => ({
      ...prev,
      amenities: checked 
        ? [...prev.amenities, amenity]
        : prev.amenities.filter(a => a !== amenity)
    }));
  };

  const handleCustomAmenityAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      e.preventDefault();
      const newAmenity = e.currentTarget.value;
      if (!propertyDetails.amenities.includes(newAmenity)) {
        setPropertyDetails((prev) => ({
          ...prev,
          amenities: [...prev.amenities, newAmenity]
        }));
        e.currentTarget.value = '';
      }
    }
  };

  const handleAddressSelect = (address: any) => {
    setPropertyDetails((prev) => ({
      ...prev,
      location: address.full,
      // You can also store these separately if needed
      locationDetails: {
        street: address.street,
        city: address.city,
        state: address.state,
        zip: address.zip,
        lat: address.lat,
        lng: address.lng
      }
    }));
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rent">Monthly Rent ($)</Label>
            <Input
              id="rent"
              name="rent"
              type="number"
              value={propertyDetails.rent}
              onChange={handleInputChange}
              placeholder="1500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="squareFeet">Square Footage</Label>
            <Input
              id="squareFeet"
              name="squareFeet"
              type="number"
              value={propertyDetails.squareFeet}
              onChange={handleInputChange}
              placeholder="800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              id="bedrooms"
              name="bedrooms"
              type="number"
              value={propertyDetails.bedrooms}
              onChange={handleInputChange}
              placeholder="2"
              min="0"
              step="1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input
              id="bathrooms"
              name="bathrooms"
              type="number"
              value={propertyDetails.bathrooms}
              onChange={handleInputChange}
              placeholder="1"
              min="0"
              step="0.5"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <AddressAutocomplete
            onAddressSelect={handleAddressSelect}
            defaultValue={propertyDetails.location}
            placeholder="Enter property address"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="condition">Property Condition</Label>
          <Select 
            value={propertyDetails.condition}
            onValueChange={handleConditionChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="New/Excellent">New/Excellent</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Fair">Fair</SelectItem>
              <SelectItem value="Poor">Poor</SelectItem>
              <SelectItem value="Needs Renovation">Needs Renovation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Amenities</Label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {commonAmenities.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox 
                  id={`amenity-${amenity}`}
                  checked={propertyDetails.amenities.includes(amenity)}
                  onCheckedChange={(checked) => handleAmenityToggle(amenity, checked === true)}
                />
                <Label htmlFor={`amenity-${amenity}`} className="text-sm font-normal">
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
          <div className="mt-2">
            <Input
              placeholder="Add custom amenity (press Enter)"
              onKeyDown={handleCustomAmenityAdd}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyDetailsForm;
