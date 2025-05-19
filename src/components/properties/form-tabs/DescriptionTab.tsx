
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface DescriptionTabProps {
  description: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const DescriptionTab: React.FC<DescriptionTabProps> = ({
  description,
  handleChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">Property Description</Label>
        <Textarea 
          id="description" 
          name="description"
          placeholder="Enter a detailed description of the property" 
          value={description || ''}
          onChange={handleChange}
          className="min-h-[200px]"
        />
      </div>
    </div>
  );
};

export default DescriptionTab;
