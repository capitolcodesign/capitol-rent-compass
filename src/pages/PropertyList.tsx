
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import PropertyHeader from '@/components/properties/PropertyHeader';
import PropertyFilters from '@/components/properties/PropertyFilters';
import PropertyTableView from '@/components/properties/PropertyTableView';
import PropertyCardView from '@/components/properties/PropertyCardView';

// Property type definition
interface Property {
  id: string;
  property_id: string;
  name: string;
  address: string;
  zip: string;
  type: string;
  units: number;
  built_year: number;
  last_analysis: string | null;
}

type ViewMode = 'cards' | 'table';
type SortField = 'name' | 'address' | 'type' | 'units' | 'built_year' | 'last_analysis';
type SortOrder = 'asc' | 'desc';

const PropertyList: React.FC = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  
  // Hooks
  const { toast } = useToast();
  const { user } = useAuth();
  
  // User role check
  const isStaffOrAdmin = user?.role === 'admin' || user?.role === 'staff';
  
  // Data fetching
  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['properties', sortField, sortOrder],
    queryFn: async () => {
      let query = supabase
        .from('properties')
        .select('*');
      
      // Add sorting
      if (sortField && sortOrder) {
        query = query.order(sortField, { ascending: sortOrder === 'asc' });
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as Property[];
    }
  });
  
  // Show error toast if fetch fails
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: `Failed to load properties: ${error.message}`,
        variant: 'destructive',
      });
    }
  }, [error, toast]);
  
  // Filter properties based on search and filters
  const filteredProperties = properties?.filter(property => {
    const matchesSearch = 
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) || 
      property.property_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = propertyType === 'all' || property.type === propertyType;
    return matchesSearch && matchesType;
  }) || [];
  
  // Toggle sort order or change sort field
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="h-12 w-12 mx-auto border-4 border-t-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium">Loading properties...</p>
      </div>
    );
  }
  
  return (
    <div>
      {/* Header */}
      <PropertyHeader isStaffOrAdmin={isStaffOrAdmin} />
      
      {/* Search and filters */}
      <PropertyFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        propertyType={propertyType}
        setPropertyType={setPropertyType}
        viewMode={viewMode}
        setViewMode={setViewMode}
        sortField={sortField}
        sortOrder={sortOrder}
        handleSort={handleSort}
        setSortOrder={setSortOrder}
      />
      
      {/* Table or Card view */}
      {viewMode === 'table' ? (
        <PropertyTableView
          properties={filteredProperties}
          sortField={sortField}
          sortOrder={sortOrder}
          handleSort={handleSort}
          searchTerm={searchTerm}
          propertyType={propertyType}
          isStaffOrAdmin={isStaffOrAdmin}
        />
      ) : (
        <PropertyCardView
          properties={filteredProperties}
          searchTerm={searchTerm}
          propertyType={propertyType}
          isStaffOrAdmin={isStaffOrAdmin}
        />
      )}
    </div>
  );
};

export default PropertyList;
