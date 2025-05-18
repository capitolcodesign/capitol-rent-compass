
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface MetricsSliderProps {
  label: string;
  value: number;
  onChange: (value: number[]) => void;
  description?: string;
}

const MetricsSlider: React.FC<MetricsSliderProps> = ({ 
  label, 
  value, 
  onChange,
  description
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor={`slider-${label}`}>{label}</Label>
        <span className="text-sm font-medium">{value}/10</span>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <Slider
        id={`slider-${label}`}
        defaultValue={[value]}
        max={10}
        min={1}
        step={1}
        onValueChange={onChange}
      />
    </div>
  );
};

export default MetricsSlider;
