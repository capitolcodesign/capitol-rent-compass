
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Check, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PropertyImageUploadProps {
  propertyId: string;
  onImageUploaded: () => void;
}

const PropertyImageUpload: React.FC<PropertyImageUploadProps> = ({ propertyId, onImageUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    
    try {
      // First, let's check if the bucket exists and is public
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets();
      
      if (bucketsError) throw bucketsError;
      
      let bucketExists = buckets?.some(bucket => bucket.name === 'property_images');
      
      if (!bucketExists) {
        // Create the bucket if it doesn't exist
        const { error: createBucketError } = await supabase.storage.createBucket('property_images', {
          public: true
        });
        
        if (createBucketError) throw createBucketError;
      }
      
      // Generate a unique file path for the property image
      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `${propertyId}/${Date.now()}.${fileExt}`;
      
      // Upload the image to storage
      const { error: storageError } = await supabase.storage
        .from('property_images')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (storageError) throw storageError;
      
      // Get the public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from('property_images')
        .getPublicUrl(filePath);
        
      if (!urlData || !urlData.publicUrl) {
        throw new Error('Failed to get public URL for uploaded image');
      }
      
      // Save the image metadata to the database
      const { error: dbError } = await supabase
        .from('property_images')
        .insert({
          property_id: propertyId,
          storage_path: filePath,
          caption: caption || null,
          is_featured: isFeatured
        });
      
      if (dbError) throw dbError;
      
      // Reset form and notify success
      setSelectedFile(null);
      setCaption('');
      setIsFeatured(false);
      
      toast({
        title: 'Image uploaded',
        description: 'The image was successfully uploaded.',
      });
      
      // Notify parent component
      onImageUploaded();
      
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload failed',
        description: `Failed to upload image: ${(error as Error).message}`,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label 
              htmlFor="image-upload" 
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer border-muted hover:bg-muted/20 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {selectedFile ? selectedFile.name : 'Click to upload an image'}
                </p>
              </div>
              <input 
                id="image-upload" 
                type="file" 
                className="hidden" 
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>
          </div>
          
          {selectedFile && (
            <>
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium" htmlFor="caption">
                    Caption (optional)
                  </label>
                  <input 
                    id="caption"
                    type="text" 
                    className="w-full p-2 mt-1 border rounded-md"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Add a caption for this image"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="featured-image"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded-sm"
                  />
                  <label htmlFor="featured-image" className="text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    Set as featured image
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedFile(null)}
                  disabled={uploading}
                  type="button"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpload}
                  disabled={uploading}
                  type="button"
                >
                  {uploading ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyImageUpload;
