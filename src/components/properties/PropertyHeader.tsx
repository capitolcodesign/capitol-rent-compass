
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PropertyHeaderProps {
  isStaffOrAdmin: boolean;
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({ isStaffOrAdmin }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold">Property Database</h1>
        <p className="text-muted-foreground">
          Manage and search properties for rent reasonableness analysis
        </p>
      </div>
      {isStaffOrAdmin && (
        <Button onClick={() => navigate('/properties/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      )}
    </div>
  );
};

export default PropertyHeader;
