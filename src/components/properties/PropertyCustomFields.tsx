
import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Save, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PropertyCustomFieldsProps {
  propertyId: string;
}

interface CustomField {
  id: string;
  field_name: string;
  field_value: string | null;
  field_type: string;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'boolean', label: 'Yes/No' },
  { value: 'url', label: 'URL' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
];

const PropertyCustomFields: React.FC<PropertyCustomFieldsProps> = ({ propertyId }) => {
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const { toast } = useToast();

  const fetchCustomFields = async () => {
    try {
      const { data, error } = await supabase
        .from('property_custom_fields')
        .select('*')
        .eq('property_id', propertyId);
      
      if (error) throw error;
      
      if (data) {
        setCustomFields(data as CustomField[]);
      }
    } catch (error) {
      console.error('Error fetching custom fields:', error);
      toast({
        title: 'Error',
        description: 'Failed to load custom fields.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomFields();
  }, [propertyId]);

  const handleAddField = async () => {
    if (!newFieldName.trim()) return;
    
    try {
      // Add to database
      const { data, error } = await supabase
        .from('property_custom_fields')
        .insert({
          property_id: propertyId,
          field_name: newFieldName.trim(),
          field_value: newFieldValue.trim() || null,
          field_type: newFieldType
        })
        .select('*')
        .single();
      
      if (error) throw error;
      
      // Update UI
      setCustomFields([...customFields, data as CustomField]);
      setNewFieldName('');
      setNewFieldValue('');
      setNewFieldType('text');
      
      toast({
        title: 'Custom field added',
        description: `"${newFieldName}" has been added to the property.`,
      });
    } catch (error) {
      console.error('Error adding custom field:', error);
      toast({
        title: 'Add failed',
        description: `Failed to add custom field: ${(error as Error).message}`,
        variant: 'destructive',
      });
    }
  };

  const handleEditField = (id: string, currentValue: string | null) => {
    setEditingField(id);
    setEditValue(currentValue || '');
  };

  const handleSaveEdit = async () => {
    if (!editingField) return;
    
    try {
      // Update in database
      const { error } = await supabase
        .from('property_custom_fields')
        .update({ field_value: editValue.trim() || null })
        .eq('id', editingField);
      
      if (error) throw error;
      
      // Update UI
      setCustomFields(customFields.map(field => 
        field.id === editingField 
          ? { ...field, field_value: editValue.trim() || null } 
          : field
      ));
      
      setEditingField(null);
      setEditValue('');
      
      toast({
        title: 'Field updated',
        description: 'The custom field has been updated.',
      });
    } catch (error) {
      console.error('Error updating custom field:', error);
      toast({
        title: 'Update failed',
        description: `Failed to update custom field: ${(error as Error).message}`,
        variant: 'destructive',
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleRemoveField = async (id: string) => {
    try {
      // Remove from database
      const { error } = await supabase
        .from('property_custom_fields')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update UI
      setCustomFields(customFields.filter(field => field.id !== id));
      
      toast({
        title: 'Field removed',
        description: 'The custom field has been removed from the property.',
      });
    } catch (error) {
      console.error('Error removing custom field:', error);
      toast({
        title: 'Remove failed',
        description: `Failed to remove custom field: ${(error as Error).message}`,
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

  const renderFieldValue = (field: CustomField) => {
    if (editingField === field.id) {
      return (
        <div className="flex items-center gap-2 mt-1">
          {field.field_type === 'boolean' ? (
            <Select value={editValue} onValueChange={setEditValue}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Input 
              type={field.field_type === 'number' ? 'number' : field.field_type === 'date' ? 'date' : 'text'} 
              value={editValue} 
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-grow"
            />
          )}
          <Button size="icon" onClick={handleSaveEdit}>
            <Save className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={handleCancelEdit}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    // For display
    if (field.field_type === 'boolean') {
      return field.field_value === 'true' ? 
        <Badge variant="outline" className="bg-green-50 text-green-700">Yes</Badge> : 
        <Badge variant="outline" className="bg-red-50 text-red-700">No</Badge>;
    }

    if (field.field_type === 'url') {
      return field.field_value ? <a href={field.field_value} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{field.field_value}</a> : '-';
    }

    if (field.field_type === 'email') {
      return field.field_value ? <a href={`mailto:${field.field_value}`} className="text-blue-500 hover:underline">{field.field_value}</a> : '-';
    }

    return field.field_value || '-';
  };

  const renderFieldTypeLabel = (type: string) => {
    const fieldType = FIELD_TYPES.find(t => t.value === type);
    return fieldType?.label || type;
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Add new custom field */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <Input
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              placeholder="Field name"
              className="col-span-1"
            />
            <Select value={newFieldType} onValueChange={setNewFieldType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Field type" />
              </SelectTrigger>
              <SelectContent>
                {FIELD_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={newFieldValue}
              onChange={(e) => setNewFieldValue(e.target.value)}
              placeholder="Field value (optional)"
              type={newFieldType === 'number' ? 'number' : newFieldType === 'date' ? 'date' : 'text'}
              className="col-span-1 md:col-span-1"
            />
            <Button 
              onClick={handleAddField} 
              disabled={!newFieldName.trim()}
              className="col-span-1"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Field
            </Button>
          </div>

          {/* Custom fields list */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Custom Fields</h4>
            {customFields.length === 0 ? (
              <p className="text-sm text-muted-foreground">No custom fields added yet.</p>
            ) : (
              <div className="space-y-2">
                {customFields.map((field) => (
                  <div key={field.id} className="border rounded-md p-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <h5 className="text-sm font-medium">{field.field_name}</h5>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {renderFieldTypeLabel(field.field_type)}
                          </Badge>
                        </div>
                        <div className="text-sm">
                          {renderFieldValue(field)}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        {editingField !== field.id && (
                          <>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => handleEditField(field.id, field.field_value)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost"
                              className="text-destructive" 
                              onClick={() => handleRemoveField(field.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCustomFields;
