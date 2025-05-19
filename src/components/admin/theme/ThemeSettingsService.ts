
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  logoSize: number;
  logoUrl: string;
}

export const fetchThemeSettings = async (): Promise<ThemeSettings | null> => {
  try {
    const { data, error } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "theme_settings")
      .single();
    
    if (error) throw error;
    
    if (data?.value) {
      // Cast to unknown first, then to ThemeSettings to satisfy TypeScript
      const themeValue = data.value as unknown;
      const themeData = themeValue as Record<string, unknown>;
      
      if (
        typeof themeData.primaryColor === 'string' &&
        typeof themeData.secondaryColor === 'string' &&
        typeof themeData.logoSize === 'number' &&
        typeof themeData.logoUrl === 'string'
      ) {
        return {
          primaryColor: themeData.primaryColor,
          secondaryColor: themeData.secondaryColor,
          logoSize: themeData.logoSize,
          logoUrl: themeData.logoUrl
        };
      }
    }
    
    return null;
  } catch (err) {
    console.error("Error fetching theme settings:", err);
    return null;
  }
};

export const saveThemeSettings = async (
  themeSettings: ThemeSettings, 
  userId?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("app_settings")
      .upsert({
        key: "theme_settings",
        value: themeSettings as any, // Use 'any' to bypass the type checking for the Json type
        updated_by: userId,
      }, { onConflict: 'key' });
    
    if (error) throw error;
    
    // Apply theme immediately after saving
    applyTheme(themeSettings.primaryColor, themeSettings.secondaryColor);
    
    return true;
  } catch (err) {
    console.error("Error saving theme settings:", err);
    return false;
  }
};

export const applyTheme = (primaryColor: string, secondaryColor: string): void => {
  // Apply theme to CSS variables
  document.documentElement.style.setProperty('--element-orange', primaryColor);
  document.documentElement.style.setProperty('--element-navy', secondaryColor);
  
  // Apply colors to root CSS variables for consistent application-wide styling
  document.documentElement.style.setProperty('--primary', primaryColor);
  document.documentElement.style.setProperty('--secondary', secondaryColor);
  
  // Update derived color variables
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', primaryColor);
  
  // Show toast notification
  toast({
    title: "Theme Applied",
    description: "The theme changes have been applied to the UI.",
  });
};

// Initialize theme on app load
export const initializeTheme = async (): Promise<void> => {
  const settings = await fetchThemeSettings();
  if (settings) {
    applyTheme(settings.primaryColor, settings.secondaryColor);
  }
};
