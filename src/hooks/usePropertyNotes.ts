
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PropertyNote {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const usePropertyNotes = (propertyId?: string) => {
  const { data: notes, isLoading, error } = useQuery({
    queryKey: ['property-notes', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_notes')
        .select('*')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as PropertyNote[];
    },
    enabled: !!propertyId,
  });

  return { notes, isLoading, error };
};
