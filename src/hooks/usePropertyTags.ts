
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PropertyTag {
  id: string;
  name: string;
}

export const usePropertyTags = (propertyId?: string) => {
  const { data: tags, isLoading, error } = useQuery({
    queryKey: ['property-tags', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_tag_relations')
        .select('property_tags(id, name)')
        .eq('property_id', propertyId);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Transform the data to match the expected format
      return data?.map(item => item.property_tags) as PropertyTag[];
    },
    enabled: !!propertyId,
  });

  return { tags, isLoading, error };
};
