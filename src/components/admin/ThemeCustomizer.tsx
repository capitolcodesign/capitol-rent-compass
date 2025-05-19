
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth";
import { Palette, RefreshCw, Save } from "lucide-react";
import { ColorPicker } from "./theme/ColorPicker";
import { LogoSettings } from "./theme/LogoSettings";
import { ThemePreview } from "./theme/ThemePreview";
import {
  ThemeSettings,
  fetchThemeSettings,
  saveThemeSettings,
  applyTheme as applyThemeService,
} from "./theme/ThemeSettingsService";
import { useQueryClient } from '@tanstack/react-query';

export function ThemeCustomizer() {
  const { user } = useAuth();
  const [primaryColor, setPrimaryColor] = useState("#FF5C35");
  const [secondaryColor, setSecondaryColor] = useState("#1A2C38");
  const [logoSize, setLogoSize] = useState(40);
  const [isLoading, setIsLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState("/lovable-uploads/33c86c21-a65a-47cc-bc48-c84732a3e5fd.png");
  const [newLogoUrl, setNewLogoUrl] = useState("");
  const queryClient = useQueryClient();

  // Fetch existing theme settings
  useEffect(() => {
    const loadThemeSettings = async () => {
      const settings = await fetchThemeSettings();
      if (settings) {
        setPrimaryColor(settings.primaryColor);
        setSecondaryColor(settings.secondaryColor);
        setLogoSize(settings.logoSize);
        setLogoUrl(settings.logoUrl);
      }
    };
    
    loadThemeSettings();
  }, []);

  const applyTheme = () => {
    applyThemeService(primaryColor, secondaryColor);
  };

  const saveTheme = async () => {
    if (!user || user.role !== 'admin') {
      toast({
        title: "Permission Denied",
        description: "Only administrators can save theme settings.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const themeSettings: ThemeSettings = {
        primaryColor,
        secondaryColor,
        logoSize,
        logoUrl: newLogoUrl || logoUrl,
      };
      
      const success = await saveThemeSettings(themeSettings, user?.id);
      
      if (!success) throw new Error("Failed to save theme settings");
      
      // If a new logo URL is provided, update it
      if (newLogoUrl) {
        setLogoUrl(newLogoUrl);
        setNewLogoUrl("");
      }
      
      // Apply theme
      applyTheme();
      
      // Invalidate any queries that might depend on theme settings
      queryClient.invalidateQueries({ queryKey: ['app-settings'] });
      
      toast({
        title: "Theme Saved",
        description: "Your theme settings have been saved successfully.",
      });
    } catch (err) {
      console.error("Error saving theme:", err);
      toast({
        title: "Save Failed",
        description: "There was an error saving your theme settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Palette className="mr-2 h-5 w-5" />
          Theme Customization
        </CardTitle>
        <CardDescription>
          Customize the look and feel of your application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ColorPicker 
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          setPrimaryColor={setPrimaryColor}
          setSecondaryColor={setSecondaryColor}
        />

        <Separator />

        <LogoSettings 
          logoSize={logoSize}
          setLogoSize={setLogoSize}
          logoUrl={logoUrl}
          newLogoUrl={newLogoUrl}
          setNewLogoUrl={setNewLogoUrl}
        />

        <div className="flex justify-between mt-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Preview Theme
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <ThemePreview 
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                applyTheme={applyTheme}
              />
            </PopoverContent>
          </Popover>
          <Button onClick={saveTheme} disabled={isLoading}>
            {isLoading ? "Saving..." : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Theme Settings
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
