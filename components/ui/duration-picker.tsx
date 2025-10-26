"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

interface DurationPickerProps {
  value: number; // duration in milliseconds
  onChange: (duration: number) => void;
}

const PRESET_DURATIONS = [
  { label: "no duration", value: 0 },
  { label: "30 min", value: 30 * 60 * 1000 },
  { label: "1 hour", value: 60 * 60 * 1000 },
  { label: "2 hours", value: 2 * 60 * 60 * 1000 },
  { label: "3 hours", value: 3 * 60 * 60 * 1000 },
];

export function DurationPicker({ value, onChange }: DurationPickerProps) {
  const [isCustom, setIsCustom] = useState(false);

  // Convert milliseconds to hours and minutes
  const hours = Math.floor(value / (60 * 60 * 1000));
  const minutes = Math.floor((value % (60 * 60 * 1000)) / (60 * 1000));

  const handlePresetClick = (presetValue: number) => {
    setIsCustom(false);
    onChange(presetValue);
  };

  const handleCustomClick = () => {
    setIsCustom(true);
    if (value === 0) {
      onChange(60 * 60 * 1000); // Default to 1 hour
    }
  };

  const updateHours = (newHours: number) => {
    const clampedHours = Math.max(0, Math.min(23, newHours));
    onChange(clampedHours * 60 * 60 * 1000 + minutes * 60 * 1000);
  };

  const updateMinutes = (newMinutes: number) => {
    const clampedMinutes = Math.max(0, Math.min(59, newMinutes));
    onChange(hours * 60 * 60 * 1000 + clampedMinutes * 60 * 1000);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {PRESET_DURATIONS.map((preset) => (
          <Button
            key={preset.label}
            type="button"
            variant={
              !isCustom && value === preset.value ? "default" : "outline"
            }
            onClick={() => handlePresetClick(preset.value)}
            className={
              !isCustom && value === preset.value
                ? "bg-[#255026] hover:bg-[#255026]/90 dark:bg-[#A5D6A7] dark:text-black dark:hover:bg-[#A5D6A7]/90"
                : ""
            }
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <Button
        type="button"
        variant={isCustom ? "default" : "outline"}
        onClick={handleCustomClick}
        className={
          isCustom
            ? "w-full bg-[#255026] hover:bg-[#255026]/90 dark:bg-[#A5D6A7] dark:text-black dark:hover:bg-[#A5D6A7]/90"
            : "w-full"
        }
      >
        Custom Duration
      </Button>

      {isCustom && (
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="hours" className="text-sm">
              Hours
            </Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => updateHours(hours - 1)}
                disabled={hours === 0}
                className="h-8 w-8 shrink-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id="hours"
                type="number"
                min="0"
                max="23"
                value={hours}
                onChange={(e) =>
                  updateHours(Number.parseInt(e.target.value) || 0)
                }
                className="text-center"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => updateHours(hours + 1)}
                disabled={hours === 23}
                className="h-8 w-8 shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minutes" className="text-sm">
              Minutes
            </Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => updateMinutes(minutes - 15)}
                disabled={minutes === 0}
                className="h-8 w-8 shrink-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id="minutes"
                type="number"
                min="0"
                max="59"
                step="15"
                value={minutes}
                onChange={(e) =>
                  updateMinutes(Number.parseInt(e.target.value) || 0)
                }
                className="text-center"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => updateMinutes(minutes + 15)}
                disabled={minutes === 45}
                className="h-8 w-8 shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
