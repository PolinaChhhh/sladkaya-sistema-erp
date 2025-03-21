
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
        <TabsTrigger value="semi-finished">Полуфабрикаты</TabsTrigger>
        <TabsTrigger value="finished">Готовые продукты</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default RecipeCategoryFilter;
