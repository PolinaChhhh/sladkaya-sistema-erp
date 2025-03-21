
import React from 'react';
import { ProductionBatch, Recipe } from '@/store/types';
import { format } from 'date-fns';
import { Calendar, LayoutGrid, Hash } from 'lucide-react';

interface ProductionSummaryProps {
  production: ProductionBatch;
  recipe: Recipe;
}

const ProductionSummary: React.FC<ProductionSummaryProps> = ({ production, recipe }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch {
      return dateString;
    }
  };

  const productionDate = formatDate(production.date);
  const unitCost = production.quantity > 0 
    ? production.cost / production.quantity 
    : 0;

  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <h2 className="text-lg font-semibold mb-2">{recipe.name}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-1.5" />
          <span>Дата: {productionDate}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <LayoutGrid className="h-4 w-4 mr-1.5" />
          <span>Количество: {production.quantity} {recipe.outputUnit}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Hash className="h-4 w-4 mr-1.5" />
          <span>Стоимость: {production.cost.toFixed(2)} ₽</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Hash className="h-4 w-4 mr-1.5" />
          <span>Стоимость за единицу: {unitCost.toFixed(2)} ₽/{recipe.outputUnit}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductionSummary;
