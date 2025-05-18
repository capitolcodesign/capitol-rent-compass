
import React, { useState } from 'react';
import { Building2, MapPin, Home, Calendar, Tag, CheckSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import PropertyImageGallery from './PropertyImageGallery';

interface PropertyDetail {
  id: string;
  name: string;
  address: string;
  property_id: string;
  type: string;
  units: number;
  built_year: number;
  city?: string;
  state?: string;
  street?: string;
  zip: string;
  latitude?: number;
  longitude?: number;
  last_analysis?: string;
  created_at?: string;
}

interface PropertyTag {
  id: string;
  name: string;
}

interface PropertyInformationProps {
  property: PropertyDetail;
  tags?: PropertyTag[];
  amenities?: {
    id: string;
    name: string;
    category: string | null;
  }[];
  customFields?: {
    id: string;
    field_name: string;
    field_value: string | null;
    field_type: string;
  }[];
}

const PropertyInformation: React.FC<PropertyInformationProps> = ({ 
  property, 
  tags, 
  amenities,
  customFields
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Property Information</CardTitle>
        <CardDescription>Basic details about the property</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="details">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details" className="text-sm">Details</TabsTrigger>
            <TabsTrigger value="gallery" className="text-sm">Gallery</TabsTrigger>
            <TabsTrigger value="amenities" className="text-sm">Amenities</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Property ID</p>
                  <p className="text-sm text-muted-foreground">{property.property_id}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{property.address}</p>
                  {property.city && property.state && (
                    <p className="text-sm text-muted-foreground">
                      {property.city}, {property.state} {property.zip}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Home className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Property Type</p>
                  <p className="text-sm text-muted-foreground">{property.type}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Built Year</p>
                  <p className="text-sm text-muted-foreground">{property.built_year}</p>
                </div>
              </div>

              {property.latitude && property.longitude && (
                <div className="mt-6">
                  <p className="text-sm font-medium mb-2">Location</p>
                  <div className="h-64 bg-muted rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Map placeholder: {property.latitude}, {property.longitude}</p>
                  </div>
                </div>
              )}

              {tags && tags.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag.id} variant="outline" className="flex items-center">
                        <Tag className="mr-1 h-3 w-3" />
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {customFields && customFields.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium mb-2">Custom Fields</p>
                  <div className="grid gap-2">
                    {customFields.map((field) => {
                      const fieldValue = field.field_type === 'boolean' 
                        ? (field.field_value === 'true' ? 'Yes' : 'No')
                        : field.field_value || '-';
                        
                      return (
                        <div key={field.id} className="flex justify-between border-b pb-2">
                          <span className="text-sm font-medium">{field.field_name}</span>
                          <span className="text-sm text-muted-foreground">{fieldValue}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="gallery">
            <PropertyImageGallery propertyId={property.id} />
          </TabsContent>
          
          <TabsContent value="amenities">
            {amenities && amenities.length > 0 ? (
              <div className="space-y-6">
                {/* Group amenities by category */}
                {Object.entries(amenities.reduce<Record<string, typeof amenities>>((acc, amenity) => {
                  const category = amenity.category || 'Other';
                  if (!acc[category]) acc[category] = [];
                  acc[category].push(amenity);
                  return acc;
                }, {})).map(([category, items]) => (
                  <div key={category} className="space-y-2">
                    <h3 className="text-lg font-medium">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {items.map(amenity => (
                        <Badge key={amenity.id} variant="secondary" className="flex items-center">
                          <CheckSquare className="mr-1 h-3 w-3" />
                          {amenity.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No amenities listed for this property.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PropertyInformation;
