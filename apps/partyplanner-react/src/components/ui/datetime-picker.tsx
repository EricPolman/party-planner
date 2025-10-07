"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DateTimePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pick a date and time",
  disabled = false,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value)
  const [hours, setHours] = React.useState<string>(value ? format(value, "HH") : "12")
  const [minutes, setMinutes] = React.useState<string>(value ? format(value, "mm") : "00")

  React.useEffect(() => {
    if (value) {
      setSelectedDate(value)
      setHours(format(value, "HH"))
      setMinutes(format(value, "mm"))
    }
  }, [value])

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date)
      newDate.setHours(Number.parseInt(hours) || 0)
      newDate.setMinutes(Number.parseInt(minutes) || 0)
      setSelectedDate(newDate)
    } else {
      setSelectedDate(undefined)
    }
  }

  const handleTimeChange = (newHours: string, newMinutes: string) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate)
      newDate.setHours(Number.parseInt(newHours) || 0)
      newDate.setMinutes(Number.parseInt(newMinutes) || 0)
      setSelectedDate(newDate)
    }
  }

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    const numValue = Number.parseInt(value) || 0
    const clampedValue = Math.min(23, Math.max(0, numValue))
    const formattedValue = clampedValue.toString().padStart(2, "0")
    setHours(formattedValue)
    handleTimeChange(formattedValue, minutes)
  }

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    const numValue = Number.parseInt(value) || 0
    const clampedValue = Math.min(59, Math.max(0, numValue))
    const formattedValue = clampedValue.toString().padStart(2, "0")
    setMinutes(formattedValue)
    handleTimeChange(hours, formattedValue)
  }

  const handleApply = () => {
    onChange?.(selectedDate)
    setIsOpen(false)
  }

  const handleClear = () => {
    setSelectedDate(undefined)
    setHours("12")
    setMinutes("00")
    onChange?.(undefined)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(selectedDate, "PPP HH:mm") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col">
          <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} initialFocus />
          <div className="border-t border-border p-3">
            <Label className="text-sm font-medium mb-2 block">Time</Label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Input
                  type="text"
                  value={hours}
                  onChange={handleHoursChange}
                  className="w-14 text-center"
                  placeholder="HH"
                  maxLength={2}
                />
                <span className="text-muted-foreground">:</span>
                <Input
                  type="text"
                  value={minutes}
                  onChange={handleMinutesChange}
                  className="w-14 text-center"
                  placeholder="MM"
                  maxLength={2}
                />
              </div>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex gap-2 p-3 border-t border-border">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={handleClear}>
              Clear
            </Button>
            <Button className="flex-1" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
