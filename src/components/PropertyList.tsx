
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Filter, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Property {
  id: string;
  name: string;
  address: string;
  type: string;
  units: number;
  last_analysis: string | null;
}

export default function PropertyList() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id, name, address, type, units, last_analysis')
        .order('name');
        
      if (error) {
        throw error;
      }
      
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProperties();
  }, []);
  
  const filteredProperties = searchQuery.trim() === ''
    ? properties
    : properties.filter(property => 
        property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">
            Manage and analyze your rental properties.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search properties..." 
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>
      
      <Card>
        <CardHeader className="p-4">
          <CardTitle>Property List</CardTitle>
          <CardDescription>
            {filteredProperties.length} properties found
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center p-6">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Property Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-center">Units</TableHead>
                    <TableHead>Last Analysis</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.length > 0 ? (
                    filteredProperties.map((property) => (
                      <TableRow 
                        key={property.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/properties/${property.id}`)}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded bg-secondary/20 flex items-center justify-center mr-2">
                              <Building2 className="h-4 w-4" />
                            </div>
                            {property.name}
                          </div>
                        </TableCell>
                        <TableCell>{property.address}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{property.type}</Badge>
                        </TableCell>
                        <TableCell className="text-center">{property.units}</TableCell>
                        <TableCell>
                          {property.last_analysis ? 
                            new Date(property.last_analysis).toLocaleDateString() : 
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Never</Badge>
                          }
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                        {searchQuery.trim() !== '' ? 
                          'No properties match your search.' : 
                          'No properties found. Add your first property to get started.'
                        }
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
