
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PropertyCategory {
  id: string;
  name: string;
  description: string | null;
}

export const usePropertyCategories = (propertyId: string) => {
  const { 
    data: categories, 
    isLoading,
    error,
    refetch 
  } = useQuery({
    queryKey: ['property-categories', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_category_relations')
        .select('property_categories(id, name, description)')
        .eq('property_id', propertyId);
      
      if (error) throw error;
      
      return data?.map(relation => relation.property_categories as PropertyCategory) || [];
    },
    enabled: !!propertyId,
  });

  return { categories, isLoading, error, refetch };
};
