
import React, { useState } from 'react';
import { PenLine, Tag, Image, Plus, Edit, Save, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

interface PropertyAttribute {
  id: string;
  key: string;
  value: string;
}

interface PropertyNote {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface PropertyTabsProps {
  notes?: PropertyNote[];
  attributes?: PropertyAttribute[];
  propertyId: string;
}

const PropertyTabs: React.FC<PropertyTabsProps> = ({ notes = [], attributes = [], propertyId }) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState<PropertyNote | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isAddingAttribute, setIsAddingAttribute] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<PropertyAttribute | null>(null);
  const [attributeKey, setAttributeKey] = useState('');
  const [attributeValue, setAttributeValue] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSaveNote = async () => {
    if (!noteContent.trim()) {
      toast({
        title: "Error",
        description: "Note content cannot be empty.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingNote) {
        // Update existing note
        const { error } = await supabase
          .from('property_notes')
          .update({
            content: noteContent,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingNote.id);

        if (error) throw error;

        toast({
          title: "Note Updated",
          description: "The note has been updated successfully."
        });
      } else {
        // Add new note
        const { error } = await supabase
          .from('property_notes')
          .insert({
            property_id: propertyId,
            content: noteContent
          });

        if (error) throw error;

        toast({
          title: "Note Added",
          description: "The note has been added successfully."
        });
      }

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['property-notes', propertyId] });
      setIsAddingNote(false);
      setEditingNote(null);
      setNoteContent('');
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to save note: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  };

  const handleDeleteNote = async () => {
    if (!isDeleting) return;

    try {
      const { error } = await supabase
        .from('property_notes')
        .delete()
        .eq('id', isDeleting);

      if (error) throw error;

      toast({
        title: "Note Deleted",
        description: "The note has been deleted successfully."
      });

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['property-notes', propertyId] });
      setIsDeleting(null);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete note: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  };

  const handleEditNote = (note: PropertyNote) => {
    setEditingNote(note);
    setNoteContent(note.content);
    setIsAddingNote(true);
  };

  const handleSaveAttribute = async () => {
    if (!attributeKey.trim() || !attributeValue.trim()) {
      toast({
        title: "Error",
        description: "Both key and value are required.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingAttribute) {
        // Update existing attribute
        const { error } = await supabase
          .from('property_attributes')
          .update({
            key: attributeKey,
            value: attributeValue
          })
          .eq('id', editingAttribute.id);

        if (error) throw error;

        toast({
          title: "Attribute Updated",
          description: "The attribute has been updated successfully."
        });
      } else {
        // Add new attribute
        const { error } = await supabase
          .from('property_attributes')
          .insert({
            property_id: propertyId,
            key: attributeKey,
            value: attributeValue
          });

        if (error) throw error;

        toast({
          title: "Attribute Added",
          description: "The attribute has been added successfully."
        });
      }

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['property-attributes', propertyId] });
      setIsAddingAttribute(false);
      setEditingAttribute(null);
      setAttributeKey('');
      setAttributeValue('');
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to save attribute: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  };

  const handleEditAttribute = (attr: PropertyAttribute) => {
    setEditingAttribute(attr);
    setAttributeKey(attr.key);
    setAttributeValue(attr.value);
    setIsAddingAttribute(true);
  };

  const handleDeleteAttribute = async (id: string) => {
    try {
      const { error } = await supabase
        .from('property_attributes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Attribute Deleted",
        description: "The attribute has been deleted successfully."
      });

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['property-attributes', propertyId] });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete attribute: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      // Create storage bucket if it doesn't exist
      const { error: bucketError } = await supabase.storage.createBucket('property-images', {
        public: true
      });

      if (bucketError && bucketError.message !== 'Bucket already exists') {
        throw bucketError;
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${propertyId}/${Date.now()}.${fileExt}`;
        const filePath = fileName;

        // Upload file to storage
        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);

        // Add record to property_images table
        const { error: dbError } = await supabase
          .from('property_images')
          .insert({
            property_id: propertyId,
            storage_path: filePath,
            display_order: i,
            caption: file.name
          });

        if (dbError) throw dbError;
      }

      toast({
        title: "Upload Successful",
        description: `${files.length} image(s) uploaded successfully.`
      });

      // Refresh images
      queryClient.invalidateQueries({ queryKey: ['property-images', propertyId] });
    } catch (error) {
      toast({
        title: "Upload Error",
        description: `Failed to upload images: ${(error as Error).message}`,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Tabs defaultValue="notes" className="mt-6">
      <TabsList>
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="attributes">Attributes</TabsTrigger>
        <TabsTrigger value="images">Images</TabsTrigger>
      </TabsList>
      
      <TabsContent value="notes" className="mt-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Property Notes</CardTitle>
              <Button size="sm" onClick={() => {
                setIsAddingNote(true);
                setEditingNote(null);
                setNoteContent('');
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {notes.length > 0 ? (
              <div className="space-y-4">
                {notes.map((note) => (
                  <div key={note.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-xs text-muted-foreground">
                        Updated {format(new Date(note.updated_at), 'MMM d, yyyy h:mm a')}
                      </p>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditNote(note)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setIsDeleting(note.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                    <p className="whitespace-pre-wrap">{note.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-6">No notes have been added to this property.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="attributes" className="mt-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Property Attributes</CardTitle>
              <Button size="sm" onClick={() => {
                setIsAddingAttribute(true);
                setEditingAttribute(null);
                setAttributeKey('');
                setAttributeValue('');
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Attribute
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {attributes && attributes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attributes.map((attr) => (
                  <div key={attr.id} className="flex justify-between p-3 border rounded-md">
                    <div>
                      <span className="font-medium">{attr.key}</span>
                      <span className="text-muted-foreground ml-2">{attr.value}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditAttribute(attr)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteAttribute(attr.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-6">No attributes have been added to this property.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="images" className="mt-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Property Images</CardTitle>
              <div className="relative">
                <Button size="sm">
                  {isUploading ? 
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2" /> :
                    <Plus className="mr-2 h-4 w-4" />
                  }
                  Upload Image
                </Button>
                <input 
                  id="image-upload" 
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-10 border-2 border-dashed rounded-lg">
              <div className="text-center">
                <Image className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {isUploading ? 
                    "Uploading images..." :
                    "Drag and drop images or click to upload"
                  }
                </p>
                <div className="mt-4 relative">
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    disabled={isUploading}
                  >
                    Upload Images
                  </Button>
                  <input 
                    id="image-upload-2" 
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Add/Edit Note Dialog */}
      <Dialog open={isAddingNote} onOpenChange={(open) => !open && setIsAddingNote(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingNote ? 'Edit' : 'Add'} Note</DialogTitle>
            <DialogDescription>
              {editingNote ? 'Update the note details.' : 'Add a note to this property.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Enter note content..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingNote(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNote}>
              <Save className="mr-2 h-4 w-4" />
              {editingNote ? 'Update' : 'Save'} Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Attribute Dialog */}
      <Dialog open={isAddingAttribute} onOpenChange={(open) => !open && setIsAddingAttribute(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAttribute ? 'Edit' : 'Add'} Attribute</DialogTitle>
            <DialogDescription>
              {editingAttribute ? 'Update the attribute details.' : 'Add an attribute to this property.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="key" className="text-sm font-medium">Key</label>
              <Input
                id="key"
                value={attributeKey}
                onChange={(e) => setAttributeKey(e.target.value)}
                placeholder="e.g., Construction Type, Roof Material"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="value" className="text-sm font-medium">Value</label>
              <Input
                id="value"
                value={attributeValue}
                onChange={(e) => setAttributeValue(e.target.value)}
                placeholder="e.g., Wood Frame, Shingle"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingAttribute(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAttribute}>
              <Save className="mr-2 h-4 w-4" />
              {editingAttribute ? 'Update' : 'Save'} Attribute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!isDeleting} onOpenChange={(open) => !open && setIsDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleting(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteNote}>
              Delete Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
};

export default PropertyTabs;
