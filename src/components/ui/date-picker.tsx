import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { enGB } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?: string; // ISO date string (YYYY-MM-DD)
  onChange: (date: string | undefined) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  className?: string;
  error?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  minDate,
  maxDate,
  disabled,
  className,
  error,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  
  // Convert ISO string to Date object
  const date = value ? new Date(value + 'T00:00:00') : undefined;
  
  // Format date in European format (DD/MM/YYYY)
  const formatDate = (date: Date | undefined): string => {
    if (!date) return '';
    return format(date, 'dd/MM/yyyy', { locale: enGB });
  };

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Convert Date to ISO string (YYYY-MM-DD)
      const isoString = format(selectedDate, 'yyyy-MM-dd');
      onChange(isoString);
      setOpen(false);
    } else {
      onChange(undefined);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-14 text-lg justify-start text-left font-normal w-full",
            !date && "text-muted-foreground",
            error && "border-red-500 border-2",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? formatDate(date) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          disabled={(date) => {
            if (minDate && date < minDate) return true;
            if (maxDate && date > maxDate) return true;
            return false;
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

