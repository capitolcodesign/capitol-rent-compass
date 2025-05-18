
import React, { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

// Define a type for theme settings retrieved from the database
interface ThemeSettings {
  primaryColor?: string;
  secondaryColor?: string;
  logoSize?: number;
  logoUrl?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const [logoUrl, setLogoUrl] = useState<string>("/lovable-uploads/33c86c21-a65a-47cc-bc48-c84732a3e5fd.png");
  
  // Size mappings
  const sizes = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-16',
  };

  useEffect(() => {
    const fetchLogoUrl = async () => {
      try {
        const { data, error } = await supabase
          .from("app_settings")
          .select("value")
          .eq("key", "theme_settings")
          .single();
        
        if (error) throw error;
        
        if (data?.value) {
          // Cast the value to ThemeSettings
          const themeSettings = data.value as unknown as ThemeSettings;
          
          if (themeSettings.logoUrl) {
            setLogoUrl(themeSettings.logoUrl);
          }
        }
      } catch (err) {
        console.error("Error fetching logo URL:", err);
      }
    };

    fetchLogoUrl();
  }, []);
  
  return (
    <div className={`flex items-center ${sizes[size]}`}>
      <img 
        src={logoUrl}
        alt="SHRA Logo" 
        className={`${sizes[size]} object-contain mr-3`}
        onError={(e) => {
          e.currentTarget.src = "/lovable-uploads/33c86c21-a65a-47cc-bc48-c84732a3e5fd.png";
        }}
      />
      <div className="flex flex-col">
        <span className="font-bold text-element-navy leading-tight">SHRA</span>
        <span className="text-xs text-element-charcoal/70 leading-tight">Rent Reasonableness</span>
      </div>
    </div>
  );
};

export default Logo;
