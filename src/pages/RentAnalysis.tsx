
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BarChart3, FileText, Map, Home } from 'lucide-react';

const RentAnalysis: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Rent Reasonableness Analysis</h1>
          <p className="text-muted-foreground">
            Compare and analyze rental properties against market standards
          </p>
        </div>
        <div>
          <Button>New Analysis</Button>
        </div>
      </div>
      
      <Tabs defaultValue="new" className="mb-6">
        <TabsList>
          <TabsTrigger value="new">New Analysis</TabsTrigger>
          <TabsTrigger value="recent">Recent Analyses</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Start a New Analysis</CardTitle>
              <CardDescription>
                Begin a new rent reasonableness comparison study by entering property details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                This page will provide the full rent reasonableness analysis interface, allowing users to:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 flex items-start space-x-3">
                    <Home className="h-8 w-8 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium mb-1">Enter Subject Property</h3>
                      <p className="text-sm text-muted-foreground">
                        Input details about the property to be analyzed
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex items-start space-x-3">
                    <Map className="h-8 w-8 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium mb-1">Find Comparables</h3>
                      <p className="text-sm text-muted-foreground">
                        Identify similar properties for comparison
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex items-start space-x-3">
                    <BarChart3 className="h-8 w-8 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium mb-1">Generate Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        Create detailed rent reasonableness report
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm italic text-center">
                  The full analysis interface will be implemented in future updates
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recent" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Analyses</CardTitle>
              <CardDescription>
                View and manage recently completed rent reasonableness studies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Your recent rent reasonableness analyses will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Templates</CardTitle>
              <CardDescription>
                Create and manage reusable analysis templates for common scenarios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Templates will allow for faster creation of standard analyses.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Study Metrics</CardTitle>
            <CardDescription>
              Rent reasonableness statistics from recent studies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Downtown</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Midtown</span>
                  <span className="text-sm font-medium">88%</span>
                </div>
                <Progress value={88} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">North Sacramento</span>
                  <span className="text-sm font-medium">95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">South Sacramento</span>
                  <span className="text-sm font-medium">91%</span>
                </div>
                <Progress value={91} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
            <CardDescription>
              Resources for conducting rent reasonableness studies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-3 border rounded-md hover:bg-muted/50 cursor-pointer">
                <FileText className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <h4 className="font-medium">HUD Guidelines</h4>
                  <p className="text-sm text-muted-foreground">Official HUD rent reasonableness requirements</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 border rounded-md hover:bg-muted/50 cursor-pointer">
                <FileText className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <h4 className="font-medium">SHRA Procedures Manual</h4>
                  <p className="text-sm text-muted-foreground">Agency-specific guidance for rent studies</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 border rounded-md hover:bg-muted/50 cursor-pointer">
                <FileText className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <h4 className="font-medium">Quick Start Guide</h4>
                  <p className="text-sm text-muted-foreground">Step-by-step tutorial for new users</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RentAnalysis;
