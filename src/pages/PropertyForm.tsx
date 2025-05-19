import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Building2, ArrowLeft, CheckCircle, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import PropertyFormFields from '@/components/properties/PropertyFormFields';

const PropertyForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [propertyData, setPropertyData] = useState({
    id: '',
    property_id: '',
    name: '',
    address: '',
    type: 'Multi-family',
    units: 1,
    built_year: new Date().getFullYear() - 10,
    zip: '',
    street: '',
    city: '',
    state: '',
    latitude: null as number | null,
    longitude: null as number | null,
    description: '' // Explicitly include description field in the state
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);
  
  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!id) return;
      
      try {
        // First try to fetch by property_id (slug)
        let { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('property_id', id)
          .single();
        
        // If not found, try by UUID id
        if (error && error.code === 'PGRST116') {
          const { data: dataById, error: errorById } = await supabase
            .from('properties')
            .select('*')
            .eq('id', id)
            .single();
            
          if (errorById) throw errorById;
          data = dataById;
        } else if (error) {
          throw error;
        }
        
        if (data) {
          setPropertyData({
            id: data.id,
            property_id: data.property_id,
            name: data.name,
            address: data.address || '',
            type: data.type,
            units: data.units,
            built_year: data.built_year,
            zip: data.zip || '',
            street: data.street || '',
            city: data.city || '',
            state: data.state || '',
            latitude: data.latitude || null,
            longitude: data.longitude || null,
            description: data.description || '' // Properly handle description from database
          });
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        toast({
          title: 'Error',
          description: `Failed to load property: ${(error as Error).message}`,
          variant: 'destructive',
        });
        navigate('/properties');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPropertyData();
  }, [id, navigate, toast]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric fields
    if (name === 'units' || name === 'built_year') {
      setPropertyData(prev => ({
        ...prev,
        [name]: parseInt(value, 10) || 0
      }));
    } 
    // Handle latitude and longitude
    else if (name === 'latitude' || name === 'longitude') {
      setPropertyData(prev => ({
        ...prev,
        [name]: value === '' ? null : parseFloat(value)
      }));
    }
    // All other fields
    else {
      setPropertyData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleTypeChange = (value: string) => {
    setPropertyData(prev => ({
      ...prev,
      type: value
    }));
  };
  
  const updateCoordinates = (lat: number, lng: number) => {
    setPropertyData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  };
  
  const updateAddress = (addressComponents: {street?: string, city?: string, state?: string, zip?: string}) => {
    setPropertyData(prev => ({
      ...prev,
      street: addressComponents.street || prev.street,
      city: addressComponents.city || prev.city,
      state: addressComponents.state || prev.state,
      zip: addressComponents.zip || prev.zip
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!propertyData.name || !propertyData.address || !propertyData.zip) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (id) {
        // Update existing property
        const { error } = await supabase
          .from('properties')
          .update({
            name: propertyData.name,
            address: propertyData.address,
            type: propertyData.type,
            units: propertyData.units,
            built_year: propertyData.built_year,
            zip: propertyData.zip,
            street: propertyData.street,
            city: propertyData.city,
            state: propertyData.state,
            latitude: propertyData.latitude,
            longitude: propertyData.longitude,
            description: propertyData.description // Include description in update
          })
          .eq('id', propertyData.id);
        
        if (error) throw error;
        
        toast({
          title: "Property Updated",
          description: "Property has been successfully updated.",
        });
        
        // Navigate to the property detail page
        navigate(`/properties/${propertyData.property_id}`);
      } else {
        // Create new property
        // Generate a unique property ID
        const propertyId = `PROP-${Math.floor(100000 + Math.random() * 900000)}`;
        
        const { data, error } = await supabase
          .from('properties')
          .insert({
            property_id: propertyId,
            name: propertyData.name,
            address: propertyData.address,
            type: propertyData.type,
            units: propertyData.units,
            built_year: propertyData.built_year,
            zip: propertyData.zip,
            street: propertyData.street,
            city: propertyData.city,
            state: propertyData.state,
            latitude: propertyData.latitude,
            longitude: propertyData.longitude,
            description: propertyData.description, // Include description in insert
            user_id: user?.id
          })
          .select('id, property_id')
          .single();
        
        if (error) throw error;
        
        toast({
          title: "Property Created",
          description: "Property has been successfully added to the database.",
        });
        
        // Navigate to the property detail page
        navigate(`/properties/${data.property_id}`);
      }
    } catch (error) {
      console.error('Error saving property:', error);
      toast({
        title: id ? "Update Failed" : "Creation Failed",
        description: `Failed to ${id ? 'update' : 'create'} property: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
            <p className="mt-4 text-muted-foreground">Loading property data...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/properties')} className="mr-2">
          <ArrowLeft size={18} />
          Back to Properties
        </Button>
        <h1 className="text-2xl font-bold">{id ? 'Edit Property' : 'Add New Property'}</h1>
      </div>
      
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="mr-2 h-5 w-5" />
            {id ? 'Edit Property Information' : 'Property Information'}
          </CardTitle>
          <CardDescription>
            {id 
              ? 'Update the details of the property'
              : 'Enter the details of the property you want to add'
            }
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent>
            <PropertyFormFields
              propertyData={propertyData}
              handleChange={handleChange}
              handleTypeChange={handleTypeChange}
              updateCoordinates={updateCoordinates}
              updateAddress={updateAddress}
              isNew={!id}
            />
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/properties')}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>{id ? 'Saving...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  {id ? (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Create Property
                    </>
                  )}
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default PropertyForm;
