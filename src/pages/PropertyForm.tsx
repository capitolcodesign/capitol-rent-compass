
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from '@/contexts/auth';

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
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Property Name*</Label>
              <Input 
                id="name" 
                name="name"
                placeholder="Enter property name" 
                value={propertyData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address*</Label>
              <Input 
                id="address" 
                name="address"
                placeholder="Enter property address" 
                value={propertyData.address}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code*</Label>
              <Input 
                id="zip" 
                name="zip"
                placeholder="Enter ZIP code" 
                value={propertyData.zip}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Property Type</Label>
                <Select value={propertyData.type} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Multi-family">Multi-family</SelectItem>
                    <SelectItem value="Single-family">Single-family</SelectItem>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Condo">Condo</SelectItem>
                    <SelectItem value="Townhouse">Townhouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="units">Number of Units</Label>
                <Input 
                  id="units" 
                  name="units"
                  type="number" 
                  min="1"
                  value={propertyData.units}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="built_year">Year Built</Label>
                <Input 
                  id="built_year" 
                  name="built_year"
                  type="number" 
                  min="1900" 
                  max={new Date().getFullYear()}
                  value={propertyData.built_year}
                  onChange={handleChange}
                />
              </div>
            </div>
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
