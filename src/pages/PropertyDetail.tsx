
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import PropertyDetailHeader from '@/components/properties/PropertyDetailHeader';
import PropertyInformation from '@/components/properties/PropertyInformation';
import PropertySummary from '@/components/properties/PropertySummary';
import PropertyReports from '@/components/properties/PropertyReports';
import PropertyAmenitiesTags from '@/components/properties/PropertyAmenitiesTags';
import PropertyCategoryTags from '@/components/properties/PropertyCategoryTags';
import PropertyTabs from '@/components/properties/PropertyTabs';
import PropertyImageCarousel from '@/components/properties/PropertyImageCarousel';
import { PropertyDetailLoading, PropertyDetailError } from '@/components/properties/PropertyDetailFallbacks';
import { PropertyDetailDialogs } from '@/components/properties/PropertyDetailDialogs';
import { usePropertyDetail } from '@/hooks/usePropertyDetail';
import { usePropertyAttributes } from '@/hooks/usePropertyAttributes';
import { usePropertyNotes } from '@/hooks/usePropertyNotes';
import { usePropertyTags } from '@/hooks/usePropertyTags';
import { usePropertyCategories } from '@/components/properties/hooks/usePropertyCategories';
import { usePropertyAmenities } from '@/components/properties/hooks/usePropertyAmenities';
import { usePropertyCustomFields } from '@/hooks/usePropertyCustomFields';

export interface PropertyCustomField {
  id: string;
  field_name: string;
  field_value: string | null;
  field_type: string;
}

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFairnessDialogOpen, setIsFairnessDialogOpen] = useState(false);
  const [isGptDialogOpen, setIsGptDialogOpen] = useState(false);

  // Fetch property data using custom hooks
  const { property, isLoading, error } = usePropertyDetail(id);
  const { attributes } = usePropertyAttributes(property?.id);
  const { notes } = usePropertyNotes(property?.id);
  const { tags } = usePropertyTags(property?.id);
  const { categories } = usePropertyCategories(property?.id || '');
  const { amenities } = usePropertyAmenities(property?.id);
  const { data: customFields } = usePropertyCustomFields(property?.id);

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

  // Extract amenities names for fairness calculator
  const extractAmenityNames = () => {
    if (!amenities) return [];
    return amenities.map(amenity => amenity.name);
  };

  // Loading state
  if (isLoading) {
    return <PropertyDetailLoading />;
  }

  // Error state
  if (error || !property) {
    return <PropertyDetailError />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <PropertyDetailHeader 
        propertyName={property.name}
        onDeleteClick={() => setIsDeleteDialogOpen(true)}
        onEditClick={() => navigate(`/properties/edit/${property.property_id}`)}
        onFairnessClick={() => setIsFairnessDialogOpen(true)}
        onGptAssistantClick={() => setIsGptDialogOpen(true)}
      />
      
      {/* Property Categories */}
      <div className="mb-6">
        <PropertyCategoryTags 
          categories={categories || []} 
          className="mb-4"
        />
      </div>

      {/* Property Image Carousel */}
      <div className="mb-6">
        <PropertyImageCarousel propertyId={property.id} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {/* Property Information Card */}
          <PropertyInformation 
            property={property} 
            customFields={customFields}
          />
          
          {/* Property Amenities and Tags with Checkboxes */}
          <div className="mb-6">
            <PropertyAmenitiesTags propertyId={property.id} />
          </div>

          {/* Property Tabs: Notes, Attributes, Images */}
          <PropertyTabs notes={notes} attributes={attributes} propertyId={property.id} />
        </div>
        
        <div>
          {/* Property Summary Card */}
          <PropertySummary property={property} />
          
          {/* Related Reports Card */}
          <PropertyReports />
        </div>
      </div>
      
      {/* Dialogs */}
      <PropertyDetailDialogs 
        property={property}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        isFairnessDialogOpen={isFairnessDialogOpen}
        setIsFairnessDialogOpen={setIsFairnessDialogOpen}
        isGptDialogOpen={isGptDialogOpen}
        setIsGptDialogOpen={setIsGptDialogOpen}
        isDeleting={isDeleting}
        onDeleteProperty={handleDeleteProperty}
        extractAmenityNames={extractAmenityNames}
      />
    </div>
  );
};

export default PropertyDetail;
