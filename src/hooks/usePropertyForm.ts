
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';

interface PropertyData {
  id: string;
  property_id: string;
  name: string;
  address: string;
  type: string;
  units: number;
  built_year: number;
  zip: string;
  street: string;
  city: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
  description: string;
}

export const usePropertyForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const initialData = {
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
    latitude: null,
    longitude: null,
    description: ''
  };
  
  const [propertyData, setPropertyData] = useState<PropertyData>(initialData);
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
            description: data.description || ''
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
            description: propertyData.description
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
            description: propertyData.description,
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

  return {
    id,
    propertyData,
    isSubmitting,
    isLoading,
    handleChange,
    handleTypeChange,
    updateCoordinates,
    updateAddress,
    handleSubmit
  };
};
