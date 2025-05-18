
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowRight, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Property {
  id: string;
  property_id: string;
  name: string;
  address: string;
  zip: string;
  type: string;
  units: number;
  built_year: number;
  last_analysis: string | null;
}

interface PropertyCardViewProps {
  properties: Property[];
  searchTerm: string;
  propertyType: string;
  isStaffOrAdmin: boolean;
}

const PropertyCardView: React.FC<PropertyCardViewProps> = ({
  properties,
  searchTerm,
  propertyType,
  isStaffOrAdmin
}) => {
  const navigate = useNavigate();

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 mx-auto text-muted-foreground/60" />
        <h3 className="mt-4 text-lg font-medium">No properties found</h3>
        <p className="text-muted-foreground mt-1">
          {searchTerm || propertyType !== 'all' ? 
            'Try adjusting your search or filters' : 
            'Add your first property to get started'}
        </p>
        {isStaffOrAdmin && (searchTerm === '' && propertyType === 'all') && (
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/properties/new')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {properties.map((property) => (
        <Card 
          key={property.id} 
          className="hover:border-primary/50 cursor-pointer transition-colors" 
          onClick={() => navigate(`/properties/${property.property_id}`)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">{property.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{property.address}</p>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span>ID: {property.property_id}</span>
                    <span>•</span>
                    <span>ZIP: {property.zip}</span>
                    <span>•</span>
                    <span>Built: {property.built_year}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <Badge variant="outline">{property.type}</Badge>
                  <div className="text-sm mt-1">{property.units} unit{property.units > 1 ? 's' : ''}</div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PropertyCardView;
