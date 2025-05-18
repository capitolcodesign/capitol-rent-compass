
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Tag, TagsIcon, Check } from 'lucide-react';

interface PropertyAmenitiesTagsProps {
  propertyId: string;
}

interface PropertyAmenity {
  id: string;
  name: string;
  category: string | null;
}

interface PropertyTag {
  id: string;
  name: string;
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

const COMMON_TAGS = [
  'Luxury', 'Budget', 'Pet Friendly', 'Family Friendly', 'Near Schools',
  'Near Public Transit', 'Near Parks', 'Near Shopping', 'Good for Students',
  'Good for Professionals', 'Newly Renovated', 'Historic', 'Modern',
  'Quiet Area', 'Scenic View'
];

const PropertyAmenitiesTags: React.FC<PropertyAmenitiesTagsProps> = ({ propertyId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loadingAmenity, setLoadingAmenity] = useState<string | null>(null);
  const [loadingTag, setLoadingTag] = useState<string | null>(null);

  // Fetch property amenities
  const { data: amenities, isLoading: isLoadingAmenities } = useQuery({
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

  // Fetch all available property tags
  const { data: allTags, isLoading: isLoadingAllTags } = useQuery({
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

  // Toggle tag for property
  const toggleTag = async (tagName: string, isChecked: boolean) => {
    setLoadingTag(tagName);
    try {
      if (isChecked) {
        // Check if tag exists, if not create it
        let tagId;
        const matchingTag = allTags?.find(t => t.name === tagName);
        
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
        const matchingTag = allTags?.find(t => t.name === tagName);
        
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

  // Get flat list of all available amenities
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

  // Get flat list of all available tags
  const getAllTags = () => {
    // Start with common tags
    const allTagNames = [...COMMON_TAGS];
    
    // Add any existing tags from the database
    if (allTags) {
      allTags.forEach(tag => {
        if (!allTagNames.includes(tag.name)) {
          allTagNames.push(tag.name);
        }
      });
    }
    
    return allTagNames.sort();
  };

  // Check if amenity is selected
  const isAmenitySelected = (amenityName: string) => {
    return amenities?.some(amenity => amenity.name === amenityName) || false;
  };

  // Check if tag is selected
  const isTagSelected = (tagName: string) => {
    return propertyTagRelations?.some(relation => relation.name === tagName) || false;
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

  if (isLoadingAmenities || isLoadingAllTags || isLoadingPropertyTags) {
    return (
      <div className="flex justify-center p-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
      </div>
    );
  }

  const groupedAmenities = groupAmenitiesByCategory();
  const allTags = getAllTags();

  return (
    <div className="space-y-6">
      {/* Amenities Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Check className="mr-2 h-5 w-5" />
            Property Amenities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(groupedAmenities).map(([category, amenities]) => (
              <div key={category} className="space-y-2">
                <h3 className="text-sm font-medium">{category}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {amenities.map((amenity) => (
                    <div key={amenity.name} className="flex items-center space-x-2">
                      <Checkbox
                        id={`amenity-${amenity.name}`}
                        checked={isAmenitySelected(amenity.name)}
                        onCheckedChange={(isChecked) => 
                          toggleAmenity(amenity.name, amenity.category, !!isChecked)
                        }
                        disabled={loadingAmenity === amenity.name}
                      />
                      <label
                        htmlFor={`amenity-${amenity.name}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {amenity.name}
                      </label>
                      {loadingAmenity === amenity.name && (
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-r-transparent ml-2"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tags Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <TagsIcon className="mr-2 h-5 w-5" />
            Property Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tagName) => {
              const selected = isTagSelected(tagName);
              return (
                <div key={tagName} className="flex items-center">
                  <div className="relative">
                    <Checkbox
                      id={`tag-${tagName}`}
                      className="absolute opacity-0"
                      checked={selected}
                      onCheckedChange={(isChecked) => toggleTag(tagName, !!isChecked)}
                      disabled={loadingTag === tagName}
                    />
                    <label
                      htmlFor={`tag-${tagName}`}
                      className={`cursor-pointer flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full
                        ${selected 
                          ? 'bg-primary/10 text-primary border border-primary/30' 
                          : 'bg-secondary text-secondary-foreground border border-secondary hover:bg-secondary/80'}`}
                    >
                      <Tag className="h-3 w-3" />
                      {tagName}
                      {selected && <Check className="h-3 w-3 ml-1" />}
                    </label>
                  </div>
                  {loadingTag === tagName && (
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-r-transparent ml-2"></div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyAmenitiesTags;
