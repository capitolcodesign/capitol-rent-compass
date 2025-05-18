
import React from "react";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TimePickerDemoProps {
  value?: string;
  onChange?: (time: string) => void;
  className?: string;
}

export function TimePickerDemo({ value, onChange, className }: TimePickerDemoProps) {
  const [hour, setHour] = React.useState<string>(value ? value.split(":")[0] : "");
  const [minute, setMinute] = React.useState<string>(value ? value.split(":")[1] : "");

  const handleChangeHour = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHour = e.target.value;
    if (newHour === "" || (/^\d{1,2}$/.test(newHour) && parseInt(newHour) >= 0 && parseInt(newHour) <= 23)) {
      setHour(newHour);
      onChange?.(`${newHour.padStart(2, "0")}:${minute.padStart(2, "0")}`);
    }
  };

  const handleChangeMinute = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinute = e.target.value;
    if (newMinute === "" || (/^\d{1,2}$/.test(newMinute) && parseInt(newMinute) >= 0 && parseInt(newMinute) <= 59)) {
      setMinute(newMinute);
      onChange?.(`${hour.padStart(2, "0")}:${newMinute.padStart(2, "0")}`);
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">Hours</Label>
        <Input
          id="hours"
          className="w-16 text-center"
          value={hour}
          onChange={handleChangeHour}
          placeholder="00"
        />
      </div>
      <div className="grid gap-1 text-center">
        <div className="text-xs">&nbsp;</div>
        <div className="text-xl">:</div>
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">Minutes</Label>
        <Input
          id="minutes"
          className="w-16 text-center"
          value={minute}
          onChange={handleChangeMinute}
          placeholder="00"
        />
      </div>
      <Clock className="h-4 w-4 text-muted-foreground ml-1" />
    </div>
  );
}
