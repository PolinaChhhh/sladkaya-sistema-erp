
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package2, Component } from 'lucide-react';

interface RecipeCategoryFilterProps {
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
}

const RecipeCategoryFilter: React.FC<RecipeCategoryFilterProps> = ({
  categoryFilter,
  onCategoryChange
}) => {
  return (
    <Tabs value={categoryFilter} onValueChange={onCategoryChange} className="mb-6">
      <TabsList>
        <TabsTrigger value="all">Все категории</TabsTrigger>
        <TabsTrigger value="semi-finished" className="flex items-center gap-1">
          <div className="p-1 rounded-full bg-blue-100">
            <Component className="h-4 w-4 text-blue-600" />
          </div>
          Полуфабрикаты
        </TabsTrigger>
        <TabsTrigger value="finished" className="flex items-center gap-1">
          <div className="p-1 rounded-full bg-green-100">
            <Package2 className="h-4 w-4 text-green-600" />
          </div>
          Готовые продукты
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default RecipeCategoryFilter;
