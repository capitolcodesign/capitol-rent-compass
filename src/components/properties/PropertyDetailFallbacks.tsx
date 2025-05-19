
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PropertyDetailLoading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
        <p className="mt-4 text-muted-foreground">Loading property details...</p>
      </div>
    </div>
  );
};

export const PropertyDetailError: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/properties')} className="mr-2">
          <ChevronLeft size={18} />
          Back
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription>Unable to retrieve property information. The property may have been deleted or you may not have permission to view it.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>If you believe this is an error, please try refreshing the page or contact support.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => navigate('/properties')}>Return to Properties</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
