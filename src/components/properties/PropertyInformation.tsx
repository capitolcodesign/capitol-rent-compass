
import React from 'react';
import { Building2, MapPin, Home, Calendar, Tag } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
}

const PropertyInformation: React.FC<PropertyInformationProps> = ({ property, tags }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Information</CardTitle>
        <CardDescription>Basic details about the property</CardDescription>
      </CardHeader>
      <CardContent>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyInformation;
