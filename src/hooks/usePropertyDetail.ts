
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PropertyDetail {
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
  rent?: number;
  square_feet?: number;
  bedrooms?: number;
  bathrooms?: number;
  condition?: string;
}

export const usePropertyDetail = (propertyId?: string) => {
  const { 
    data: property, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      if (!propertyId) throw new Error('Property ID is required');
      
      // First try to fetch by property_id which is what we use in URLs
      let { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('property_id', propertyId)
        .single();
      
      // If not found, try by UUID id
      if (error && error.code === 'PGRST116') {
        const { data: dataById, error: errorById } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
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
    enabled: !!propertyId,
  });

  return { 
    property, 
    isLoading, 
    error,
    refetch 
  };
};
