
import React from 'react';
import { format } from 'date-fns';
import { ProductionBatch, Recipe } from '@/store/recipeStore';

interface ProductionDetailsSummaryProps {
  production: ProductionBatch;
  recipe: Recipe | null;
  totalCost: number;
}

const ProductionDetailsSummary: React.FC<ProductionDetailsSummaryProps> = ({
  production,
  recipe,
  totalCost
}) => {
  if (!recipe) return null;
  
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <span className="text-sm text-gray-500">Продукт:</span>
        <p className="font-medium">{recipe.name}</p>
      </div>
      <div>
        <span className="text-sm text-gray-500">Дата:</span>
        <p className="font-medium">{format(new Date(production.date), 'dd.MM.yyyy')}</p>
      </div>
      <div>
        <span className="text-sm text-gray-500">Количество:</span>
        <p className="font-medium">{production.quantity} {recipe.outputUnit}</p>
      </div>
      <div>
        <span className="text-sm text-gray-500">Себестоимость:</span>
        <p className="font-medium">{totalCost.toFixed(2)} ₽</p>
      </div>
    </div>
  );
};

export default ProductionDetailsSummary;
