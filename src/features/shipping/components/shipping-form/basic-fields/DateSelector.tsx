import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DateSelectorProps } from './types';

const DateSelector: React.FC<DateSelectorProps> = ({ 
  date,
  onChange 
}) => {
  // Convert string date to Date object for the calendar
  const selectedDate = date ? new Date(date) : new Date();
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Format date as YYYY-MM-DD for input value
      const formattedDate = format(date, 'yyyy-MM-dd');
      onChange(formattedDate);
    }
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="date">Дата</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(selectedDate, 'd MMMM yyyy', { locale: ru })
            ) : (
              <span>Выберите дату</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            locale={ru}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      
      {/* Keep hidden input for form data */}
      <Input
        id="date"
        type="date"
        value={date}
        onChange={(e) => onChange(e.target.value)}
        className="hidden"
      />
    </div>
  );
};

export default DateSelector;
