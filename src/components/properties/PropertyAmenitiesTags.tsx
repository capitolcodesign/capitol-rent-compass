
import React from 'react';
import { usePropertyAmenities } from './hooks/usePropertyAmenities';
import { usePropertyTags } from './hooks/usePropertyTags';
import PropertyAmenitiesList from './amenities/PropertyAmenitiesList';
import PropertyTagsList from './tags/PropertyTagsList';

interface PropertyAmenitiesTagsProps {
  propertyId: string;
}

const PropertyAmenitiesTags: React.FC<PropertyAmenitiesTagsProps> = ({ propertyId }) => {
  // Use custom hooks to handle amenities and tags
  const { 
    isLoading: isLoadingAmenities,
    loadingAmenity,
    toggleAmenity,
    isAmenitySelected,
    groupedAmenities
  } = usePropertyAmenities(propertyId);

  const { 
    isLoading: isLoadingTags,
    loadingTag,
    toggleTag,
    isTagSelected,
    tagNames
  } = usePropertyTags(propertyId);

  // Show loading state
  if (isLoadingAmenities || isLoadingTags) {
    return (
      <div className="flex justify-center p-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Amenities Section */}
      <PropertyAmenitiesList
        groupedAmenities={groupedAmenities}
        isAmenitySelected={isAmenitySelected}
        toggleAmenity={toggleAmenity}
        loadingAmenity={loadingAmenity}
      />

      {/* Tags Section */}
      <PropertyTagsList
        tags={tagNames}
        isTagSelected={isTagSelected}
        toggleTag={toggleTag}
        loadingTag={loadingTag}
      />
    </div>
  );
};

export default PropertyAmenitiesTags;
