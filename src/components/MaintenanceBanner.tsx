
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const MaintenanceBanner: React.FC = () => {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4 mr-2" />
      <AlertDescription>
        <span className="font-medium">Outside operational hours:</span> The system is currently in read-only mode (4am to 11:59pm PT). Some features may be limited.
      </AlertDescription>
    </Alert>
  );
};

export default MaintenanceBanner;
