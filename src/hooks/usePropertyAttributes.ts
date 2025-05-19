
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PropertyAttribute {
  id: string;
  key: string;
  value: string;
}

export const usePropertyAttributes = (propertyId?: string) => {
  const { data: attributes, isLoading, error } = useQuery({
    queryKey: ['property-attributes', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_attributes')
        .select('*')
        .eq('property_id', propertyId);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as PropertyAttribute[];
    },
    enabled: !!propertyId,
  });

  return { attributes, isLoading, error };
};
