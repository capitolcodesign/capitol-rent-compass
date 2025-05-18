
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PropertyTag {
  id: string;
  name: string;
}

const COMMON_TAGS = [
  'Luxury', 'Budget', 'Pet Friendly', 'Family Friendly', 'Near Schools',
  'Near Public Transit', 'Near Parks', 'Near Shopping', 'Good for Students',
  'Good for Professionals', 'Newly Renovated', 'Historic', 'Modern',
  'Quiet Area', 'Scenic View'
];

export function usePropertyTags(propertyId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loadingTag, setLoadingTag] = useState<string | null>(null);

  // Fetch all available property tags
  const { data: availableTags, isLoading: isLoadingAllTags } = useQuery({
    queryKey: ['property-tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_tags')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as PropertyTag[];
    },
  });

  // Fetch property tags (the ones assigned to this property)
  const { data: propertyTagRelations, isLoading: isLoadingPropertyTags } = useQuery({
    queryKey: ['property-tag-relations', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_tag_relations')
        .select('property_tags(id, name)')
        .eq('property_id', propertyId);
      
      if (error) throw error;
      return data?.map(relation => relation.property_tags) || [];
    },
  });

  // Toggle tag for property
  const toggleTag = async (tagName: string, isChecked: boolean) => {
    setLoadingTag(tagName);
    try {
      if (isChecked) {
        // Check if tag exists, if not create it
        let tagId;
        const matchingTag = availableTags?.find(t => t.name === tagName);
        
        if (!matchingTag) {
          const { data: newTag, error: createError } = await supabase
            .from('property_tags')
            .insert({ name: tagName })
            .select('id')
            .single();
          
          if (createError) throw createError;
          tagId = newTag.id;
        } else {
          tagId = matchingTag.id;
        }
        
        // Create relation between property and tag
        const { error: relationError } = await supabase
          .from('property_tag_relations')
          .insert({
            property_id: propertyId,
            tag_id: tagId
          });
        
        if (relationError) throw relationError;
        
        toast({
          title: "Tag added",
          description: `${tagName} tag has been added to the property.`,
        });
      } else {
        // Find the tag ID
        const matchingTag = availableTags?.find(t => t.name === tagName);
        
        if (matchingTag?.id) {
          const { error } = await supabase
            .from('property_tag_relations')
            .delete()
            .match({
              property_id: propertyId,
              tag_id: matchingTag.id
            });
  
          if (error) throw error;
          
          toast({
            title: "Tag removed",
            description: `${tagName} tag has been removed from the property.`,
          });
        }
      }
      
      // Refresh tags data
      queryClient.invalidateQueries({ queryKey: ['property-tag-relations', propertyId] });
    } catch (error) {
      console.error('Error toggling tag:', error);
      toast({
        title: "Error",
        description: `Failed to update tag: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setLoadingTag(null);
    }
  };

  // Get flat list of all available tags
  const getAllTagNames = () => {
    // Start with common tags
    const tagNames = [...COMMON_TAGS];
    
    // Add any existing tags from the database
    if (availableTags) {
      availableTags.forEach(tag => {
        if (!tagNames.includes(tag.name)) {
          tagNames.push(tag.name);
        }
      });
    }
    
    return tagNames.sort();
  };

  // Check if tag is selected
  const isTagSelected = (tagName: string) => {
    return propertyTagRelations?.some(relation => relation.name === tagName) || false;
  };

  return {
    isLoading: isLoadingAllTags || isLoadingPropertyTags,
    loadingTag,
    toggleTag,
    isTagSelected,
    tagNames: getAllTagNames()
  };
}
