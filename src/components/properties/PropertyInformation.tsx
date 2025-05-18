
import React, { useState } from 'react';
import { Building2, MapPin, Home, Calendar, Edit, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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

interface PropertyInformationProps {
  property: PropertyDetail;
  customFields?: {
    id: string;
    field_name: string;
    field_value: string | null;
    field_type: string;
  }[];
}

const PropertyInformation: React.FC<PropertyInformationProps> = ({ 
  property,
  customFields = []
}) => {
  const [editingField, setEditingField] = useState<{id?: string, name: string, value: string, type: string} | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details" className="text-sm">Details</TabsTrigger>
            <TabsTrigger value="gallery" className="text-sm">Gallery</TabsTrigger>
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
            </div>
          </TabsContent>
          
          <TabsContent value="gallery">
            <PropertyImageCarousel propertyId={property.id} />
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
