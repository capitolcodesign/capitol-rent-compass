
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';

interface PropertyFormActionsProps {
  id?: string;
  isSubmitting: boolean;
}

const PropertyFormActions: React.FC<PropertyFormActionsProps> = ({ id, isSubmitting }) => {
  const navigate = useNavigate();

  return (
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
            <span>{id ? 'Saving...' : 'Creating...'}</span>
          </>
        ) : (
          <>
            {id ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Create Property
              </>
            )}
          </>
        )}
      </Button>
    </CardFooter>
  );
};

export default PropertyFormActions;
