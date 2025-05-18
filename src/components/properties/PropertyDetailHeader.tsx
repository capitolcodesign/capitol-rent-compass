
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, PencilLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PropertyDetailHeaderProps {
  propertyName: string;
  onDeleteClick?: () => void;
  onEditClick?: () => void;
}

const PropertyDetailHeader: React.FC<PropertyDetailHeaderProps> = ({ 
  propertyName, 
  onDeleteClick,
  onEditClick
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div className="flex items-center mb-4 md:mb-0">
        <Button variant="ghost" onClick={() => navigate('/properties')} className="mr-2">
          <ArrowLeft className="mr-2" size={18} />
          Back
        </Button>
        <h1 className="text-2xl font-bold">{propertyName}</h1>
      </div>
      
      <div className="flex space-x-2">
        {onEditClick && (
          <Button variant="outline" onClick={onEditClick}>
            <PencilLine className="mr-2 h-4 w-4" />
            Edit Property
          </Button>
        )}
        
        {onDeleteClick && (
          <Button variant="destructive" onClick={onDeleteClick}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default PropertyDetailHeader;
