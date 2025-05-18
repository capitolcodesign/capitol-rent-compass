
import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface PropertyTagsSelectProps {
  propertyId: string;
}

interface Tag {
  id: string;
  name: string;
}

interface TagRelation {
  id: string;
  property_id: string;
  tag_id: string;
  tag?: Tag;
}

const PropertyTagsSelect: React.FC<PropertyTagsSelectProps> = ({ propertyId }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<TagRelation[]>([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTags = async () => {
    try {
      // Fetch all available tags
      const { data: allTags, error: tagsError } = await supabase
        .from('property_tags')
        .select('*')
        .order('name');
      
      if (tagsError) throw tagsError;
      
      // Fetch tags assigned to this property
      const { data: propertyTags, error: propertyTagsError } = await supabase
        .from('property_tag_relations')
        .select('*, property_tags(id, name)')
        .eq('property_id', propertyId);
      
      if (propertyTagsError) throw propertyTagsError;
      
      setTags(allTags as Tag[]);
      setSelectedTags(propertyTags as TagRelation[]);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tags.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [propertyId]);

  const handleAddNewTag = async () => {
    if (!newTag.trim()) return;
    
    try {
      // First check if tag already exists
      let tagId = '';
      const { data: existingTag } = await supabase
        .from('property_tags')
        .select('id')
        .ilike('name', newTag.trim())
        .maybeSingle();
      
      if (existingTag) {
        tagId = existingTag.id;
      } else {
        // Create new tag
        const { data: newTagData, error: newTagError } = await supabase
          .from('property_tags')
          .insert({ name: newTag.trim() })
          .select('*')
          .single();
        
        if (newTagError) throw newTagError;
        tagId = newTagData.id;
        
        // Update tags list
        setTags([...tags, newTagData as Tag]);
      }
      
      // Check if relation already exists
      const tagAlreadySelected = selectedTags.some(t => 
        t.tag_id === tagId
      );
      
      if (tagAlreadySelected) {
        toast({
          title: 'Already added',
          description: `"${newTag}" is already assigned to this property.`,
        });
        setNewTag('');
        return;
      }
      
      // Create relation
      const { data: relationData, error: relationError } = await supabase
        .from('property_tag_relations')
        .insert({
          property_id: propertyId,
          tag_id: tagId
        })
        .select('*, property_tags(id, name)')
        .single();
      
      if (relationError) throw relationError;
      
      // Update selected tags
      setSelectedTags([...selectedTags, relationData as TagRelation]);
      setNewTag('');
      
      toast({
        title: 'Tag added',
        description: `"${newTag}" has been added to the property.`,
      });
    } catch (error) {
      console.error('Error adding tag:', error);
      toast({
        title: 'Add failed',
        description: `Failed to add tag: ${(error as Error).message}`,
        variant: 'destructive',
      });
    }
  };

  const handleSelectExistingTag = async (tag: Tag) => {
    // Check if already selected
    const tagAlreadySelected = selectedTags.some(t => 
      t.tag_id === tag.id
    );
    
    if (tagAlreadySelected) {
      toast({
        title: 'Already added',
        description: `"${tag.name}" is already assigned to this property.`,
      });
      return;
    }
    
    try {
      // Create relation
      const { data, error } = await supabase
        .from('property_tag_relations')
        .insert({
          property_id: propertyId,
          tag_id: tag.id
        })
        .select('*, property_tags(id, name)')
        .single();
      
      if (error) throw error;
      
      // Update selected tags
      setSelectedTags([...selectedTags, data as TagRelation]);
      
      toast({
        title: 'Tag added',
        description: `"${tag.name}" has been added to the property.`,
      });
    } catch (error) {
      console.error('Error adding tag:', error);
      toast({
        title: 'Add failed',
        description: `Failed to add tag: ${(error as Error).message}`,
        variant: 'destructive',
      });
    }
  };

  const handleRemoveTag = async (relationId: string) => {
    try {
      // Remove from database
      const { error } = await supabase
        .from('property_tag_relations')
        .delete()
        .eq('id', relationId);
      
      if (error) throw error;
      
      // Update UI
      setSelectedTags(selectedTags.filter(t => t.id !== relationId));
      
      toast({
        title: 'Tag removed',
        description: 'The tag has been removed from the property.',
      });
    } catch (error) {
      console.error('Error removing tag:', error);
      toast({
        title: 'Remove failed',
        description: `Failed to remove tag: ${(error as Error).message}`,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
      </div>
    );
  }

  // Filter out tags that are already selected
  const availableTags = tags.filter(tag => 
    !selectedTags.some(relation => relation.tag_id === tag.id)
  );

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Add new tag */}
          <div className="flex flex-col md:flex-row gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add new tag..."
              className="flex-grow"
            />
            <Button 
              onClick={handleAddNewTag} 
              disabled={!newTag.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tag
            </Button>
          </div>

          {/* Available Tags */}
          {availableTags.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Available Tags</h4>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <Button
                    key={tag.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectExistingTag(tag)}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {tag.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Selected Tags */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Selected Tags</h4>
            {selectedTags.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tags selected yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((relation) => (
                  <Badge key={relation.id} variant="secondary" className="flex items-center gap-1">
                    {relation.property_tags?.name || ''}
                    <button 
                      onClick={() => handleRemoveTag(relation.id)}
                      className="ml-1 hover:bg-muted rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyTagsSelect;
