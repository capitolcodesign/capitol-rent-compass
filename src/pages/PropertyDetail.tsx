
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConfirmActionDialog } from '@/components/admin/ConfirmActionDialog';
import { useAuth } from '@/contexts/auth';
import PropertyDetailHeader from '@/components/properties/PropertyDetailHeader';
import PropertyInformation from '@/components/properties/PropertyInformation';
import PropertySummary from '@/components/properties/PropertySummary';
import PropertyReports from '@/components/properties/PropertyReports';
import PropertyTabs from '@/components/properties/PropertyTabs';
import { ChevronLeft } from 'lucide-react';

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

interface PropertyAttribute {
  id: string;
  key: string;
  value: string;
}

interface PropertyNote {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface PropertyTag {
  id: string;
  name: string;
}

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch property details
  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      // First try to fetch by property_id which is what we use in URLs
      let { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('property_id', id)
        .single();
      
      // If not found by property_id, try by UUID id
      if (error && error.code === 'PGRST116') {
        const { data: dataById, error: errorById } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();
        
        if (errorById) {
          throw new Error(errorById.message);
        }
        
        data = dataById;
      } else if (error) {
        throw new Error(error.message);
      }
      
      return data as PropertyDetail;
    },
  });

  // Fetch property attributes
  const { data: attributes } = useQuery({
    queryKey: ['property-attributes', property?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_attributes')
        .select('*')
        .eq('property_id', property?.id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as PropertyAttribute[];
    },
    enabled: !!property?.id,
  });

  // Fetch property notes
  const { data: notes } = useQuery({
    queryKey: ['property-notes', property?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_notes')
        .select('*')
        .eq('property_id', property?.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as PropertyNote[];
    },
    enabled: !!property?.id,
  });

  // Fetch property tags
  const { data: tags } = useQuery({
    queryKey: ['property-tags', property?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_tag_relations')
        .select('property_tags(id, name)')
        .eq('property_id', property?.id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Transform the data to match the expected format
      return data?.map(item => item.property_tags) as PropertyTag[];
    },
    enabled: !!property?.id,
  });
  
  // Delete property handler
  const handleDeleteProperty = async () => {
    if (!property) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', property.id);
        
      if (error) throw error;
      
      toast({
        title: "Property Deleted",
        description: "The property has been successfully deleted.",
      });
      
      // Navigate back to properties list
      navigate('/properties');
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Delete Failed",
        description: `Failed to delete property: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
          <p className="mt-4 text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !property) {
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
  }

  return (
    <div className="p-6">
      {/* Header */}
      <PropertyDetailHeader 
        propertyName={property.name}
        onDeleteClick={() => setIsDeleteDialogOpen(true)}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {/* Property Information Card */}
          <PropertyInformation property={property} tags={tags} />

          {/* Property Tabs: Notes, Attributes, Images */}
          <PropertyTabs notes={notes} attributes={attributes} />
        </div>
        
        <div>
          {/* Property Summary Card */}
          <PropertySummary property={property} />
          
          {/* Related Reports Card */}
          <PropertyReports />
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <ConfirmActionDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteProperty}
        title="Delete Property"
        description="Are you sure you want to delete this property? This action cannot be undone and will remove all data associated with this property."
        confirmLabel="Delete Property"
        variant="destructive"
        loading={isDeleting}
      />
    </div>
  );
};

export default PropertyDetail;
