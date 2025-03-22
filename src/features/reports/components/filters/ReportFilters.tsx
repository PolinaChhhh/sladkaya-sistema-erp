import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from '@/components/ui/select';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface ReportFiltersProps {
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
  selectedRecipeId: string | null;
  setSelectedRecipeId: (recipeId: string | null) => void;
  recipes: Array<{ id: string; name: string }>;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({
  selectedMonth,
  setSelectedMonth,
  selectedRecipeId,
  setSelectedRecipeId,
  recipes
}) => {
  const handleMonthSelect = (date: Date | undefined) => {
    if (date) {
      // Keep only year and month, set day to 1
      const newDate = new Date(date.getFullYear(), date.getMonth(), 1);
      setSelectedMonth(newDate);
    }
  };

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-6">
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Month</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left",
                !selectedMonth && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedMonth ? (
                format(selectedMonth, 'MMMM yyyy')
              ) : (
                <span>Select month</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedMonth}
              onSelect={handleMonthSelect}
              initialFocus
              disabled={(date) => date > new Date()}
              captionLayout="dropdown-buttons"
              fromYear={2020}
              toYear={new Date().getFullYear()}
              showOutsideDays={false}
              className={cn("p-3 pointer-events-auto")}
              ISOWeek={false}
              defaultMonth={selectedMonth}
              view="month"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Product</label>
        <Select
          value={selectedRecipeId || ''}
          onValueChange={(value) => setSelectedRecipeId(value === '' ? null : value)}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All products" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All products</SelectItem>
            {recipes.map((recipe) => (
              <SelectItem key={recipe.id} value={recipe.id}>
                {recipe.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ReportFilters;
