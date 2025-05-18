
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Trash2 } from 'lucide-react';
import { ConfirmActionDialog } from '@/components/admin/ConfirmActionDialog';

interface Property {
  id: string;
  name: string;
  address: string;
  type: string;
  units: number;
}

interface PropertySettingsProps {
  properties: Property[] | undefined;
  isLoading: boolean;
  refetchProperties: () => void;
}

export const PropertySettings: React.FC<PropertySettingsProps> = ({
  properties,
  isLoading,
  refetchProperties
}) => {
  const { toast } = useToast();
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isDeletePropertyDialogOpen, setIsDeletePropertyDialogOpen] = useState(false);
  const [isDeletingProperty, setIsDeletingProperty] = useState(false);

  const handleDeleteProperty = async () => {
    if (!selectedPropertyId) return;
    
    setIsDeletingProperty(true);
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', selectedPropertyId);
        
      if (error) throw error;
      
      toast({
        title: "Property Deleted",
        description: "The property has been successfully deleted.",
      });
      
      refetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Delete Failed",
        description: `Failed to delete property: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsDeletingProperty(false);
      setIsDeletePropertyDialogOpen(false);
      setSelectedPropertyId(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="mr-2 h-5 w-5" />
            Property Management
          </CardTitle>
          <CardDescription>
            Manage property listings in the database
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-6">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {properties && properties.length > 0 ? (
                properties.map(property => (
                  <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{property.name}</h3>
                      <p className="text-sm text-muted-foreground">{property.address}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs bg-muted px-2 py-1 rounded-md">{property.type}</span>
                        <span className="text-xs bg-muted px-2 py-1 rounded-md">{property.units} units</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setSelectedPropertyId(property.id);
                          setIsDeletePropertyDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only md:not-sr-only md:ml-2">Delete</span>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-6">
                  No properties found.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <ConfirmActionDialog
        open={isDeletePropertyDialogOpen}
        onClose={() => setIsDeletePropertyDialogOpen(false)}
        onConfirm={handleDeleteProperty}
        title="Delete Property"
        description="Are you sure you want to delete this property? This action cannot be undone and will remove all data associated with this property."
        confirmLabel="Delete Property"
        variant="destructive"
        loading={isDeletingProperty}
      />
    </>
  );
};
