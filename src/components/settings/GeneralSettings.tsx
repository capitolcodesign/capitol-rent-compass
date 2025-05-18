
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Save } from 'lucide-react';

interface GeneralSettingsProps {
  user: { id: string } | null;
  appSettings?: Record<string, any>;
  refetchSettings: () => void;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({ user, appSettings, refetchSettings }) => {
  const { toast } = useToast();
  const [operationalStart, setOperationalStart] = useState(appSettings?.operational_hours?.start || '08:00');
  const [operationalEnd, setOperationalEnd] = useState(appSettings?.operational_hours?.end || '17:00');
  const [maintenanceMode, setMaintenanceMode] = useState(appSettings?.maintenance_mode?.enabled || false);
  const [maintenanceMessage, setMaintenanceMessage] = useState(appSettings?.maintenance_mode?.message || 'System under maintenance. Please check back later.');

  // Save settings handler for operational hours
  const saveOperationalHours = async () => {
    if (!user?.id) {
      toast({
        title: 'Access Denied',
        description: 'Only authenticated users can change settings.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await supabase
        .from('app_settings')
        .update({ 
          value: { start: operationalStart, end: operationalEnd, timezone: "America/Los_Angeles" },
          updated_by: user.id
        })
        .eq('key', 'operational_hours');
        
      toast({
        title: 'Settings Updated',
        description: 'Operational hours have been saved successfully.',
      });
      refetchSettings();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to save settings: ${(error as Error).message}`,
        variant: 'destructive',
      });
    }
  };

  // Save settings handler for maintenance mode
  const saveMaintenanceMode = async () => {
    if (!user?.id) {
      toast({
        title: 'Access Denied',
        description: 'Only authenticated users can change settings.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await supabase
        .from('app_settings')
        .update({ 
          value: { enabled: maintenanceMode, message: maintenanceMessage },
          updated_by: user.id
        })
        .eq('key', 'maintenance_mode');
        
      toast({
        title: 'Settings Updated',
        description: 'Maintenance mode settings have been saved successfully.',
      });
      refetchSettings();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to save settings: ${(error as Error).message}`,
        variant: 'destructive',
      });
    }
  };

  return (
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
          <Button onClick={saveOperationalHours}>
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
          <Button onClick={saveMaintenanceMode}>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
