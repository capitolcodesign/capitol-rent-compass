
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PropertyReports: React.FC = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Related Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center py-6">No reports associated with this property.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">Create Report</Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyReports;
