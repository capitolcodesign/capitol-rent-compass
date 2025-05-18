
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { Palette, RefreshCw, Save } from "lucide-react";

const COLOR_PRESETS = [
  { name: "SHRA Orange", primary: "#FF5C35", secondary: "#1A2C38" },
  { name: "Skyline Blue", primary: "#0EA5E9", secondary: "#0F172A" },
  { name: "Forest Green", primary: "#16A34A", secondary: "#1E293B" },
  { name: "Royal Purple", primary: "#8B5CF6", secondary: "#1E1E24" },
  { name: "Ruby Red", primary: "#E11D48", secondary: "#1C1917" },
];

export function ThemeCustomizer() {
  const { user } = useAuth();
  const [primaryColor, setPrimaryColor] = useState("#FF5C35");
  const [secondaryColor, setSecondaryColor] = useState("#1A2C38");
  const [logoSize, setLogoSize] = useState(40);
  const [isLoading, setIsLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState("/lovable-uploads/33c86c21-a65a-47cc-bc48-c84732a3e5fd.png");
  const [newLogoUrl, setNewLogoUrl] = useState("");

  // Fetch existing theme settings
  React.useEffect(() => {
    const fetchThemeSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("app_settings")
          .select("value")
          .eq("key", "theme_settings")
          .single();
        
        if (error) throw error;
        
        if (data?.value) {
          const theme = data.value;
          setPrimaryColor(theme.primaryColor || "#FF5C35");
          setSecondaryColor(theme.secondaryColor || "#1A2C38");
          setLogoSize(theme.logoSize || 40);
          setLogoUrl(theme.logoUrl || "/lovable-uploads/33c86c21-a65a-47cc-bc48-c84732a3e5fd.png");
        }
      } catch (err) {
        console.error("Error fetching theme settings:", err);
      }
    };
    
    fetchThemeSettings();
  }, []);

  const applyTheme = () => {
    // Apply theme to CSS variables
    document.documentElement.style.setProperty('--element-orange', primaryColor);
    document.documentElement.style.setProperty('--element-navy', secondaryColor);
    
    // You would need to set up these CSS variables in your global CSS
    
    // Show toast notification
    toast({
      title: "Theme Applied",
      description: "The theme changes have been applied to the UI.",
    });
  };

  const saveTheme = async () => {
    if (!user?.role === 'admin') {
      toast({
        title: "Permission Denied",
        description: "Only administrators can save theme settings.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const themeSettings = {
        primaryColor,
        secondaryColor,
        logoSize,
        logoUrl: newLogoUrl || logoUrl,
      };
      
      const { error } = await supabase
        .from("app_settings")
        .upsert({ 
          key: "theme_settings", 
          value: themeSettings,
          updated_by: user?.id,
        }, { onConflict: 'key' });
      
      if (error) throw error;
      
      // If a new logo URL is provided, update it
      if (newLogoUrl) {
        setLogoUrl(newLogoUrl);
        setNewLogoUrl("");
      }
      
      // Apply theme
      applyTheme();
      
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
        <div className="space-y-4">
          <div>
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex gap-2 mt-1.5">
              <div
                className="h-10 w-10 rounded cursor-pointer border"
                style={{ backgroundColor: primaryColor }}
                onClick={() => document.getElementById("primaryColor")?.click()}
              />
              <Input
                id="primaryColor"
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <div className="flex gap-2 mt-1.5">
              <div
                className="h-10 w-10 rounded cursor-pointer border"
                style={{ backgroundColor: secondaryColor }}
                onClick={() => document.getElementById("secondaryColor")?.click()}
              />
              <Input
                id="secondaryColor"
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Color Presets</Label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  className="flex-col h-auto py-2"
                  onClick={() => {
                    setPrimaryColor(preset.primary);
                    setSecondaryColor(preset.secondary);
                  }}
                >
                  <div className="flex space-x-1 mb-1">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: preset.primary }} />
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: preset.secondary }} />
                  </div>
                  <span className="text-xs">{preset.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div>
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              placeholder="Enter URL for your logo"
              value={newLogoUrl}
              onChange={(e) => setNewLogoUrl(e.target.value)}
              className="mt-1.5"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="logoSize">Logo Size ({logoSize}px)</Label>
            </div>
            <Slider
              id="logoSize"
              min={20}
              max={80}
              step={2}
              defaultValue={[logoSize]}
              onValueChange={(value) => setLogoSize(value[0])}
            />
          </div>

          <div className="mt-4 border rounded-md p-4 flex items-center justify-center bg-muted/30">
            <div style={{ maxWidth: `${logoSize * 4}px` }}>
              <img
                src={newLogoUrl || logoUrl}
                alt="Logo Preview"
                className="max-w-full h-auto"
                style={{ maxHeight: `${logoSize}px` }}
                onError={(e) => {
                  e.currentTarget.src = "/lovable-uploads/33c86c21-a65a-47cc-bc48-c84732a3e5fd.png";
                  if (newLogoUrl) {
                    toast({
                      title: "Invalid Logo URL",
                      description: "Could not load the logo from the provided URL.",
                      variant: "destructive",
                    });
                    setNewLogoUrl("");
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Preview Theme
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Theme Preview</h4>
                <div className="grid gap-2">
                  <div className="space-y-2">
                    <div className="h-5 w-full rounded" style={{ backgroundColor: primaryColor }} />
                    <div className="h-5 w-full rounded" style={{ backgroundColor: secondaryColor }} />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-2">
                      <div className="h-5 w-full rounded-sm" style={{ backgroundColor: primaryColor, opacity: 0.8 }} />
                      <div className="h-5 w-full rounded-sm" style={{ backgroundColor: primaryColor, opacity: 0.6 }} />
                      <div className="h-5 w-full rounded-sm" style={{ backgroundColor: primaryColor, opacity: 0.4 }} />
                    </div>
                    <div className="space-y-2">
                      <div className="h-5 w-full rounded-sm" style={{ backgroundColor: secondaryColor, opacity: 0.8 }} />
                      <div className="h-5 w-full rounded-sm" style={{ backgroundColor: secondaryColor, opacity: 0.6 }} />
                      <div className="h-5 w-full rounded-sm" style={{ backgroundColor: secondaryColor, opacity: 0.4 }} />
                    </div>
                    <div className="space-y-2">
                      <div className="h-5 w-full rounded-sm bg-gray-200" />
                      <div className="h-5 w-full rounded-sm bg-gray-300" />
                      <div className="h-5 w-full rounded-sm bg-gray-400" />
                    </div>
                  </div>
                </div>
                <Button className="w-full" onClick={applyTheme}>
                  Apply Preview
                </Button>
              </div>
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
