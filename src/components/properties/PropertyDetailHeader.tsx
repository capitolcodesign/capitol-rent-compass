
import React from 'react';
import { ChevronLeft, PenLine, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PropertyDetailHeaderProps {
  propertyName: string;
  onDeleteClick: () => void;
}

const PropertyDetailHeader: React.FC<PropertyDetailHeaderProps> = ({ propertyName, onDeleteClick }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate('/properties')} className="mr-2">
          <ChevronLeft size={18} />
          Back
        </Button>
        <h1 className="text-2xl font-bold">{propertyName}</h1>
      </div>
      <div className="mt-4 md:mt-0 flex space-x-2">
        <Button variant="outline">
          <PenLine className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button 
          variant="destructive"
          onClick={onDeleteClick}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default PropertyDetailHeader;
