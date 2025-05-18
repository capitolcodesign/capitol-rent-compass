
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown,
  ArrowRight,
  SortAsc,
  SortDesc,
  Tag
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

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

// Tag type definition
interface PropertyTag {
  id: string;
  name: string;
}

type ViewMode = 'cards' | 'table';
type SortField = 'name' | 'address' | 'type' | 'units' | 'built_year' | 'last_analysis';
type SortOrder = 'asc' | 'desc';

const PropertyList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const isStaffOrAdmin = user?.role === 'admin' || user?.role === 'staff';
  
  // Fetch properties from Supabase
  const { data: properties, isLoading: isLoadingProperties, error: propertiesError, refetch: refetchProperties } = useQuery({
    queryKey: ['properties'],
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
  
  // Fetch tags from Supabase
  const { data: tags } = useQuery({
    queryKey: ['property_tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_tags')
        .select('*');
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as PropertyTag[];
    }
  });
  
  // Show error toast if fetch fails
  useEffect(() => {
    if (propertiesError) {
      toast({
        title: 'Error',
        description: `Failed to load properties: ${propertiesError.message}`,
        variant: 'destructive',
      });
    }
  }, [propertiesError, toast]);
  
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
  
  // Render sort icon
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <SortAsc className="h-4 w-4 ml-1" /> : <SortDesc className="h-4 w-4 ml-1" />;
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Property Database</h1>
          <p className="text-muted-foreground">
            Manage and search properties for rent reasonableness analysis
          </p>
        </div>
        {isStaffOrAdmin && (
          <Button onClick={() => navigate('/properties/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        )}
      </div>
      
      {/* Search and filters */}
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
      
      {/* Loading state */}
      {isLoadingProperties && (
        <div className="text-center py-12">
          <div className="h-12 w-12 mx-auto border-4 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium">Loading properties...</p>
        </div>
      )}
      
      {/* Table view */}
      {!isLoadingProperties && viewMode === 'table' && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                  <div className="flex items-center">
                    Name {renderSortIcon('name')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('address')}>
                  <div className="flex items-center">
                    Address {renderSortIcon('address')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('type')}>
                  <div className="flex items-center">
                    Type {renderSortIcon('type')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('units')}>
                  <div className="flex items-center">
                    Units {renderSortIcon('units')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('built_year')}>
                  <div className="flex items-center">
                    Year Built {renderSortIcon('built_year')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('last_analysis')}>
                  <div className="flex items-center">
                    Last Analysis {renderSortIcon('last_analysis')}
                  </div>
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
                  <TableRow 
                    key={property.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/properties/${property.property_id}`)}
                  >
                    <TableCell className="font-medium">{property.name}</TableCell>
                    <TableCell>{property.address}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{property.type}</Badge>
                    </TableCell>
                    <TableCell>{property.units}</TableCell>
                    <TableCell>{property.built_year}</TableCell>
                    <TableCell>
                      {property.last_analysis ? 
                        new Date(property.last_analysis).toLocaleDateString() : 
                        'Not analyzed'}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/properties/${property.property_id}`);
                      }}>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <Building2 className="h-12 w-12 mx-auto text-muted-foreground/60 mb-4" />
                    <p className="text-lg font-medium">No properties found</p>
                    <p className="text-muted-foreground">
                      {searchTerm || propertyType !== 'all' ? 
                        'Try adjusting your search or filters' : 
                        'Add your first property to get started'}
                    </p>
                    {isStaffOrAdmin && (searchTerm === '' && propertyType === 'all') && (
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/properties/new');
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Property
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}
      
      {/* Card view */}
      {!isLoadingProperties && viewMode === 'cards' && (
        <div className="grid gap-4">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <Card key={property.id} className="hover:border-primary/50 cursor-pointer transition-colors" 
                  onClick={() => navigate(`/properties/${property.property_id}`)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-1">{property.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{property.address}</p>
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          <span>ID: {property.property_id}</span>
                          <span>•</span>
                          <span>ZIP: {property.zip}</span>
                          <span>•</span>
                          <span>Built: {property.built_year}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <Badge variant="outline">{property.type}</Badge>
                        <div className="text-sm mt-1">{property.units} unit{property.units > 1 ? 's' : ''}</div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground/60" />
              <h3 className="mt-4 text-lg font-medium">No properties found</h3>
              <p className="text-muted-foreground mt-1">
                {searchTerm || propertyType !== 'all' ? 
                  'Try adjusting your search or filters' : 
                  'Add your first property to get started'}
              </p>
              {isStaffOrAdmin && (searchTerm === '' && propertyType === 'all') && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate('/properties/new')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyList;
