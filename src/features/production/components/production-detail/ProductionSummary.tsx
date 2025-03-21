
import React from 'react';
import { format } from 'date-fns';
import { Calendar, ChefHat, DollarSign, BarChart3 } from 'lucide-react';
import { ProductionBatch, Recipe } from '@/store/types';

interface ProductionSummaryProps {
  production: ProductionBatch;
  recipe: Recipe;
}

const ProductionSummary: React.FC<ProductionSummaryProps> = ({ production, recipe }) => {
  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch {
      return 'Неизвестная дата';
    }
  };

  // Calculate cost per unit
  const costPerUnit = production.quantity > 0 
    ? (production.cost / production.quantity).toFixed(2)
    : '0.00';

  return (
    <div className="flex flex-col gap-2 p-4 bg-mint-50 rounded-lg border border-mint-200">
      <h3 className="text-lg font-semibold">{recipe.name}</h3>
      
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>{formatDate(production.date)}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <ChefHat className="h-4 w-4 text-gray-500" />
          <span>{production.quantity} {recipe.outputUnit}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-gray-500" />
          <span>Себестоимость: {production.cost.toFixed(2)} ₽</span>
        </div>
        
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-gray-500" />
          <span>За единицу: {costPerUnit} ₽/{recipe.outputUnit}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductionSummary;
