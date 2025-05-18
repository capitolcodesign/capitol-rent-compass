
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { AlertTriangle, Settings as SettingsIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeCustomizer } from '@/components/admin/ThemeCustomizer';
import { GeneralSettings } from '@/components/settings/GeneralSettings';
import { AccessSettings } from '@/components/settings/AccessSettings';
import { PropertySettings } from '@/components/settings/PropertySettings';
import { ReportSettings } from '@/components/settings/ReportSettings';
import { User, UserRole } from '@/contexts/auth/types';

// Create an extended User interface for display purposes
interface UserDisplay extends User {
  created_at: string;
}

const Settings: React.FC = () => {
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'admin';
  
  // Fetch app settings from Supabase
  const { data: appSettings, isLoading: isLoadingSettings, refetch: refetchSettings } = useQuery({
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
      return data?.map(profile => {
        // Ensure role is a valid UserRole
        const role = (profile.role || 'staff') as UserRole;
        
        return {
          id: profile.id,
          email: `user-${profile.id.substring(0, 8)}@example.com`, // Placeholder
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          role, // Now typed correctly as UserRole
          created_at: profile.created_at
        } as UserDisplay;
      }) || [];
    },
    enabled: isAdmin,
  });
  
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
          <GeneralSettings 
            user={user} 
            appSettings={appSettings} 
            refetchSettings={refetchSettings} 
          />
        </TabsContent>
        
        <TabsContent value="access" className="pt-6">
          <AccessSettings 
            users={users} 
            isLoading={isLoadingUsers} 
            refetchUsers={refetchUsers} 
          />
        </TabsContent>
        
        <TabsContent value="theme" className="pt-6">
          <ThemeCustomizer />
        </TabsContent>
        
        <TabsContent value="properties" className="pt-6">
          <PropertySettings 
            properties={properties} 
            isLoading={isLoadingProperties} 
            refetchProperties={refetchProperties} 
          />
        </TabsContent>
        
        <TabsContent value="reports" className="pt-6">
          <ReportSettings 
            user={user} 
            appSettings={appSettings} 
            refetchSettings={refetchSettings} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
