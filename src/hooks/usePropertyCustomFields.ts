
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PropertyCustomField {
  id: string;
  field_name: string;
  field_value: string | null;
  field_type: string;
}

export const usePropertyCustomFields = (propertyId?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['property-custom-fields', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_custom_fields')
        .select('*')
        .eq('property_id', propertyId)
        .order('field_name', { ascending: true });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as PropertyCustomField[];
    },
    enabled: !!propertyId,
  });

  return { data, isLoading, error };
};
