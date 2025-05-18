
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Check, Plus, X, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface PropertyCategory {
  id: string;
  name: string;
  description: string | null;
}

interface PropertyCategoriesSelectProps {
  propertyId: string;
}

const PropertyCategoriesSelect: React.FC<PropertyCategoriesSelectProps> = ({ propertyId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null);

  // Fetch all available categories
  const { data: allCategories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['property-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as PropertyCategory[];
    },
  });

  // Fetch categories assigned to this property
  const { data: propertyCategories, isLoading: isLoadingPropertyCategories } = useQuery({
    queryKey: ['property-category-relations', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_category_relations')
        .select('category_id, property_categories(id, name, description)')
        .eq('property_id', propertyId);
      
      if (error) throw error;
      return data?.map(relation => relation.property_categories) || [];
    },
    enabled: !!propertyId,
  });

  // Toggle category for property
  const toggleCategory = async (categoryId: string, isSelected: boolean) => {
    const category = allCategories?.find(c => c.id === categoryId);
    if (!category) return;

    setLoadingCategory(categoryId);
    try {
      if (isSelected) {
        // Add relation
        const { error } = await supabase
          .from('property_category_relations')
          .insert({
            property_id: propertyId,
            category_id: categoryId
          });
        
        if (error) throw error;
        
        toast({
          title: "Category added",
          description: `${category.name} category has been added to the property.`,
        });
      } else {
        // Remove relation
        const { error } = await supabase
          .from('property_category_relations')
          .delete()
          .match({
            property_id: propertyId,
            category_id: categoryId
          });

        if (error) throw error;
        
        toast({
          title: "Category removed",
          description: `${category.name} category has been removed from the property.`,
        });
      }
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['property-category-relations', propertyId] });
    } catch (error) {
      console.error('Error toggling category:', error);
      toast({
        title: "Error",
        description: `Failed to update category: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setLoadingCategory(null);
    }
  };

  // Create new category
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create new category
      const { data: newCategory, error: createError } = await supabase
        .from('property_categories')
        .insert({ 
          name: newCategoryName, 
          description: newCategoryDescription || null 
        })
        .select('*')
        .single();
      
      if (createError) throw createError;
      
      // Assign to property
      const { error: relationError } = await supabase
        .from('property_category_relations')
        .insert({
          property_id: propertyId,
          category_id: newCategory.id
        });
      
      if (relationError) throw relationError;
      
      toast({
        title: "Category created",
        description: `${newCategoryName} category has been created and added to the property.`,
      });
      
      // Reset form and close dialog
      setNewCategoryName('');
      setNewCategoryDescription('');
      setIsAddingCategory(false);
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['property-categories'] });
      queryClient.invalidateQueries({ queryKey: ['property-category-relations', propertyId] });
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: "Error",
        description: `Failed to create category: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  // Check if category is selected for this property
  const isCategorySelected = (categoryId: string) => {
    return propertyCategories?.some(category => category.id === categoryId) || false;
  };

  if (isLoadingCategories || isLoadingPropertyCategories) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Property Categories</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAddingCategory(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Category
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {allCategories?.map((category) => {
          const isSelected = isCategorySelected(category.id);
          const isLoading = loadingCategory === category.id;

          return (
            <Badge
              key={category.id}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer ${isSelected 
                ? "bg-primary" 
                : "hover:bg-primary/20"}`}
              onClick={() => toggleCategory(category.id, !isSelected)}
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : isSelected ? (
                <Check className="h-3 w-3 mr-1" />
              ) : null}
              {category.name}
            </Badge>
          );
        })}
      </div>

      {/* Add new category dialog */}
      <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Property Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">Category Name</label>
              <Input
                id="name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g., Luxury Home, Waterfront Property"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">Description (Optional)</label>
              <Input
                id="description"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                placeholder="Describe this category"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingCategory(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleCreateCategory}>
              <Check className="mr-2 h-4 w-4" />
              Create Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyCategoriesSelect;
