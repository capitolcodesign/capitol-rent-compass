
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  FileText, 
  Map, 
  Home, 
  Check,
  Plus,
  ArrowRight
} from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const propertySchema = z.object({
  address: z.string().min(1, { message: "Address is required" }),
  propertyType: z.string().min(1, { message: "Property type is required" }),
  bedrooms: z.string().min(1, { message: "Bedrooms is required" }),
  bathrooms: z.string().min(1, { message: "Bathrooms is required" }),
  squareFeet: z.string().min(1, { message: "Square footage is required" }),
  rentAmount: z.string().min(1, { message: "Requested rent is required" }),
  notes: z.string().optional()
});

type PropertyValues = z.infer<typeof propertySchema>;

const RentAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<PropertyValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      address: '',
      propertyType: '',
      bedrooms: '',
      bathrooms: '',
      squareFeet: '',
      rentAmount: '',
      notes: ''
    },
  });
  
  const nextStep = () => {
    if (step === 1) {
      form.trigger(['address', 'propertyType', 'bedrooms', 'bathrooms', 'squareFeet', 'rentAmount']);
      const isValid = !form.formState.errors.address && 
                     !form.formState.errors.propertyType && 
                     !form.formState.errors.bedrooms && 
                     !form.formState.errors.bathrooms && 
                     !form.formState.errors.squareFeet &&
                     !form.formState.errors.rentAmount;
      
      if (isValid) {
        setStep(2);
      } else {
        toast({
          title: "Invalid Form",
          description: "Please fill in all required fields correctly.",
          variant: "destructive"
        });
      }
    } else if (step === 2) {
      setStep(3);
    }
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  const onSubmit = (data: PropertyValues) => {
    toast({
      title: "Analysis Complete",
      description: "Your rent reasonableness analysis has been generated!",
    });
    
    // In a real implementation, you would submit this data to Supabase
    console.log("Form data:", data);
    
    // Reset form and go back to step 1
    form.reset();
    setStep(1);
  };

  // Function to handle the button click that completes the analysis
  const handleCompleteAnalysis = () => {
    const formData = form.getValues();
    onSubmit(formData);
  };
  
  const handleAddressSelect = (address: any) => {
    form.setValue('address', address.full);
  };
  
  const renderStepOne = () => (
    <div className="space-y-6">
      <div className="bg-muted/30 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium mb-2">Subject Property Information</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Enter details about the property you want to analyze for rent reasonableness
        </p>
        
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Address</FormLabel>
                  <FormControl>
                    <AddressAutocomplete
                      onAddressSelect={handleAddressSelect}
                      defaultValue={field.value}
                      placeholder="Search for the property address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="duplex">Duplex</SelectItem>
                        <SelectItem value="townhouse">Townhouse</SelectItem>
                        <SelectItem value="condo">Condominium</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number of bedrooms" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Studio</SelectItem>
                        <SelectItem value="1">1 Bedroom</SelectItem>
                        <SelectItem value="2">2 Bedrooms</SelectItem>
                        <SelectItem value="3">3 Bedrooms</SelectItem>
                        <SelectItem value="4">4 Bedrooms</SelectItem>
                        <SelectItem value="5">5+ Bedrooms</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number of bathrooms" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1 Bathroom</SelectItem>
                        <SelectItem value="1.5">1.5 Bathrooms</SelectItem>
                        <SelectItem value="2">2 Bathrooms</SelectItem>
                        <SelectItem value="2.5">2.5 Bathrooms</SelectItem>
                        <SelectItem value="3">3 Bathrooms</SelectItem>
                        <SelectItem value="3.5">3.5+ Bathrooms</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="squareFeet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Square Footage</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter square footage"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="rentAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requested Monthly Rent ($)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter requested rent amount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter any additional notes about the property"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
          </form>
        </Form>
      </div>
      <div className="flex justify-end">
        <Button onClick={nextStep}>
          Find Comparable Properties
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
  
  const renderStepTwo = () => (
    <div className="space-y-6">
      <div className="bg-muted/30 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium mb-2">Comparable Properties</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select comparable properties to include in your analysis
        </p>
        
        <div className="space-y-4">
          {/* Demo comparable properties */}
          {[
            {
              id: 'comp-1',
              address: '456 Elm Ave, Sacramento, CA 95825',
              type: 'Apartment',
              bedrooms: '2',
              bathrooms: '1',
              sqft: '950',
              rent: '1450',
              distance: '0.5'
            },
            {
              id: 'comp-2',
              address: '789 Pine Rd, Sacramento, CA 95833',
              type: 'Apartment',
              bedrooms: '2',
              bathrooms: '2',
              sqft: '1050',
              rent: '1550',
              distance: '0.8'
            },
            {
              id: 'comp-3',
              address: '101 Maple Dr, Sacramento, CA 95820',
              type: 'Duplex',
              bedrooms: '2',
              bathrooms: '1.5',
              sqft: '1100',
              rent: '1495',
              distance: '1.2'
            },
            {
              id: 'comp-4',
              address: '202 Cedar Ln, Sacramento, CA 95823',
              type: 'Apartment',
              bedrooms: '2',
              bathrooms: '1',
              sqft: '900',
              rent: '1400',
              distance: '1.5'
            },
          ].map(comp => (
            <Card key={comp.id} className="hover:border-primary/50 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{comp.address}</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">{comp.type}</Badge>
                      <Badge variant="outline">{comp.bedrooms} BR</Badge>
                      <Badge variant="outline">{comp.bathrooms} BA</Badge>
                      <Badge variant="outline">{comp.sqft} sqft</Badge>
                    </div>
                    <p className="text-sm mt-2">
                      <span className="font-medium">${comp.rent}</span>/month
                      <span className="text-muted-foreground ml-2">
                        {comp.distance} miles away
                      </span>
                    </p>
                  </div>
                  <div className="flex h-6 w-6 rounded-full border-2 border-primary items-center justify-center">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="flex justify-center mt-4">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Manual Comparable
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Back to Property Details
        </Button>
        <Button onClick={nextStep}>
          Generate Analysis
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
  
  const renderStepThree = () => (
    <div className="space-y-6">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                Based on 4 comparable properties within 1.5 miles
              </CardDescription>
            </div>
            <Badge className="text-lg py-1">
              Reasonable
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Subject Property</h3>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="font-medium">{form.getValues().address}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="font-medium">{form.getValues().propertyType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Bedrooms</p>
                    <p className="font-medium">{form.getValues().bedrooms}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Bathrooms</p>
                    <p className="font-medium">{form.getValues().bathrooms}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Square Feet</p>
                    <p className="font-medium">{form.getValues().squareFeet}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground">Requested Rent</p>
                  <p className="text-lg font-bold">${form.getValues().rentAmount}/month</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Rent Comparison</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Market Range</span>
                    <span className="text-sm font-medium">$1,400 - $1,550</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div 
                      className="h-2 bg-green-500 rounded-full" 
                      style={{ 
                        width: '70%', 
                        marginLeft: '15%' 
                      }} 
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Average Rent</span>
                    <span className="text-sm font-medium">$1,475</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Subject Rent</span>
                    <span className="text-sm font-medium">${form.getValues().rentAmount}</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
              </div>
              
              <div className="mt-6 p-3 border rounded-md bg-muted/10">
                <h4 className="font-medium">Conclusion</h4>
                <p className="text-sm mt-1">
                  The requested rent of ${form.getValues().rentAmount} falls within the reasonable range for similar properties 
                  in the area. The average rent for comparable units is $1,475, and the requested 
                  amount is within 5% of this average, making it reasonable according to HUD guidelines.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setStep(2)}>
            Back to Comparables
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => form.reset()}>
              <FileText className="h-4 w-4 mr-2" />
              Save as Report
            </Button>
            <Button onClick={handleCompleteAnalysis}>
              Complete Analysis
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
  
  const renderAnalysisContent = () => {
    switch (step) {
      case 1:
        return renderStepOne();
      case 2:
        return renderStepTwo();
      case 3:
        return renderStepThree();
      default:
        return renderStepOne();
    }
  };
  
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
          <Button onClick={() => {
            form.reset();
            setStep(1);
            setActiveTab("new");
          }}>New Analysis</Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="new">New Analysis</TabsTrigger>
          <TabsTrigger value="recent">Recent Analyses</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new" className="mt-4">
          {/* Steps indicator */}
          <div className="mb-6">
            <div className="flex justify-between">
              <div className="flex items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center
                  ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  1
                </div>
                <div className={`h-1 w-16 ${step > 1 ? 'bg-primary' : 'bg-muted'}`}></div>
              </div>
              <div className="flex items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center
                  ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  2
                </div>
                <div className={`h-1 w-16 ${step > 2 ? 'bg-primary' : 'bg-muted'}`}></div>
              </div>
              <div className="flex items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center
                  ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  3
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <div className={step >= 1 ? 'text-primary' : 'text-muted-foreground'}>
                Property Details
              </div>
              <div className={step >= 2 ? 'text-primary' : 'text-muted-foreground'}>
                Comparable Properties
              </div>
              <div className={step >= 3 ? 'text-primary' : 'text-muted-foreground'}>
                Analysis Results
              </div>
            </div>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              {renderAnalysisContent()}
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
              <div className="divide-y">
                {[
                  { 
                    id: 'A2025-101',
                    address: '123 Oak St, Sacramento, CA',
                    date: '2025-05-15',
                    rent: '1500',
                    result: 'Reasonable'
                  },
                  { 
                    id: 'A2025-100',
                    address: '456 Pine Ave, Sacramento, CA',
                    date: '2025-05-10',
                    rent: '2200',
                    result: 'Reasonable'
                  },
                  { 
                    id: 'A2025-099',
                    address: '789 Elm Dr, Sacramento, CA',
                    date: '2025-05-05',
                    rent: '2600',
                    result: 'Above Market'
                  }
                ].map(analysis => (
                  <div key={analysis.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{analysis.address}</p>
                        <div className="flex text-sm text-muted-foreground gap-4 mt-1">
                          <span>ID: {analysis.id}</span>
                          <span>Date: {analysis.date}</span>
                          <span>Rent: ${analysis.rent}</span>
                        </div>
                      </div>
                      <Badge variant={analysis.result === 'Reasonable' ? 'default' : 'destructive'}>
                        {analysis.result}
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-3 w-3 mr-1" />
                        View Analysis
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <Home className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Standard Apartment Analysis</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Default template for apartment units with standard amenities
                    </p>
                    <Button variant="outline" className="mt-4 w-full" size="sm">
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <Home className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Single-Family Home Analysis</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Template for analyzing single-family home rentals
                    </p>
                    <Button variant="outline" className="mt-4 w-full" size="sm">
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              </div>
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
