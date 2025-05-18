
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface PropertyDetail {
  id: string;
  name: string;
  property_id: string;
  units: number;
  built_year: number;
  last_analysis?: string;
  created_at?: string;
}

interface PropertySummaryProps {
  property: PropertyDetail;
}

const PropertySummary: React.FC<PropertySummaryProps> = ({ property }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-4">
          <div className="flex justify-between">
            <dt className="font-medium">Units:</dt>
            <dd>{property.units}</dd>
          </div>
          <Separator />
          <div className="flex justify-between">
            <dt className="font-medium">Building Age:</dt>
            <dd>{new Date().getFullYear() - property.built_year} years</dd>
          </div>
          <Separator />
          <div className="flex justify-between">
            <dt className="font-medium">Last Analysis:</dt>
            <dd>{property.last_analysis ? new Date(property.last_analysis).toLocaleDateString() : 'Never'}</dd>
          </div>
          <Separator />
          <div className="flex justify-between">
            <dt className="font-medium">Added:</dt>
            <dd>{property.created_at ? new Date(property.created_at).toLocaleDateString() : 'Unknown'}</dd>
          </div>
        </dl>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Run Analysis</Button>
      </CardFooter>
    </Card>
  );
};

export default PropertySummary;
