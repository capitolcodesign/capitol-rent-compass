
import React from 'react';

const PropertyFormLoading: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
          <p className="mt-4 text-muted-foreground">Loading property data...</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyFormLoading;
