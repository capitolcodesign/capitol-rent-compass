
import React from 'react';
import {
  FileText,
  Download,
  FileSpreadsheet,
  FilePieChart,
  Search,
  Calendar,
  Filter,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const Reports: React.FC = () => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Generate and view rent reasonableness reports
          </p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Generate New Report
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search reports..." 
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-40">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="property">Property Reports</SelectItem>
                  <SelectItem value="compliance">Compliance Reports</SelectItem>
                  <SelectItem value="audit">Audit Reports</SelectItem>
                  <SelectItem value="annual">Annual Reports</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="reports" className="mb-6">
        <TabsList>
          <TabsTrigger value="reports">Generated Reports</TabsTrigger>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reports" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Sample reports */}
            {[
              { 
                id: 'R2025-052', 
                name: 'Rent Reasonableness Study - 123 Oak Avenue', 
                date: '2025-05-15', 
                type: 'Property',
                format: 'PDF'
              },
              { 
                id: 'R2025-051', 
                name: 'Monthly Compliance Summary - North Sacramento', 
                date: '2025-05-01', 
                type: 'Compliance',
                format: 'Excel'
              },
              { 
                id: 'R2025-050', 
                name: 'Quarterly Market Analysis - Q2 2025', 
                date: '2025-04-30', 
                type: 'Market Analysis',
                format: 'PDF'
              },
              { 
                id: 'R2025-049', 
                name: 'Audit Trail - User Activity', 
                date: '2025-04-15', 
                type: 'Audit',
                format: 'Excel'
              },
            ].map((report) => (
              <Card key={report.id} className="hover:border-primary/50 cursor-pointer transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        {report.format === 'PDF' ? (
                          <FilePieChart className="h-6 w-6 text-primary" />
                        ) : (
                          <FileSpreadsheet className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-1">{report.name}</h3>
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          <span>ID: {report.id}</span>
                          <span>•</span>
                          <span>Date: {report.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <Badge variant="outline">{report.type}</Badge>
                        <div className="text-sm mt-1">{report.format}</div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>
                Create and manage reusable report templates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Create standardized report templates for consistent reporting.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="hover:border-primary/50 cursor-pointer transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Standard Property Analysis</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Complete property analysis with all HUD-required sections
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="hover:border-primary/50 cursor-pointer transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Monthly Review Summary</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Monthly aggregated data for program administrators
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="hover:border-primary/50 cursor-pointer transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">HUD Compliance Report</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Regulatory compliance summary for HUD reporting
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduled" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>
                Configure automated report generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Set up recurring reports to be automatically generated on your schedule.</p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm italic text-center">
                  Scheduled reporting functionality will be implemented in future updates
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
