
import React from 'react';
import { format } from 'date-fns';
import { Calendar, DollarSign, ChefHat, Info } from 'lucide-react';
import GlassMorphicCard from '@/components/ui/GlassMorphicCard';
import { ProductionBatch } from '@/store/types';

interface ProductionListProps {
  productions: ProductionBatch[];
  getRecipeName: (recipeId: string) => string;
  getRecipeOutput: (recipeId: string) => string;
}

const ProductionList: React.FC<ProductionListProps> = ({ 
  productions,
  getRecipeName,
  getRecipeOutput
}) => {
  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch {
      return 'Неизвестная дата';
    }
  };

  return (
    <div className="grid gap-4">
      {productions.map((production) => (
        <GlassMorphicCard 
          key={production.id}
          className="bg-gradient-to-br from-mint-50 to-mint-100 border border-mint-200"
        >
          <div className="flex flex-wrap md:flex-nowrap justify-between items-start gap-4">
            <div>
              <h3 className="font-semibold text-lg">{getRecipeName(production.recipeId)}</h3>
              <div className="flex items-center mt-1 text-gray-600">
                <Calendar className="h-4 w-4 mr-1.5" />
                <span className="text-sm">{formatDate(production.date)}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/70 px-4 py-2 rounded-lg border border-mint-200">
                <div className="flex items-center">
                  <ChefHat className="h-4 w-4 text-gray-500 mr-1.5" />
                  <span className="text-sm text-gray-500">Количество</span>
                </div>
                <p className="font-medium mt-1">
                  {production.quantity} {getRecipeOutput(production.recipeId)}
                </p>
              </div>
              
              <div className="bg-white/70 px-4 py-2 rounded-lg border border-mint-200">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-gray-500 mr-1.5" />
                  <span className="text-sm text-gray-500">Себестоимость</span>
                </div>
                <p className="font-medium mt-1">
                  {production.cost.toFixed(2)} ₽
                </p>
              </div>
              
              <div className="bg-white/70 px-4 py-2 rounded-lg border border-mint-200">
                <div className="flex items-center">
                  <Info className="h-4 w-4 text-gray-500 mr-1.5" />
                  <span className="text-sm text-gray-500">Цена за единицу</span>
                </div>
                <p className="font-medium mt-1">
                  {(production.cost / production.quantity).toFixed(2)} ₽/{getRecipeOutput(production.recipeId)}
                </p>
              </div>
            </div>
          </div>
        </GlassMorphicCard>
      ))}
    </div>
  );
};

export default ProductionList;
