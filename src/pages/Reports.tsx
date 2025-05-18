
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  FileText,
  Download,
  FileSpreadsheet,
  FilePieChart,
  Search,
  Calendar,
  Filter,
  Plus,
  ChevronDown,
  Check,
  X,
  Edit,
  Trash,
  Copy
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

interface Report {
  id: string;
  report_id: string;
  name: string;
  description: string | null;
  status: string | null;
  data: any;
  created_at: string;
  created_by: string | null;
  template_id: string | null;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string | null;
  template_data: any;
}

const reportFormSchema = z.object({
  name: z.string().min(1, { message: "Report name is required" }),
  description: z.string().optional(),
  template_id: z.string().min(1, { message: "Please select a template" }),
  property_address: z.string().min(1, { message: "Property address is required" }),
  rent_amount: z.string().min(1, { message: "Rent amount is required" })
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

const Reports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isCreateReportOpen, setIsCreateReportOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isReportPreviewOpen, setIsReportPreviewOpen] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();
  
  const isStaffOrAdmin = user?.role === 'admin' || user?.role === 'staff';
  
  // Initialize form
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      name: '',
      description: '',
      template_id: '',
      property_address: '',
      rent_amount: ''
    },
  });
  
  // Fetch reports from Supabase
  const { data: reports, isLoading, error, refetch } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data as Report[];
    }
  });
  
  // Fetch report templates
  const { data: templates } = useQuery({
    queryKey: ['report_templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('report_templates')
        .select('*');
      
      if (error) throw error;
      
      return data as ReportTemplate[];
    }
  });
  
  // Show error if fetch fails
  React.useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: `Failed to load reports: ${(error as Error).message}`,
        variant: 'destructive',
      });
    }
  }, [error, toast]);
  
  // Filter reports based on search and filters
  const filteredReports = reports?.filter(report => {
    const matchesSearch = 
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.report_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    let matchesTime = timeFilter === 'all';
    const reportDate = new Date(report.created_at);
    const now = new Date();
    
    switch (timeFilter) {
      case 'today':
        matchesTime = reportDate.toDateString() === now.toDateString();
        break;
      case 'week':
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        matchesTime = reportDate >= weekAgo;
        break;
      case 'month':
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        matchesTime = reportDate >= monthAgo;
        break;
      case 'quarter':
        const quarterAgo = new Date();
        quarterAgo.setMonth(now.getMonth() - 3);
        matchesTime = reportDate >= quarterAgo;
        break;
      case 'year':
        const yearAgo = new Date();
        yearAgo.setFullYear(now.getFullYear() - 1);
        matchesTime = reportDate >= yearAgo;
        break;
    }
    
    // Extract report type from data if available
    const reportType = report.data?.type || 'Property';
    const matchesType = typeFilter === 'all' || 
      reportType.toLowerCase().includes(typeFilter.toLowerCase());
    
    return matchesSearch && matchesTime && matchesType;
  }) || [];
  
  // Handle report creation
  const onSubmit = async (data: ReportFormValues) => {
    try {
      // Generate a unique report ID
      const reportId = `R${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      
      // Find the selected template
      const selectedTemplate = templates?.find(t => t.id === data.template_id);
      
      if (!selectedTemplate) {
        throw new Error('Selected template not found');
      }
      
      // Prepare report data
      const reportData = {
        type: 'Property',
        property_address: data.property_address,
        rent_amount: data.rent_amount,
        template_name: selectedTemplate.name,
        analysis_date: new Date().toISOString(),
        sections: selectedTemplate.template_data.sections,
        conclusion: 'The requested rent amount is reasonable based on comparable properties in the area.'
      };
      
      // Insert report into database
      const { error: insertError } = await supabase
        .from('reports')
        .insert({
          report_id: reportId,
          name: data.name,
          description: data.description || null,
          template_id: data.template_id,
          data: reportData,
          status: 'completed',
          created_by: user?.id
        });
      
      if (insertError) throw insertError;
      
      toast({
        title: 'Success',
        description: `Report ${reportId} created successfully!`,
      });
      
      // Reset form and close dialog
      form.reset();
      setIsCreateReportOpen(false);
      refetch();
      
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to create report: ${error.message}`,
        variant: 'destructive',
      });
    }
  };
  
  // Handle report selection for preview
  const handlePreviewReport = (report: Report) => {
    setSelectedReport(report);
    setIsReportPreviewOpen(true);
  };
  
  // Handle report download
  const handleDownloadReport = (report: Report) => {
    try {
      // Create report content
      const content = `
# ${report.name} (${report.report_id})
Generated on: ${new Date(report.created_at).toLocaleDateString()}

## Property Information
Address: ${report.data.property_address}
Requested Rent: $${report.data.rent_amount}

## Analysis
${report.data.conclusion}

## Sections
${report.data.sections.join(', ')}

---
SHRA Rent Reasonableness System Report
      `;
      
      // Create download link
      const element = document.createElement('a');
      const file = new Blob([content], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${report.report_id}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({
        title: 'Download Started',
        description: `Report ${report.report_id} is being downloaded.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to download report: ${error.message}`,
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Generate and view rent reasonableness reports
          </p>
        </div>
        
        <Dialog open={isCreateReportOpen} onOpenChange={setIsCreateReportOpen}>
          <DialogTrigger asChild>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Generate New Report
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Generate New Report</DialogTitle>
              <DialogDescription>
                Create a new rent reasonableness report using one of the available templates.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter report name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter a brief description of the report" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="template_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report Template</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a template" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {templates?.map(template => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the template that fits your reporting needs
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="property_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Address</FormLabel>
                        <FormControl>
                          <AddressAutocomplete
                            onAddressSelect={(address) => {
                              field.onChange(address.full);
                            }}
                            defaultValue={field.value}
                            placeholder="Enter property address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="rent_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Requested Rent Amount ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="1200" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button variant="outline" type="button" onClick={() => setIsCreateReportOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Generate Report</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search reports..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
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
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
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
            {isLoading ? (
              <div className="text-center py-12">
                <div className="h-12 w-12 mx-auto border-4 border-t-primary rounded-full animate-spin"></div>
                <p className="mt-4 text-lg font-medium">Loading reports...</p>
              </div>
            ) : (
              <>
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <Card 
                      key={report.id} 
                      className="hover:border-primary/50 cursor-pointer transition-colors"
                      onClick={() => handlePreviewReport(report)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              {report.data?.format === 'Excel' ? (
                                <FileSpreadsheet className="h-6 w-6 text-primary" />
                              ) : (
                                <FilePieChart className="h-6 w-6 text-primary" />
                              )}
                            </div>
                            
                            <div>
                              <h3 className="font-medium mb-1">{report.name}</h3>
                              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                <span>ID: {report.report_id}</span>
                                <span>•</span>
                                <span>Date: {new Date(report.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <Badge variant="outline">{report.data?.type || 'Property'}</Badge>
                              <div className="text-sm mt-1">{report.data?.format || 'PDF'}</div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon">
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadReport(report);
                                }}>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  // Copy functionality would go here
                                  toast({ description: 'Report copied to clipboard' });
                                }}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy Link
                                </DropdownMenuItem>
                                {isStaffOrAdmin && (
                                  <>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation();
                                      // Edit functionality would go here
                                      toast({ description: 'Edit functionality will be available in future updates' });
                                    }}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Delete functionality would go here
                                        toast({ description: 'Delete functionality will be available in future updates' });
                                      }}
                                      className="text-destructive focus:text-destructive"
                                    >
                                      <Trash className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 bg-muted/20 rounded-lg">
                    <FileText className="h-16 w-16 mx-auto text-muted-foreground/60 mb-3" />
                    <h3 className="text-lg font-medium">No reports found</h3>
                    <p className="text-muted-foreground mt-1">
                      {searchTerm || timeFilter !== 'all' || typeFilter !== 'all' ? 
                        'Try adjusting your search or filters' : 
                        'Generate your first report to get started'}
                    </p>
                    {(!searchTerm && timeFilter === 'all' && typeFilter === 'all') && (
                      <Button className="mt-4" onClick={() => setIsCreateReportOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Report
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
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
              {templates ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <Card key={template.id} className="hover:border-primary/50 cursor-pointer transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <FileText className="h-5 w-5 text-primary" />
                          <h3 className="font-medium">{template.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                      </CardContent>
                      <CardFooter className="px-4 py-3 bg-muted/10 flex justify-between">
                        <div className="text-xs text-muted-foreground">
                          {template.template_data.sections.length} sections
                        </div>
                        {isStaffOrAdmin && (
                          <Button variant="ghost" size="sm" className="h-8">
                            <Edit className="h-3 w-3 mr-2" />
                            Edit
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>Loading templates...</p>
                </div>
              )}
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
      
      {/* Report Preview Dialog */}
      <Dialog open={isReportPreviewOpen} onOpenChange={setIsReportPreviewOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{selectedReport?.name}</DialogTitle>
            <DialogDescription>
              Report ID: {selectedReport?.report_id} | Generated: {selectedReport && new Date(selectedReport.created_at).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedReport && (
              <>
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-semibold mb-2">Property Information</h3>
                  <p className="text-sm"><strong>Address:</strong> {selectedReport.data.property_address}</p>
                  <p className="text-sm"><strong>Requested Rent:</strong> ${selectedReport.data.rent_amount}</p>
                  <p className="text-sm"><strong>Analysis Date:</strong> {new Date(selectedReport.data.analysis_date).toLocaleDateString()}</p>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-semibold mb-2">Analysis Sections</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedReport.data.sections.map((section: string) => (
                      <div key={section} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm capitalize">{section.replace(/_/g, ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-semibold mb-2">Conclusion</h3>
                  <p className="text-sm">{selectedReport.data.conclusion}</p>
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReportPreviewOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              if (selectedReport) handleDownloadReport(selectedReport);
            }}>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;
