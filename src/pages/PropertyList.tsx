
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown,
  ArrowRight
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

// Mock property data
const mockProperties = [
  { 
    id: 'P001', 
    address: '123 Oak Avenue, Sacramento', 
    zip: '95814', 
    type: 'Multi-family', 
    units: 24, 
    builtYear: 2005,
    lastAnalysis: '2025-04-15'
  },
  { 
    id: 'P002', 
    address: '456 Pine Street, Sacramento', 
    zip: '95818', 
    type: 'Single-family', 
    units: 1, 
    builtYear: 1998,
    lastAnalysis: '2025-03-22'
  },
  { 
    id: 'P003', 
    address: '789 Elm Road, Sacramento', 
    zip: '95822', 
    type: 'Multi-family', 
    units: 12, 
    builtYear: 2010,
    lastAnalysis: '2025-05-01'
  },
  { 
    id: 'P004', 
    address: '101 Cedar Lane, Sacramento', 
    zip: '95825', 
    type: 'Single-family', 
    units: 1, 
    builtYear: 2001,
    lastAnalysis: '2025-02-18'
  },
  { 
    id: 'P005', 
    address: '202 Maple Drive, Sacramento', 
    zip: '95833', 
    type: 'Multi-family', 
    units: 8, 
    builtYear: 2015,
    lastAnalysis: '2025-04-30'
  },
];

const PropertyList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const navigate = useNavigate();
  
  // Filter properties based on search and filters
  const filteredProperties = mockProperties.filter(property => {
    const matchesSearch = property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = propertyType === 'all' || property.type === propertyType;
    return matchesSearch && matchesType;
  });
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Property Database</h1>
          <p className="text-muted-foreground">
            Manage and search properties for rent reasonableness analysis
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>
      
      {/* Search and filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search by address or property ID..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Multi-family">Multi-family</SelectItem>
                  <SelectItem value="Single-family">Single-family</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Property list */}
      <div className="grid gap-4">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="hover:border-primary/50 cursor-pointer transition-colors" 
              onClick={() => navigate(`/properties/${property.id}`)}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-1">{property.address}</h3>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span>ID: {property.id}</span>
                      <span>•</span>
                      <span>ZIP: {property.zip}</span>
                      <span>•</span>
                      <span>Built: {property.builtYear}</span>
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
        ))}
        
        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground/60" />
            <h3 className="mt-4 text-lg font-medium">No properties found</h3>
            <p className="text-muted-foreground mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyList;
