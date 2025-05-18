
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Image, ImageOff } from 'lucide-react';

interface PropertyImageCarouselProps {
  propertyId: string;
}

const PropertyImageCarousel: React.FC<PropertyImageCarouselProps> = ({ propertyId }) => {
  const { data: images, isLoading } = useQuery({
    queryKey: ['property-images', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_images')
        .select('*')
        .eq('property_id', propertyId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!propertyId
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48 bg-muted rounded-md">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-48 bg-muted rounded-md text-muted-foreground">
        <ImageOff className="h-12 w-12 mb-2" />
        <p>No images available</p>
      </div>
    );
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {images.map((image) => (
          <CarouselItem key={image.id}>
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-0 relative overflow-hidden">
                <div className="w-full h-full relative">
                  <img 
                    src={image.storage_path.startsWith('http') 
                      ? image.storage_path 
                      : `${supabase.storage.from('property-images').getPublicUrl(image.storage_path).data.publicUrl}`} 
                    alt={image.caption || 'Property image'} 
                    className="w-full h-full object-cover rounded-md"
                  />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                      {image.caption}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
};

export default PropertyImageCarousel;
