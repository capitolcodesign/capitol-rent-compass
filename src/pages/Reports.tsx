
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Search, Filter, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Report {
  id: string;
  name: string;
  report_id: string;
  status: string | null;
  created_at: string | null;
}

export default function Reports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('id, name, report_id, status, created_at')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReports();
  }, []);
  
  const filteredReports = searchQuery.trim() === ''
    ? reports
    : reports.filter(report => 
        report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.report_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (report.status || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            View and manage rent analysis reports.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => navigate('/reports/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Create Report
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search reports..." 
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
          <CardTitle>Report List</CardTitle>
          <CardDescription>
            {filteredReports.length} reports found
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
                    <TableHead className="w-[250px]">Report Name</TableHead>
                    <TableHead>Report ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <TableRow 
                        key={report.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/reports/${report.id}`)}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded bg-secondary/20 flex items-center justify-center mr-2">
                              <FileText className="h-4 w-4" />
                            </div>
                            {report.name}
                          </div>
                        </TableCell>
                        <TableCell>{report.report_id}</TableCell>
                        <TableCell>
                          <Badge variant={report.status === 'published' ? 'default' : 'outline'} className="capitalize">
                            {report.status || 'draft'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {report.created_at ? 
                            new Date(report.created_at).toLocaleDateString() : 
                            'Unknown'
                          }
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                        {searchQuery.trim() !== '' ? 
                          'No reports match your search.' : 
                          'No reports found. Create your first report to get started.'
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
  );
}
