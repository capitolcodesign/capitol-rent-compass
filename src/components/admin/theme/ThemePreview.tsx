
import React from "react";
import { Button } from "@/components/ui/button";

interface ThemePreviewProps {
  primaryColor: string;
  secondaryColor: string;
  applyTheme: () => void;
}

export function ThemePreview({
  primaryColor,
  secondaryColor,
  applyTheme,
}: ThemePreviewProps) {
  return (
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
  );
}
