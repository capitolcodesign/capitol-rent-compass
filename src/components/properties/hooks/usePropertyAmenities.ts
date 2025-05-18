
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PropertyAmenity {
  id: string;
  name: string;
  category: string | null;
}

const COMMON_AMENITIES = [
  { name: 'Air Conditioning', category: 'Climate' },
  { name: 'Heating', category: 'Climate' },
  { name: 'Washer', category: 'Appliances' },
  { name: 'Dryer', category: 'Appliances' },
  { name: 'Dishwasher', category: 'Appliances' },
  { name: 'Refrigerator', category: 'Appliances' },
  { name: 'Stove', category: 'Appliances' },
  { name: 'Microwave', category: 'Appliances' },
  { name: 'Parking', category: 'Outdoors' },
  { name: 'Garage', category: 'Outdoors' },
  { name: 'Pool', category: 'Outdoors' },
  { name: 'Gym', category: 'Common Areas' },
  { name: 'Elevator', category: 'Building' },
  { name: 'Security System', category: 'Security' },
  { name: 'Wheelchair Accessible', category: 'Accessibility' },
];

export function usePropertyAmenities(propertyId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loadingAmenity, setLoadingAmenity] = useState<string | null>(null);
  
  // Fetch property amenities
  const { data: amenities, isLoading } = useQuery({
    queryKey: ['property-amenities', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_amenities')
        .select('*')
        .eq('property_id', propertyId);
      
      if (error) throw error;
      return data as PropertyAmenity[];
    },
  });

  // Toggle amenity for property
  const toggleAmenity = async (amenityName: string, category: string | null, isChecked: boolean) => {
    setLoadingAmenity(amenityName);
    try {
      if (isChecked) {
        // Add amenity
        const { error } = await supabase
          .from('property_amenities')
          .insert({
            property_id: propertyId,
            name: amenityName,
            category: category
          });

        if (error) throw error;
        
        toast({
          title: "Amenity added",
          description: `${amenityName} has been added to the property.`,
        });
      } else {
        // Find the amenity ID first
        const existingAmenity = amenities?.find(a => a.name === amenityName);
        
        if (existingAmenity?.id) {
          const { error } = await supabase
            .from('property_amenities')
            .delete()
            .eq('id', existingAmenity.id);
  
          if (error) throw error;
          
          toast({
            title: "Amenity removed",
            description: `${amenityName} has been removed from the property.`,
          });
        }
      }
      
      // Refresh amenities data
      queryClient.invalidateQueries({ queryKey: ['property-amenities', propertyId] });
    } catch (error) {
      console.error('Error toggling amenity:', error);
      toast({
        title: "Error",
        description: `Failed to update amenity: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setLoadingAmenity(null);
    }
  };

  // Get all available amenities (common + existing)
  const getAllAmenities = () => {
    // Start with common amenities
    const allAmenityNames = [...COMMON_AMENITIES];
    
    // Add any custom amenities from the property
    if (amenities) {
      amenities.forEach(amenity => {
        if (!allAmenityNames.some(a => a.name === amenity.name)) {
          allAmenityNames.push({
            name: amenity.name,
            category: amenity.category
          });
        }
      });
    }
    
    return allAmenityNames;
  };

  // Check if amenity is selected
  const isAmenitySelected = (amenityName: string) => {
    return amenities?.some(amenity => amenity.name === amenityName) || false;
  };

  // Group amenities by category
  const groupAmenitiesByCategory = () => {
    const allAmenities = getAllAmenities();
    return allAmenities.reduce<Record<string, {name: string, category: string | null}[]>>((acc, amenity) => {
      const category = amenity.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(amenity);
      return acc;
    }, {});
  };

  return {
    amenities,
    isLoading,
    loadingAmenity,
    toggleAmenity,
    isAmenitySelected,
    groupedAmenities: groupAmenitiesByCategory()
  };
}
