
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";

interface LogoSettingsProps {
  logoSize: number;
  setLogoSize: (size: number) => void;
  logoUrl: string;
  newLogoUrl: string;
  setNewLogoUrl: (url: string) => void;
}

export function LogoSettings({
  logoSize,
  setLogoSize,
  logoUrl,
  newLogoUrl,
  setNewLogoUrl,
}: LogoSettingsProps) {
  return (
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
  );
}
