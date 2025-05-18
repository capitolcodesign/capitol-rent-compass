
import React, { useState } from 'react';
import { PenLine, Tag, Image, Plus, Edit, Save, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
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
              <Button size="sm">Add Attribute</Button>
            </div>
          </CardHeader>
          <CardContent>
            {attributes && attributes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attributes.map((attr) => (
                  <div key={attr.id} className="flex justify-between p-3 border rounded-md">
                    <span className="font-medium">{attr.key}</span>
                    <span className="text-muted-foreground">{attr.value}</span>
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
              <Button size="sm">Upload Image</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-10 border-2 border-dashed rounded-lg">
              <div className="text-center">
                <Image className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No images have been added to this property
                </p>
                <Button variant="outline" className="mt-4">Upload Images</Button>
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
