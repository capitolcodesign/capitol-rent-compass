
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ColorPickerProps {
  primaryColor: string;
  secondaryColor: string;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
}

interface ColorPreset {
  name: string;
  primary: string;
  secondary: string;
}

const COLOR_PRESETS: ColorPreset[] = [
  { name: "SHRA Orange", primary: "#FF5C35", secondary: "#1A2C38" },
  { name: "Skyline Blue", primary: "#0EA5E9", secondary: "#0F172A" },
  { name: "Forest Green", primary: "#16A34A", secondary: "#1E293B" },
  { name: "Royal Purple", primary: "#8B5CF6", secondary: "#1E1E24" },
  { name: "Ruby Red", primary: "#E11D48", secondary: "#1C1917" },
];

export function ColorPicker({
  primaryColor,
  secondaryColor,
  setPrimaryColor,
  setSecondaryColor,
}: ColorPickerProps) {
  return (
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
  );
}
