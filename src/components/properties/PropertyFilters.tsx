
import React from 'react';
import { Search, Filter, ArrowUpDown, SortAsc, SortDesc } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortField = 'name' | 'address' | 'type' | 'units' | 'built_year' | 'last_analysis';
type SortOrder = 'asc' | 'desc';

interface PropertyFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  propertyType: string;
  setPropertyType: (value: string) => void;
  viewMode: 'cards' | 'table';
  setViewMode: (value: 'cards' | 'table') => void;
  sortField: SortField;
  sortOrder: SortOrder;
  handleSort: (field: SortField) => void;
  setSortOrder: (order: SortOrder) => void;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  propertyType,
  setPropertyType,
  viewMode,
  setViewMode,
  sortField,
  sortOrder,
  handleSort,
  setSortOrder,
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search by name, address or property ID..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Multi-family">Multi-family</SelectItem>
                <SelectItem value="Single-family">Single-family</SelectItem>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="Condo">Condo</SelectItem>
                <SelectItem value="Townhouse">Townhouse</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortField} onValueChange={(value) => handleSort(value as SortField)}>
              <SelectTrigger className="w-40">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="address">Address</SelectItem>
                <SelectItem value="type">Type</SelectItem>
                <SelectItem value="units">Units</SelectItem>
                <SelectItem value="built_year">Year Built</SelectItem>
                <SelectItem value="last_analysis">Last Analysis</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4 mr-2" /> : <SortDesc className="h-4 w-4 mr-2" />}
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
            >
              {viewMode === 'cards' ? 'Table View' : 'Card View'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyFilters;
