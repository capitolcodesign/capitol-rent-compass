
import React from 'react';
import { PenLine, Tag, Image } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

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
}

const PropertyTabs: React.FC<PropertyTabsProps> = ({ notes, attributes }) => {
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
              <Button size="sm">Add Note</Button>
            </div>
          </CardHeader>
          <CardContent>
            {notes && notes.length > 0 ? (
              <div className="space-y-4">
                {notes.map((note) => (
                  <div key={note.id} className="p-4 border rounded-lg">
                    <p className="whitespace-pre-wrap">{note.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Updated {new Date(note.updated_at).toLocaleDateString()}
                    </p>
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
    </Tabs>
  );
};

export default PropertyTabs;
