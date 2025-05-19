
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ConfirmActionDialog } from '@/components/admin/ConfirmActionDialog';
import FairnessCalculator from '@/components/rental-fairness/FairnessCalculator';
import RentalAssistantChat from '@/components/rental-fairness/RentalAssistantChat';
import { PropertyDetail } from '@/hooks/usePropertyDetail';

interface PropertyDetailDialogsProps {
  property: PropertyDetail;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  isFairnessDialogOpen: boolean;
  setIsFairnessDialogOpen: (open: boolean) => void;
  isGptDialogOpen: boolean;
  setIsGptDialogOpen: (open: boolean) => void;
  isDeleting: boolean;
  onDeleteProperty: () => Promise<void>;
  extractAmenityNames: () => string[];
}

export const PropertyDetailDialogs: React.FC<PropertyDetailDialogsProps> = ({
  property,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  isFairnessDialogOpen,
  setIsFairnessDialogOpen,
  isGptDialogOpen,
  setIsGptDialogOpen,
  isDeleting,
  onDeleteProperty,
  extractAmenityNames
}) => {
  return (
    <>
      {/* Delete Confirmation Dialog */}
      <ConfirmActionDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={onDeleteProperty}
        title="Delete Property"
        description="Are you sure you want to delete this property? This action cannot be undone and will remove all data associated with this property."
        confirmLabel="Delete Property"
        variant="destructive"
        loading={isDeleting}
      />

      {/* Fairness Calculator Dialog */}
      <Dialog open={isFairnessDialogOpen} onOpenChange={setIsFairnessDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Rental Fairness Calculator - {property.name}</DialogTitle>
          </DialogHeader>
          <FairnessCalculator 
            propertyDetails={{
              location: property.address,
              locationDetails: {
                street: property.street || '',
                city: property.city || '',
                state: property.state || '',
                zip: property.zip,
                lat: property.latitude || 0,
                lng: property.longitude || 0
              },
              rent: property.rent || 0,
              squareFeet: property.square_feet || 0,
              bedrooms: property.bedrooms || 0,
              bathrooms: property.bathrooms || 0,
              amenities: extractAmenityNames(),
              condition: property.condition || ''
            }}
          />
        </DialogContent>
      </Dialog>

      {/* GPT Assistant Dialog */}
      <Dialog open={isGptDialogOpen} onOpenChange={setIsGptDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Property Assistant - {property.name}</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <RentalAssistantChat propertyId={property.id} propertyName={property.name} address={property.address} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
