
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Download, FileText, Calendar, User, PenLine, Share2, Printer, Copy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

interface Report {
  id: string;
  name: string;
  description: string | null;
  status: string | null;
  data: any;
  report_id: string;
  created_at: string | null;
  updated_at: string | null;
  created_by: string | null;
  template_id: string | null;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string | null;
}

interface ReportCreator {
  first_name: string | null;
  last_name: string | null;
  role: string | null;
}

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: report, isLoading, error } = useQuery({
    queryKey: ['report', id],
    queryFn: async () => {
      if (!id) throw new Error("Report ID is required");
      
      // Fix: Handle the case where id might be "new"
      if (id === 'new') {
        throw new Error("Creating a new report is not implemented yet");
      }
      
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("Error fetching report:", error);
        throw new Error(error.message);
      }
      
      if (!data) {
        throw new Error("Report not found");
      }
      
      return data as Report;
    },
    enabled: !!id && id !== 'new',
  });

  // Fetch the report template if a template_id exists
  const { data: template } = useQuery({
    queryKey: ['report-template', report?.template_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('report_templates')
        .select('id, name, description')
        .eq('id', report?.template_id)
        .single();
      
      if (error) {
        console.error("Error fetching template:", error);
        throw new Error(error.message);
      }
      
      return data as ReportTemplate;
    },
    enabled: !!report?.template_id,
  });

  // Fetch the report creator information
  const { data: creator } = useQuery({
    queryKey: ['report-creator', report?.created_by],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, role')
        .eq('id', report?.created_by)
        .single();
      
      if (error) {
        console.error("Error fetching creator:", error);
        throw new Error(error.message);
      }
      
      return data as ReportCreator;
    },
    enabled: !!report?.created_by,
  });

  const handleCopyLink = () => {
    const reportUrl = window.location.href;
    navigator.clipboard.writeText(reportUrl).then(() => {
      toast({
        title: "Link copied",
        description: "Report link has been copied to clipboard",
      });
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast({
      title: "Report Download Started",
      description: "Your report is being generated and will download shortly.",
    });
    
    // Simulate download after a delay
    setTimeout(() => {
      // Create a blob that simulates a PDF file
      const blob = new Blob([`Report ${id} content would go here`], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // Create a link element and trigger a download
      const link = document.createElement('a');
      link.href = url;
      link.download = `report-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 1000);
  };

  const handleShare = () => {
    // Modern browsers have a Web Share API that we can use
    if (navigator.share) {
      navigator.share({
        title: report?.name || 'Report',
        text: report?.description || 'Check out this report',
        url: window.location.href,
      }).catch((error) => {
        toast({
          title: "Share failed",
          description: "Unable to share report",
        });
      });
    } else {
      // Fallback to copy link
      handleCopyLink();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
          <p className="mt-4 text-muted-foreground">Loading report details...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate('/reports')} className="mr-2">
            <ChevronLeft size={18} />
            Back
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>Failed to load report details</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Unable to retrieve report information. The report may have been deleted or you may not have permission to view it.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Error details: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/reports')}>Return to Reports</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Extract useful data from the report
  const reportData = report.data || {};
  const properties = reportData.properties || [];
  const reportStatus = report.status || 'draft';

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate('/reports')} className="mr-2">
            <ChevronLeft size={18} />
            Back
          </Button>
          <h1 className="text-2xl font-bold">{report.name}</h1>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyLink}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Link
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button size="sm">
            <PenLine className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Report Details</CardTitle>
                  <CardDescription className="mt-1">{report.description || 'No description provided'}</CardDescription>
                </div>
                <Badge className="capitalize">{reportStatus}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Report ID</p>
                    <p className="text-sm text-muted-foreground">{report.report_id}</p>
                  </div>
                </div>
                
                {template && (
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Template</p>
                      <p className="text-sm text-muted-foreground">{template.name}</p>
                    </div>
                  </div>
                )}
                
                {creator && (
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Created By</p>
                      <p className="text-sm text-muted-foreground">
                        {creator.first_name} {creator.last_name}
                        {creator.role && <span className="ml-1 text-xs">({creator.role})</span>}
                      </p>
                    </div>
                  </div>
                )}
                
                {report.created_at && (
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Created On</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(report.created_at).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <Separator className="my-6" />
              
              {/* Report Preview Area */}
              <div className="bg-muted p-6 rounded-lg border mt-6">
                <h3 className="font-medium mb-4 text-lg">Report Preview</h3>
                
                {properties.length > 0 ? (
                  <div className="space-y-4">
                    {properties.map((property: any, index: number) => (
                      <div key={index} className="p-4 bg-background rounded-md">
                        <h4 className="font-medium">{property.name || `Property ${index + 1}`}</h4>
                        {property.address && <p className="text-sm text-muted-foreground">{property.address}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p>This report contains no property data or is using a custom format.</p>
                    <Button variant="outline" className="mt-4">View Full Report</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="history" className="mt-6">
            <TabsList>
              <TabsTrigger value="history">Version History</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="sharing">Sharing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="history" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Report History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {report.updated_at && (
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <p className="font-medium">Updated</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(report.updated_at).toLocaleDateString('en-US', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <Badge variant="outline">Current</Badge>
                      </div>
                    )}
                    
                    {report.created_at && (
                      <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                        <div>
                          <p className="font-medium">Created</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(report.created_at).toLocaleDateString('en-US', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <Badge variant="outline">Initial</Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="comments" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Report Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-6">No comments have been added to this report.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Add Comment</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="sharing" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sharing Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Public Access</p>
                        <p className="text-sm text-muted-foreground">Anyone with the link can view</p>
                      </div>
                      <Badge variant="destructive">Disabled</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Team Access</p>
                        <p className="text-sm text-muted-foreground">All team members can access</p>
                      </div>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Change Sharing Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Report Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" disabled={reportStatus === 'published'}>
                Publish Report
              </Button>
              <Button variant="outline" className="w-full">
                Clone Report
              </Button>
              <Button variant="outline" className="w-full">
                Export as PDF
              </Button>
              <Button variant="outline" className="w-full">
                Export as CSV
              </Button>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Report Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="flex justify-between">
                  <dt className="font-medium">Status:</dt>
                  <dd><Badge className="capitalize">{reportStatus}</Badge></dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="font-medium">Properties:</dt>
                  <dd>{properties.length}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="font-medium">Last Updated:</dt>
                  <dd>{report.updated_at ? new Date(report.updated_at).toLocaleDateString() : 'N/A'}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="font-medium">Report Type:</dt>
                  <dd>{template?.name || 'Custom'}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Related Items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-4">No related items found for this report.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
