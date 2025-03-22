
import React from 'react';
import { Input } from '@/components/ui/input';

interface MovementHistoryHeaderProps {
  dateFilter: string;
  setDateFilter: (value: string) => void;
}

const MovementHistoryHeader: React.FC<MovementHistoryHeaderProps> = ({ 
  dateFilter, 
  setDateFilter 
}) => {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Input
          placeholder="Фильтр по дате (ГГГГ-ММ-ДД)"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="max-w-xs"
        />
      </div>
      
      <div className="flex gap-2 text-sm text-muted-foreground mb-2">
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
          <span>Производство</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
          <span>Отгрузка</span>
        </div>
      </div>
    </div>
  );
};

export default MovementHistoryHeader;
