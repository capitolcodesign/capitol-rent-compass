
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createSampleUsers } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SampleUsersCreator: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  
  const handleCreateSampleUsers = async () => {
    setIsCreating(true);
    try {
      const result = await createSampleUsers();
      if (result.success) {
        toast({
          title: "Success",
          description: "Sample users created successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create sample users.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating sample users:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-capitol-cream p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sample Users Creator</h1>
        
        <div className="mb-6">
          <p className="mb-2">This will create three sample users with the following credentials:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Admin:</strong> admin@shra.org / SHRA123!</li>
            <li><strong>Staff:</strong> staff@shra.org / SHRA123!</li>
            <li><strong>Auditor:</strong> auditor@shra.org / SHRA123!</li>
          </ul>
        </div>
        
        <Button 
          onClick={handleCreateSampleUsers} 
          className="w-full"
          disabled={isCreating}
        >
          {isCreating ? "Creating Users..." : "Create Sample Users"}
        </Button>
      </div>
    </div>
  );
};

export default SampleUsersCreator;
