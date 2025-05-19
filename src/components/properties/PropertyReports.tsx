
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PropertyReportsProps {
  propertyId?: string;
}

const PropertyReports: React.FC<PropertyReportsProps> = ({ propertyId }) => {
  const navigate = useNavigate();

  const handleCreateReport = () => {
    // If we have a propertyId, we'll pass it to the report creation page
    if (propertyId) {
      navigate(`/reports/new?propertyId=${propertyId}`);
    } else {
      navigate('/reports/new');
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Related Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center py-6">No reports associated with this property.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={handleCreateReport}>
          Create Report
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyReports;
