
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, Plus, SortAsc, SortDesc } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

type SortField = 'name' | 'address' | 'type' | 'units' | 'built_year' | 'last_analysis';

interface PropertyTableViewProps {
  properties: Property[];
  sortField: SortField;
  sortOrder: 'asc' | 'desc';
  handleSort: (field: SortField) => void;
  searchTerm: string;
  propertyType: string;
  isStaffOrAdmin: boolean;
}

const PropertyTableView: React.FC<PropertyTableViewProps> = ({
  properties,
  sortField,
  sortOrder,
  handleSort,
  searchTerm,
  propertyType,
  isStaffOrAdmin
}) => {
  const navigate = useNavigate();

  // Render sort icon
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <SortAsc className="h-4 w-4 ml-1" /> : <SortDesc className="h-4 w-4 ml-1" />;
  };

  return (
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
          {properties.length > 0 ? (
            properties.map((property) => (
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
  );
};

export default PropertyTableView;
