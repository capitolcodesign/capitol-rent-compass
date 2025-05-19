
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Star, StarOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Lightbox } from '@/components/ui/lightbox';

interface PropertyImage {
  id: string;
  storage_path: string;
  caption: string | null;
  is_featured: boolean;
}

interface PropertyImageGalleryProps {
  propertyId: string;
  editable?: boolean;
}

const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = ({ propertyId, editable = false }) => {
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_images')
        .select('*')
        .eq('property_id', propertyId)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setImages(data as PropertyImage[]);
      }
    } catch (error) {
      console.error('Error fetching property images:', error);
      toast({
        title: 'Error',
        description: 'Failed to load property images.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [propertyId]);

  const handleDeleteImage = async (id: string, storagePath: string) => {
    try {
      // Delete from the database first
      const { error: dbError } = await supabase
        .from('property_images')
        .delete()
        .eq('id', id);
      
      if (dbError) throw dbError;
      
      // Then delete from storage
      const { error: storageError } = await supabase.storage
        .from('property_images')
        .remove([storagePath]);
      
      if (storageError) throw storageError;
      
      // Update the UI
      setImages(images.filter(img => img.id !== id));
      
      toast({
        title: 'Image deleted',
        description: 'The image was successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: 'Delete failed',
        description: `Failed to delete image: ${(error as Error).message}`,
        variant: 'destructive',
      });
    }
  };

  const handleToggleFeatured = async (id: string, currentValue: boolean) => {
    try {
      // If setting this image as featured, unset all other images first
      if (!currentValue) {
        await supabase
          .from('property_images')
          .update({ is_featured: false })
          .eq('property_id', propertyId);
      }
      
      // Update this image's featured status
      const { error } = await supabase
        .from('property_images')
        .update({ is_featured: !currentValue })
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh the images
      fetchImages();
      
      toast({
        title: !currentValue ? 'Featured image set' : 'Featured image removed',
        description: !currentValue 
          ? 'This image is now the featured image for the property.' 
          : 'This image is no longer the featured image.',
      });
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast({
        title: 'Update failed',
        description: `Failed to update featured status: ${(error as Error).message}`,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <p>No images available for this property.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => {
        const imageUrl = supabase.storage.from('property_images').getPublicUrl(image.storage_path).data.publicUrl;
        
        return (
          <Card key={image.id} className="overflow-hidden">
            <div className="relative">
              <div className="aspect-video flex items-center justify-center">
                <Lightbox
                  src={imageUrl}
                  alt={image.caption || 'Property image'}
                  width={512}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              {image.is_featured && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </div>
              )}
              {editable && (
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDeleteImage(image.id, image.storage_path)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={image.is_featured ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8 bg-yellow-500 hover:bg-yellow-600"
                    onClick={() => handleToggleFeatured(image.id, image.is_featured)}
                  >
                    {image.is_featured ? (
                      <StarOff className="h-4 w-4" />
                    ) : (
                      <Star className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}
            </div>
            {image.caption && (
              <CardContent className="p-2">
                <p className="text-sm">{image.caption}</p>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default PropertyImageGallery;
