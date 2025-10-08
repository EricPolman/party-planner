"use client"

import * as React from "react"
import { format } from "date-fns"
import { nl } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Kies een datum en tijd",
  disabled = false,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    value
  );
  const [hours, setHours] = React.useState<string>(
    value ? format(value, "HH", { locale: nl }) : "12"
  );
  const [minutes, setMinutes] = React.useState<string>(
    value ? format(value, "mm", { locale: nl }) : "00"
  );

  React.useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setHours(format(value, "HH", { locale: nl }));
      setMinutes(format(value, "mm", { locale: nl }));
    }
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date);
      const hourNum = Number.parseInt(hours) || 0;
      const minuteNum = Number.parseInt(minutes) || 0;
      newDate.setHours(hourNum);
      newDate.setMinutes(minuteNum);
      setSelectedDate(newDate);
    } else {
      setSelectedDate(undefined);
    }
  };

  const updateDateTime = (newHours: string, newMinutes: string) => {
    const hourNum = Number.parseInt(newHours) || 0;
    const minuteNum = Number.parseInt(newMinutes) || 0;

    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(hourNum);
      newDate.setMinutes(minuteNum);
      setSelectedDate(newDate);
    }
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 2) {
      setHours(value);
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 2) {
      setMinutes(value);
    }
  };

  const handleHoursBlur = () => {
    const numValue = Number.parseInt(hours) || 0;
    const clampedValue = Math.min(23, Math.max(0, numValue));
    const formattedValue = clampedValue.toString().padStart(2, "0");
    setHours(formattedValue);
    updateDateTime(formattedValue, minutes);
  };

  const handleMinutesBlur = () => {
    const numValue = Number.parseInt(minutes) || 0;
    const clampedValue = Math.min(59, Math.max(0, numValue));
    const formattedValue = clampedValue.toString().padStart(2, "0");
    setMinutes(formattedValue);
    updateDateTime(hours, formattedValue);
  };

  const handleApply = () => {
    onChange?.(selectedDate);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedDate(undefined);
    setHours("12");
    setMinutes("00");
    onChange?.(undefined);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            format(selectedDate, "PPP HH:mm", { locale: nl })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
          />
          <div className="border-t border-border p-3">
            <Label className="text-sm font-medium mb-2 block">Tijd</Label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Input
                  type="text"
                  value={hours}
                  onChange={handleHoursChange}
                  onBlur={handleHoursBlur}
                  className="w-14 text-center"
                  placeholder="HH"
                  maxLength={2}
                />
                <span className="text-muted-foreground">:</span>
                <Input
                  type="text"
                  value={minutes}
                  onChange={handleMinutesChange}
                  onBlur={handleMinutesBlur}
                  className="w-14 text-center"
                  placeholder="MM"
                  maxLength={2}
                />
              </div>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex gap-2 p-3 border-t border-border flex-row justify-stretch">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={handleClear}
            >
              Wissen
            </Button>
            <Button className="flex-1" onClick={handleApply}>
              Opslaan
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
