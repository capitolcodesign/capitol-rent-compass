
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { 
  Settings as SettingsIcon, 
  Save, 
  AlertTriangle, 
  Users, 
  Palette,
  Building, 
  Trash2
} from 'lucide-react';
import { ThemeCustomizer } from '@/components/admin/ThemeCustomizer';
import { UserRoleManagement } from '@/components/admin/UserRoleManagement';
import { ConfirmActionDialog } from '@/components/admin/ConfirmActionDialog';

const Settings: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'admin';
  
  // State for app settings
  const [operationalStart, setOperationalStart] = useState('08:00');
  const [operationalEnd, setOperationalEnd] = useState('17:00');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('System under maintenance. Please check back later.');
  const [footerText, setFooterText] = useState('SHRA Rent Reasonableness System Report');
  
  // State for property management
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isDeletePropertyDialogOpen, setIsDeletePropertyDialogOpen] = useState(false);
  const [isDeletingProperty, setIsDeletingProperty] = useState(false);
  
  // Fetch app settings from Supabase
  const { data: appSettings, isLoading: isLoadingSettings, error: settingsError, refetch: refetchSettings } = useQuery({
    queryKey: ['app_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('key, value');
      
      if (error) throw error;
      
      // Convert array to object for easier access
      const settings: Record<string, any> = {};
      data.forEach(item => {
        settings[item.key] = item.value;
      });
      
      // Set local state from fetched settings
      if (settings.operational_hours) {
        setOperationalStart(settings.operational_hours.start);
        setOperationalEnd(settings.operational_hours.end);
      }
      
      if (settings.maintenance_mode) {
        setMaintenanceMode(settings.maintenance_mode.enabled);
        setMaintenanceMessage(settings.maintenance_mode.message);
      }
      
      if (settings.report_settings) {
        setFooterText(settings.report_settings.footer_text);
      }
      
      return settings;
    }
  });
  
  // Fetch properties for property management
  const { data: properties, isLoading: isLoadingProperties, refetch: refetchProperties } = useQuery({
    queryKey: ['properties_admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('id, name, address, type, units');
      
      if (error) throw error;
      return data || [];
    },
    enabled: isAdmin,
  });
  
  // Fetch users for user management
  const { data: users, isLoading: isLoadingUsers, refetch: refetchUsers } = useQuery({
    queryKey: ['users_admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      
      // Convert to User type
      return data?.map(profile => ({
        id: profile.id,
        email: `user-${profile.id.substring(0, 8)}@example.com`, // Placeholder
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        role: profile.role || 'staff',
        created_at: profile.created_at
      })) || [];
    },
    enabled: isAdmin,
  });
  
  // Show error if fetch fails
  React.useEffect(() => {
    if (settingsError) {
      toast({
        title: 'Error',
        description: `Failed to load settings: ${(settingsError as Error).message}`,
        variant: 'destructive',
      });
    }
  }, [settingsError, toast]);
  
  // Save settings handler
  const saveSettings = async (settingType: string) => {
    if (!isAdmin) {
      toast({
        title: 'Access Denied',
        description: 'Only administrators can change settings.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      switch (settingType) {
        case 'operational_hours':
          await supabase
            .from('app_settings')
            .update({ 
              value: { start: operationalStart, end: operationalEnd, timezone: "America/Los_Angeles" },
              updated_by: user?.id
            })
            .eq('key', 'operational_hours');
          break;
          
        case 'maintenance_mode':
          await supabase
            .from('app_settings')
            .update({ 
              value: { enabled: maintenanceMode, message: maintenanceMessage },
              updated_by: user?.id
            })
            .eq('key', 'maintenance_mode');
          break;
          
        case 'report_settings':
          await supabase
            .from('app_settings')
            .update({ 
              value: { 
                logo_url: appSettings?.report_settings?.logo_url || "/lovable-uploads/33c86c21-a65a-47cc-bc48-c84732a3e5fd.png", 
                footer_text: footerText 
              },
              updated_by: user?.id
            })
            .eq('key', 'report_settings');
          break;
      }
      
      toast({
        title: 'Settings Updated',
        description: 'Your changes have been saved successfully.',
      });
      
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to save settings: ${(error as Error).message}`,
        variant: 'destructive',
      });
    }
  };
  
  const handleDeleteProperty = async () => {
    if (!selectedPropertyId) return;
    
    setIsDeletingProperty(true);
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', selectedPropertyId);
        
      if (error) throw error;
      
      toast({
        title: "Property Deleted",
        description: "The property has been successfully deleted.",
      });
      
      refetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Delete Failed",
        description: `Failed to delete property: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsDeletingProperty(false);
      setIsDeletePropertyDialogOpen(false);
      setSelectedPropertyId(null);
    }
  };
  
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <AlertTriangle className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-2xl font-bold mb-2">Access Restricted</h3>
        <p className="text-muted-foreground">
          You don't have permission to access application settings.
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Configure application settings and preferences
          </p>
        </div>
        <SettingsIcon className="h-8 w-8 text-muted-foreground" />
      </div>
      
      <Tabs defaultValue="general" className="mb-6">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="access">Access</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="pt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Operational Hours</CardTitle>
                <CardDescription>
                  Set the operational hours for the application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="operationalStart">Start Time</Label>
                    <Input
                      id="operationalStart"
                      type="time"
                      value={operationalStart}
                      onChange={(e) => setOperationalStart(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="operationalEnd">End Time</Label>
                    <Input
                      id="operationalEnd"
                      type="time"
                      value={operationalEnd}
                      onChange={(e) => setOperationalEnd(e.target.value)}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  All times are in Pacific Time (PT). Users outside operational hours will see a maintenance banner.
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={() => saveSettings('operational_hours')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Hours
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Mode</CardTitle>
                <CardDescription>
                  Enable maintenance mode to restrict access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <Switch 
                    checked={maintenanceMode} 
                    onCheckedChange={setMaintenanceMode} 
                    id="maintenance-mode" 
                  />
                  <Label htmlFor="maintenance-mode" className="font-medium">
                    {maintenanceMode ? 'Enabled' : 'Disabled'}
                  </Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                  <Textarea
                    id="maintenanceMessage"
                    placeholder="Enter message to display during maintenance"
                    value={maintenanceMessage}
                    onChange={(e) => setMaintenanceMessage(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-amber-500 flex items-center">
                  {maintenanceMode && (
                    <>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">
                        System is in maintenance mode
                      </span>
                    </>
                  )}
                </div>
                <Button onClick={() => saveSettings('maintenance_mode')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="access" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage user permissions and roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingUsers ? (
                <div className="flex justify-center p-6">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {users && users.length > 0 ? (
                    users.map(userItem => (
                      <div key={userItem.id} className="p-4 border rounded-lg">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-medium">{userItem.firstName} {userItem.lastName}</h3>
                            <p className="text-sm text-muted-foreground">{userItem.email}</p>
                          </div>
                        </div>
                        
                        <UserRoleManagement 
                          user={userItem} 
                          onUpdate={refetchUsers}
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-6">
                      No users found. Add users to manage their roles.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="theme" className="pt-6">
          <ThemeCustomizer />
        </TabsContent>
        
        <TabsContent value="properties" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5" />
                Property Management
              </CardTitle>
              <CardDescription>
                Manage property listings in the database
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingProperties ? (
                <div className="flex justify-center p-6">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {properties && properties.length > 0 ? (
                    properties.map(property => (
                      <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{property.name}</h3>
                          <p className="text-sm text-muted-foreground">{property.address}</p>
                          <div className="flex gap-2 mt-1">
                            <span className="text-xs bg-muted px-2 py-1 rounded-md">{property.type}</span>
                            <span className="text-xs bg-muted px-2 py-1 rounded-md">{property.units} units</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              setSelectedPropertyId(property.id);
                              setIsDeletePropertyDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-2">Delete</span>
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-6">
                      No properties found.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          <ConfirmActionDialog
            open={isDeletePropertyDialogOpen}
            onClose={() => setIsDeletePropertyDialogOpen(false)}
            onConfirm={handleDeleteProperty}
            title="Delete Property"
            description="Are you sure you want to delete this property? This action cannot be undone and will remove all data associated with this property."
            confirmLabel="Delete Property"
            variant="destructive"
            loading={isDeletingProperty}
          />
        </TabsContent>
        
        <TabsContent value="reports" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Settings</CardTitle>
              <CardDescription>
                Configure report generation settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="footerText">Report Footer Text</Label>
                  <Input
                    id="footerText"
                    placeholder="Enter text to appear in the footer of all reports"
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                  />
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <Label>Report Logo</Label>
                  <div className="h-20 w-40 border rounded p-2 flex items-center justify-center bg-gray-50">
                    <img
                      src={appSettings?.report_settings?.logo_url || "/lovable-uploads/33c86c21-a65a-47cc-bc48-c84732a3e5fd.png"}
                      alt="Report Logo"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Logo management is available in the Theme tab.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => saveSettings('report_settings')}>
                <Save className="h-4 w-4 mr-2" />
                Save Report Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
