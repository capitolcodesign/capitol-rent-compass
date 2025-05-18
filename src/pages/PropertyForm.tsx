
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import PropertyFormFields from '@/components/properties/PropertyFormFields';

const PropertyForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [propertyData, setPropertyData] = useState({
    name: '',
    address: '',
    type: 'Multi-family',
    units: 1,
    built_year: new Date().getFullYear() - 10,
    zip: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPropertyData(prev => ({
      ...prev,
      [name]: name === 'units' || name === 'built_year' ? parseInt(value, 10) || 0 : value
    }));
  };
  
  const handleTypeChange = (value: string) => {
    setPropertyData(prev => ({
      ...prev,
      type: value
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
          user_id: user?.id
        })
        .select('property_id')
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Property Created",
        description: "Property has been successfully added to the database.",
      });
      
      // Navigate to the property detail page
      navigate(`/properties/${propertyId}`);
      
    } catch (error) {
      console.error('Error creating property:', error);
      toast({
        title: "Creation Failed",
        description: `Failed to create property: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/properties')} className="mr-2">
          <ArrowLeft size={18} />
          Back to Properties
        </Button>
        <h1 className="text-2xl font-bold">Add New Property</h1>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="mr-2 h-5 w-5" />
            Property Information
          </CardTitle>
          <CardDescription>
            Enter the details of the property you want to add
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent>
            <PropertyFormFields
              propertyData={propertyData}
              handleChange={handleChange}
              handleTypeChange={handleTypeChange}
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
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Create Property
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
