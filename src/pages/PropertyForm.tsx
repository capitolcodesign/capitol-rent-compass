
import React from 'react';
import { Building2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { usePropertyForm } from '@/hooks/usePropertyForm';
import PropertyFormHeader from '@/components/properties/form/PropertyFormHeader';
import PropertyFormLoading from '@/components/properties/form/PropertyFormLoading';
import PropertyFormActions from '@/components/properties/form/PropertyFormActions';
import PropertyFormFields from '@/components/properties/PropertyFormFields';

const PropertyForm = () => {
  const {
    id,
    propertyData,
    isSubmitting,
    isLoading,
    handleChange,
    handleTypeChange,
    updateCoordinates,
    updateAddress,
    handleSubmit
  } = usePropertyForm();
  
  if (isLoading) {
    return <PropertyFormLoading />;
  }
  
  return (
    <div className="p-6">
      <PropertyFormHeader id={id} />
      
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
          
          <PropertyFormActions id={id} isSubmitting={isSubmitting} />
        </form>
      </Card>
    </div>
  );
};

export default PropertyForm;
