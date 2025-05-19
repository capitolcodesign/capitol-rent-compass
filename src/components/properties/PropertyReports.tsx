
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PropertyReportsProps {
  propertyId?: string;
}

const PropertyReports: React.FC<PropertyReportsProps> = ({ propertyId }) => {
  const navigate = useNavigate();

  // Query to fetch reports associated with this property
  const { data: reports, isLoading, error } = useQuery({
    queryKey: ['property-reports', propertyId],
    queryFn: async () => {
      if (!propertyId) return [];
      
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('data->property_id', propertyId);
      
      if (error) {
        console.error("Error fetching property reports:", error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!propertyId,
  });

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
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
          </div>
        ) : error ? (
          <p className="text-muted-foreground text-center py-6">Error loading reports. Please try again later.</p>
        ) : reports && reports.length > 0 ? (
          <div className="space-y-2">
            {reports.map((report) => (
              <div 
                key={report.id} 
                className="p-3 border rounded-md cursor-pointer hover:bg-muted/50 flex justify-between items-center"
                onClick={() => navigate(`/reports/${report.id}`)}
              >
                <div>
                  <p className="font-medium">{report.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(report.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-xs bg-muted px-2 py-1 rounded-full uppercase">
                    {report.status || 'Draft'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-6">No reports associated with this property.</p>
        )}
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
