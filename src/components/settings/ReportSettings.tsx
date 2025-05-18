
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Save } from 'lucide-react';

interface ReportSettingsProps {
  user: { id: string } | null;
  appSettings?: Record<string, any>;
  refetchSettings: () => void;
}

export const ReportSettings: React.FC<ReportSettingsProps> = ({ 
  user, 
  appSettings, 
  refetchSettings 
}) => {
  const { toast } = useToast();
  const [footerText, setFooterText] = useState(
    appSettings?.report_settings?.footer_text || 'SHRA Rent Reasonableness System Report'
  );
  const logoUrl = appSettings?.report_settings?.logo_url || "/lovable-uploads/33c86c21-a65a-47cc-bc48-c84732a3e5fd.png";

  const saveReportSettings = async () => {
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
          value: { 
            logo_url: logoUrl, 
            footer_text: footerText 
          },
          updated_by: user.id
        })
        .eq('key', 'report_settings');
        
      toast({
        title: 'Settings Updated',
        description: 'Report settings have been saved successfully.',
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
                src={logoUrl}
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
        <Button onClick={saveReportSettings}>
          <Save className="h-4 w-4 mr-2" />
          Save Report Settings
        </Button>
      </CardFooter>
    </Card>
  );
};
