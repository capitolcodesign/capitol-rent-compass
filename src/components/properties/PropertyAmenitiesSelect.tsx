
import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface PropertyAmenitiesSelectProps {
  propertyId: string;
}

interface Amenity {
  id: string;
  name: string;
  category: string | null;
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

const PropertyAmenitiesSelect: React.FC<PropertyAmenitiesSelectProps> = ({ propertyId }) => {
  const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>([]);
  const [newAmenity, setNewAmenity] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAmenities = async () => {
    try {
      const { data, error } = await supabase
        .from('property_amenities')
        .select('*')
        .eq('property_id', propertyId);
      
      if (error) throw error;
      
      if (data) {
        setSelectedAmenities(data as Amenity[]);
      }
    } catch (error) {
      console.error('Error fetching property amenities:', error);
      toast({
        title: 'Error',
        description: 'Failed to load property amenities.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, [propertyId]);

  const handleAddAmenity = async () => {
    if (!newAmenity.trim()) return;
    
    try {
      // Add to database
      const { data, error } = await supabase
        .from('property_amenities')
        .insert({
          property_id: propertyId,
          name: newAmenity.trim(),
          category: newCategory.trim() || null
        })
        .select('*')
        .single();
      
      if (error) throw error;
      
      // Update UI
      setSelectedAmenities([...selectedAmenities, data as Amenity]);
      setNewAmenity('');
      setNewCategory('');
      
      toast({
        title: 'Amenity added',
        description: `"${newAmenity}" has been added to the property.`,
      });
    } catch (error) {
      console.error('Error adding amenity:', error);
      toast({
        title: 'Add failed',
        description: `Failed to add amenity: ${(error as Error).message}`,
        variant: 'destructive',
      });
    }
  };

  const handleAddCommonAmenity = async (name: string, category: string | null) => {
    // Check if already selected
    if (selectedAmenities.some(a => a.name.toLowerCase() === name.toLowerCase())) {
      toast({
        title: 'Already added',
        description: `"${name}" is already in the list.`,
      });
      return;
    }
    
    try {
      // Add to database
      const { data, error } = await supabase
        .from('property_amenities')
        .insert({
          property_id: propertyId,
          name,
          category
        })
        .select('*')
        .single();
      
      if (error) throw error;
      
      // Update UI
      setSelectedAmenities([...selectedAmenities, data as Amenity]);
      
      toast({
        title: 'Amenity added',
        description: `"${name}" has been added to the property.`,
      });
    } catch (error) {
      console.error('Error adding amenity:', error);
      toast({
        title: 'Add failed',
        description: `Failed to add amenity: ${(error as Error).message}`,
        variant: 'destructive',
      });
    }
  };

  const handleRemoveAmenity = async (id: string) => {
    try {
      // Remove from database
      const { error } = await supabase
        .from('property_amenities')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update UI
      setSelectedAmenities(selectedAmenities.filter(a => a.id !== id));
      
      toast({
        title: 'Amenity removed',
        description: 'The amenity has been removed from the property.',
      });
    } catch (error) {
      console.error('Error removing amenity:', error);
      toast({
        title: 'Remove failed',
        description: `Failed to remove amenity: ${(error as Error).message}`,
        variant: 'destructive',
      });
    }
  };

  // Group amenities by category
  const groupedAmenities = selectedAmenities.reduce<Record<string, Amenity[]>>((acc, amenity) => {
    const category = amenity.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(amenity);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Custom Amenity Input */}
          <div className="flex flex-col md:flex-row gap-2">
            <Input
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              placeholder="Add new amenity..."
              className="flex-grow"
            />
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category (optional)"
              className="md:w-1/3"
            />
            <Button 
              onClick={handleAddAmenity} 
              disabled={!newAmenity.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {/* Common Amenities */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Common Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {COMMON_AMENITIES.map((amenity) => (
                <Button
                  key={amenity.name}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddCommonAmenity(amenity.name, amenity.category)}
                  className={`text-xs ${
                    selectedAmenities.some(a => a.name.toLowerCase() === amenity.name.toLowerCase())
                      ? 'bg-primary/10 opacity-50'
                      : ''
                  }`}
                  disabled={selectedAmenities.some(a => a.name.toLowerCase() === amenity.name.toLowerCase())}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {amenity.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Selected Amenities */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Selected Amenities</h4>
            {Object.keys(groupedAmenities).length === 0 ? (
              <p className="text-sm text-muted-foreground">No amenities selected yet.</p>
            ) : (
              Object.entries(groupedAmenities).map(([category, amenities]) => (
                <div key={category} className="space-y-2">
                  <h5 className="text-xs font-medium text-muted-foreground">{category}</h5>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((amenity) => (
                      <Badge key={amenity.id} variant="secondary" className="flex items-center gap-1">
                        {amenity.name}
                        <button 
                          onClick={() => handleRemoveAmenity(amenity.id)}
                          className="ml-1 hover:bg-muted rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyAmenitiesSelect;
