import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Link, Map, Users } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ApiIntegration } from '@/types/rental-fairness';
import { User } from '@/contexts/auth/types';

interface IntegrationSettingsProps {
  user: User | null;
  integrations: Record<string, any> | undefined;
  refetchIntegrations: () => void;
  isLoading: boolean;
}

const IntegrationSettings: React.FC<IntegrationSettingsProps> = ({
  user,
  integrations,
  refetchIntegrations,
  isLoading
}) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState<boolean>(false);
  
  // Configuration for all integration APIs
  const integrationConfig: ApiIntegration[] = [
    // Maps/Location APIs
    {
      name: 'Google Maps API',
      key: 'google_maps_api_key',
      enabled: Boolean(integrations?.google_maps_api_key),
      description: 'Enable address autocomplete and mapping features',
      category: 'maps'
    },
    // Property Management APIs
    {
      name: 'Zillow API',
      key: 'zillow_api_key',
      enabled: Boolean(integrations?.zillow_api_key),
      description: 'Access property valuation and market data',
      category: 'property'
    },
    {
      name: 'Redfin API',
      key: 'redfin_api_key',
      enabled: Boolean(integrations?.redfin_api_key),
      description: 'Real-time property listings and market insights',
      category: 'property'
    },
    {
      name: 'Apartment List API',
      key: 'apartment_list_api_key',
      enabled: Boolean(integrations?.apartment_list_api_key),
      description: 'Rental listing data and apartment information',
      category: 'property'
    },
    {
      name: 'MLS Integration',
      key: 'mls_api_key',
      enabled: Boolean(integrations?.mls_api_key),
      description: 'Connect to Multiple Listing Service data',
      category: 'property'
    },
    // Demographic APIs
    {
      name: 'U.S. Census API',
      key: 'census_api_key',
      enabled: Boolean(integrations?.census_api_key),
      description: 'Access demographic and economic data',
      category: 'demographic'
    },
    {
      name: 'HUD Open Data API',
      key: 'hud_api_key',
      enabled: Boolean(integrations?.hud_api_key),
      description: 'Housing and Urban Development data access',
      category: 'demographic'
    },
    {
      name: 'ATTOM Property Data API',
      key: 'attom_api_key',
      enabled: Boolean(integrations?.attom_api_key),
      description: 'Property and neighborhood data analytics',
      category: 'property'
    },
    // Other APIs
    {
      name: 'Plaid API',
      key: 'plaid_api_key',
      enabled: Boolean(integrations?.plaid_api_key),
      description: 'Financial data integration for tenant screening',
      category: 'other'
    },
    {
      name: 'TransUnion API',
      key: 'transunion_api_key',
      enabled: Boolean(integrations?.transunion_api_key),
      description: 'Credit and background checking for tenants',
      category: 'other'
    },
  ];
  
  const handleSaveApiKey = async (key: string, value: string, enabled: boolean) => {
    if (!user || user.role !== 'admin') {
      toast({
        title: "Permission Denied",
        description: "Only administrators can modify integration settings.",
        variant: "destructive"
      });
      return;
    }
    
    setSaving(true);
    
    try {
      // Only store the key if it's enabled and has a value
      if (enabled && value) {
        await supabase
          .from('app_settings')
          .upsert({ 
            key: key, 
            value: value,
            updated_by: user.id,
            updated_at: new Date().toISOString()
          }, { 
            onConflict: 'key' 
          });
          
        toast({
          title: "API Key Saved",
          description: `The ${key.replace('_', ' ')} has been updated successfully.`
        });
      } else if (!enabled) {
        // If disabled, remove the key
        await supabase
          .from('app_settings')
          .delete()
          .match({ key: key });
          
        toast({
          title: "API Integration Disabled",
          description: `The ${key.replace('_', ' ')} has been removed.`
        });
      }
      
      refetchIntegrations();
    } catch (error) {
      console.error("Error saving API key:", error);
      toast({
        title: "Error",
        description: "Failed to save API key. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleToggleIntegration = async (integration: ApiIntegration, enabled: boolean) => {
    const currentValue = integrations?.[integration.key] || '';
    
    if (enabled && !currentValue) {
      toast({
        title: "API Key Required",
        description: `Please enter an API key for ${integration.name} before enabling.`
      });
      return;
    }
    
    await handleSaveApiKey(integration.key, currentValue, enabled);
  };
  
  const handleInputChange = async (integration: ApiIntegration, value: string) => {
    if (!value && integration.enabled) {
      // If clearing the key, disable the integration
      await handleSaveApiKey(integration.key, '', false);
    }
    
    // Store the new value in the form state
    const tempIntegrations = {...integrations, [integration.key]: value};
    
    // Update the local state or context that holds integrations
    // This is handled by the parent component through refetchIntegrations()
  };
  
  const renderIntegrationCard = (integration: ApiIntegration) => {
    const value = integrations?.[integration.key] || '';
    
    return (
      <Card key={integration.key} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{integration.name}</CardTitle>
            <Switch 
              checked={integration.enabled}
              onCheckedChange={(checked) => handleToggleIntegration(integration, checked)}
              disabled={saving}
            />
          </div>
          <CardDescription>{integration.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor={integration.key} className="min-w-[80px]">API Key</Label>
              <div className="flex-1">
                <Input
                  id={integration.key}
                  type="password"
                  value={value}
                  onChange={(e) => handleInputChange(integration, e.target.value)}
                  placeholder={`Enter ${integration.name} API key`}
                />
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleSaveApiKey(integration.key, value, true)}
                disabled={saving || !value}
              >
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  if (isLoading) {
    return <div className="py-4">Loading integration settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">API Integrations</h3>
          <p className="text-sm text-muted-foreground">
            Manage third-party API connections for enhanced functionality.
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="maps">
        <TabsList>
          <TabsTrigger value="property" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>Property Data</span>
          </TabsTrigger>
          <TabsTrigger value="maps" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            <span>Maps & Location</span>
          </TabsTrigger>
          <TabsTrigger value="demographic" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Demographics</span>
          </TabsTrigger>
          <TabsTrigger value="other" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            <span>Other</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="maps" className="pt-4">
          {integrationConfig.filter(i => i.category === 'maps').map(renderIntegrationCard)}
        </TabsContent>
        
        <TabsContent value="property" className="pt-4">
          {integrationConfig.filter(i => i.category === 'property').map(renderIntegrationCard)}
        </TabsContent>
        
        <TabsContent value="demographic" className="pt-4">
          {integrationConfig.filter(i => i.category === 'demographic').map(renderIntegrationCard)}
        </TabsContent>
        
        <TabsContent value="other" className="pt-4">
          {integrationConfig.filter(i => i.category === 'other').map(renderIntegrationCard)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationSettings;
