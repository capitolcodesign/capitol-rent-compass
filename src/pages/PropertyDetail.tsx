
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Building2, MapPin, Calendar, Home, PenLine, Trash2, Tag, Image } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

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

interface PropertyTag {
  id: string;
  name: string;
}

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as PropertyDetail;
    },
  });

  const { data: attributes } = useQuery({
    queryKey: ['property-attributes', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_attributes')
        .select('*')
        .eq('property_id', id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as PropertyAttribute[];
    },
    enabled: !!id,
  });

  const { data: notes } = useQuery({
    queryKey: ['property-notes', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_notes')
        .select('*')
        .eq('property_id', id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as PropertyNote[];
    },
    enabled: !!id,
  });

  const { data: tags } = useQuery({
    queryKey: ['property-tags', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_tag_relations')
        .select('property_tags(id, name)')
        .eq('property_id', id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data?.map(item => item.property_tags) as PropertyTag[];
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
          <p className="mt-4 text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate('/properties')} className="mr-2">
            <ChevronLeft size={18} />
            Back
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>Failed to load property details</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Unable to retrieve property information. The property may have been deleted or you may not have permission to view it.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/properties')}>Return to Properties</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate('/properties')} className="mr-2">
            <ChevronLeft size={18} />
            Back
          </Button>
          <h1 className="text-2xl font-bold">{property.name}</h1>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button variant="outline">
            <PenLine className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Property Information</CardTitle>
              <CardDescription>Basic details about the property</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

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
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Property Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="flex justify-between">
                  <dt className="font-medium">Units:</dt>
                  <dd>{property.units}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="font-medium">Building Age:</dt>
                  <dd>{new Date().getFullYear() - property.built_year} years</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="font-medium">Last Analysis:</dt>
                  <dd>{property.last_analysis ? new Date(property.last_analysis).toLocaleDateString() : 'Never'}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="font-medium">Added:</dt>
                  <dd>{property.created_at ? new Date(property.created_at).toLocaleDateString() : 'Unknown'}</dd>
                </div>
              </dl>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Run Analysis</Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Related Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-6">No reports associated with this property.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Create Report</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
