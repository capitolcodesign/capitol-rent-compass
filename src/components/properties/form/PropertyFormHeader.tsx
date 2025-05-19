
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PropertyFormHeaderProps {
  id?: string;
}

const PropertyFormHeader: React.FC<PropertyFormHeaderProps> = ({ id }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center mb-6">
      <Button variant="ghost" onClick={() => navigate('/properties')} className="mr-2">
        <ArrowLeft size={18} />
        Back to Properties
      </Button>
      <h1 className="text-2xl font-bold">{id ? 'Edit Property' : 'Add New Property'}</h1>
    </div>
  );
};

export default PropertyFormHeader;
