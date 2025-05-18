
import React, { useState } from 'react';
import { Building2, MapPin, Home, Calendar, Tag, CheckSquare, Edit, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import PropertyImageCarousel from './PropertyImageCarousel';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface PropertyDetail {
  id: string;
  name: string;
  address: string;
  property_id: string;
  type: string;
  units: number;
  built_year: number;
  city?: string;
  state?: string;
  street?: string;
  zip: string;
  latitude?: number;
  longitude?: number;
  last_analysis?: string;
  created_at?: string;
}

interface PropertyTag {
  id: string;
  name: string;
}

interface PropertyInformationProps {
  property: PropertyDetail;
  tags?: PropertyTag[];
  amenities?: {
    id: string;
    name: string;
    category: string | null;
  }[];
  customFields?: {
    id: string;
    field_name: string;
    field_value: string | null;
    field_type: string;
  }[];
}

const PropertyInformation: React.FC<PropertyInformationProps> = ({ 
  property, 
  tags, 
  amenities = [],
  customFields = []
}) => {
  const [editingAmenity, setEditingAmenity] = useState<{id?: string, name: string, category: string} | null>(null);
  const [editingField, setEditingField] = useState<{id?: string, name: string, value: string, type: string} | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSaveAmenity = async () => {
    if (!editingAmenity || !editingAmenity.name) return;
    
    try {
      if (editingAmenity.id) {
        // Update existing amenity
        const { error } = await supabase
          .from('property_amenities')
          .update({
            name: editingAmenity.name,
            category: editingAmenity.category || null
          })
          .eq('id', editingAmenity.id);
          
        if (error) throw error;
        
        toast({
          title: "Amenity Updated",
          description: "The amenity has been updated successfully."
        });
      } else {
        // Add new amenity
        const { error } = await supabase
          .from('property_amenities')
          .insert({
            property_id: property.id,
            name: editingAmenity.name,
            category: editingAmenity.category || null
          });
          
        if (error) throw error;
        
        toast({
          title: "Amenity Added",
          description: "The amenity has been added successfully."
        });
      }
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['property-amenities', property.id] });
      setEditingAmenity(null);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to save amenity: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  };

  const handleSaveCustomField = async () => {
    if (!editingField || !editingField.name) return;
    
    try {
      if (editingField.id) {
        // Update existing field
        const { error } = await supabase
          .from('property_custom_fields')
          .update({
            field_name: editingField.name,
            field_value: editingField.value,
            field_type: editingField.type
          })
          .eq('id', editingField.id);
          
        if (error) throw error;
        
        toast({
          title: "Custom Field Updated",
          description: "The custom field has been updated successfully."
        });
      } else {
        // Add new field
        const { error } = await supabase
          .from('property_custom_fields')
          .insert({
            property_id: property.id,
            field_name: editingField.name,
            field_value: editingField.value,
            field_type: editingField.type
          });
          
        if (error) throw error;
        
        toast({
          title: "Custom Field Added",
          description: "The custom field has been added successfully."
        });
      }
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['property-custom-fields', property.id] });
      setEditingField(null);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to save custom field: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Property Information</CardTitle>
        <CardDescription>Basic details about the property</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="details">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="details" className="text-sm">Details</TabsTrigger>
            <TabsTrigger value="gallery" className="text-sm">Gallery</TabsTrigger>
            <TabsTrigger value="amenities" className="text-sm">Amenities</TabsTrigger>
            <TabsTrigger value="custom" className="text-sm">Custom Fields</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Property ID</p>
                  <p className="text-sm text-muted-foreground">{property.property_id}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{property.address}</p>
                  {property.city && property.state && (
                    <p className="text-sm text-muted-foreground">
                      {property.city}, {property.state} {property.zip}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Home className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Property Type</p>
                  <p className="text-sm text-muted-foreground">{property.type}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Built Year</p>
                  <p className="text-sm text-muted-foreground">{property.built_year}</p>
                </div>
              </div>

              {property.latitude && property.longitude && (
                <div className="mt-6">
                  <p className="text-sm font-medium mb-2">Location</p>
                  <div className="h-64 bg-muted rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Map placeholder: {property.latitude}, {property.longitude}</p>
                  </div>
                </div>
              )}

              {tags && tags.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag.id} variant="outline" className="flex items-center">
                        <Tag className="mr-1 h-3 w-3" />
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="gallery">
            <PropertyImageCarousel propertyId={property.id} />
          </TabsContent>
          
          <TabsContent value="amenities">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-medium">Property Amenities</h3>
              <Button size="sm" onClick={() => setEditingAmenity({ name: '', category: '' })}>
                <Plus className="h-4 w-4 mr-2" />
                Add Amenity
              </Button>
            </div>
            
            {amenities.length > 0 ? (
              <div className="space-y-6">
                {/* Group amenities by category */}
                {Object.entries(amenities.reduce<Record<string, typeof amenities>>((acc, amenity) => {
                  const category = amenity.category || 'Other';
                  if (!acc[category]) acc[category] = [];
                  acc[category].push(amenity);
                  return acc;
                }, {})).map(([category, items]) => (
                  <div key={category} className="space-y-2">
                    <h3 className="text-lg font-medium">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {items.map(amenity => (
                        <Badge 
                          key={amenity.id} 
                          variant="secondary" 
                          className="flex items-center group"
                        >
                          <CheckSquare className="mr-1 h-3 w-3" />
                          {amenity.name}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-5 w-5 p-0 ml-1 opacity-0 group-hover:opacity-100"
                            onClick={() => setEditingAmenity({
                              id: amenity.id,
                              name: amenity.name,
                              category: amenity.category || ''
                            })}
                          >
                            <Edit className="h-3 w-3" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No amenities listed for this property.</p>
            )}
          </TabsContent>
          
          <TabsContent value="custom">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-medium">Custom Fields</h3>
              <Button size="sm" onClick={() => setEditingField({ name: '', value: '', type: 'text' })}>
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>
            
            {customFields.length > 0 ? (
              <div className="space-y-4">
                {customFields.map(field => (
                  <div key={field.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <span className="text-sm font-medium">{field.field_name}</span>
                      <p className="text-sm text-muted-foreground">{field.field_value || '-'}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingField({
                        id: field.id,
                        name: field.field_name,
                        value: field.field_value || '',
                        type: field.field_type
                      })}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No custom fields added for this property.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Amenity Edit Dialog */}
      <Dialog open={!!editingAmenity} onOpenChange={(open) => !open && setEditingAmenity(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAmenity?.id ? 'Edit' : 'Add'} Amenity</DialogTitle>
            <DialogDescription>
              Enter the details for this property amenity.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="amenity-name" className="text-sm font-medium">Name</label>
              <Input
                id="amenity-name"
                value={editingAmenity?.name || ''}
                onChange={(e) => setEditingAmenity(prev => prev ? { ...prev, name: e.target.value } : null)}
                placeholder="Amenity name"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="amenity-category" className="text-sm font-medium">Category</label>
              <Input
                id="amenity-category"
                value={editingAmenity?.category || ''}
                onChange={(e) => setEditingAmenity(prev => prev ? { ...prev, category: e.target.value } : null)}
                placeholder="Category (e.g. Kitchen, Bathroom, Outdoor)"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingAmenity(null)}>Cancel</Button>
            <Button onClick={handleSaveAmenity}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Custom Field Edit Dialog */}
      <Dialog open={!!editingField} onOpenChange={(open) => !open && setEditingField(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingField?.id ? 'Edit' : 'Add'} Custom Field</DialogTitle>
            <DialogDescription>
              Enter the details for this custom field.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="field-name" className="text-sm font-medium">Field Name</label>
              <Input
                id="field-name"
                value={editingField?.name || ''}
                onChange={(e) => setEditingField(prev => prev ? { ...prev, name: e.target.value } : null)}
                placeholder="Field name"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="field-value" className="text-sm font-medium">Value</label>
              <Input
                id="field-value"
                value={editingField?.value || ''}
                onChange={(e) => setEditingField(prev => prev ? { ...prev, value: e.target.value } : null)}
                placeholder="Field value"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="field-type" className="text-sm font-medium">Type</label>
              <select
                id="field-type"
                value={editingField?.type || 'text'}
                onChange={(e) => setEditingField(prev => prev ? { ...prev, type: e.target.value } : null)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="boolean">Yes/No</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingField(null)}>Cancel</Button>
            <Button onClick={handleSaveCustomField}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PropertyInformation;
