
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TagsIcon } from 'lucide-react';
import PropertyTagItem from './PropertyTagItem';

interface PropertyTagsListProps {
  tags: string[];
  isTagSelected: (name: string) => boolean;
  toggleTag: (name: string, isChecked: boolean) => void;
  loadingTag: string | null;
}

const PropertyTagsList: React.FC<PropertyTagsListProps> = ({
  tags,
  isTagSelected,
  toggleTag,
  loadingTag
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <TagsIcon className="mr-2 h-5 w-5" />
          Property Tags
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {tags.map((tagName) => (
            <PropertyTagItem
              key={tagName}
              name={tagName}
              isSelected={isTagSelected(tagName)}
              onToggle={(isChecked) => toggleTag(tagName, isChecked)}
              isLoading={loadingTag === tagName}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyTagsList;
