
import React from 'react';
import { format } from 'date-fns';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Calendar, ChefHat, DollarSign, Package, ArrowDown, BarChart3 } from 'lucide-react';
import { ProductionBatch, Recipe, Ingredient, Receipt } from '@/store/types';

interface ProductionDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  production: ProductionBatch | null;
  recipe: Recipe | null;
  getIngredientDetails: (ingredientId: string) => Ingredient | undefined;
  getRecipeName: (recipeId: string) => string;
  getIngredientUsageDetails: (production: ProductionBatch) => IngredientUsageDetail[];
}

export interface IngredientUsageDetail {
  ingredientId: string;
  ingredientName: string;
  totalAmount: number;
  unit: string;
  usageBreakdown: {
    receiptDate: string;
    amount: number;
    unitPrice: number;
    totalCost: number;
  }[];
  totalCost: number;
}

const ProductionDetailDialog: React.FC<ProductionDetailDialogProps> = ({
  isOpen,
  onClose,
  production,
  recipe,
  getIngredientDetails,
  getRecipeName,
  getIngredientUsageDetails
}) => {
  if (!production || !recipe) return null;

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch {
      return 'Неизвестная дата';
    }
  };

  const ingredientUsageDetails = getIngredientUsageDetails(production);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Детали производства</DialogTitle>
          <DialogDescription>
            Информация о списании ингредиентов и затратах
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
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
                <span>За единицу: {(production.cost / production.quantity).toFixed(2)} ₽/{recipe.outputUnit}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2">Расход ингредиентов</h3>
            
            {ingredientUsageDetails.length === 0 ? (
              <p className="text-gray-500 italic">Нет данных о расходе ингредиентов</p>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {ingredientUsageDetails.map((detail, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="py-3">
                      <div className="flex justify-between items-center w-full pr-4">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-500" />
                          <span>{detail.ingredientName}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span>{detail.totalAmount.toFixed(2)} {detail.unit}</span>
                          <span className="font-medium">{detail.totalCost.toFixed(2)} ₽</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-6 space-y-2">
                        {detail.usageBreakdown.map((usage, idx) => (
                          <div key={idx} className="grid grid-cols-3 gap-2 text-sm border-b border-gray-100 pb-2">
                            <div>
                              <span className="text-gray-500">Приход от:</span>
                              <div>{formatDate(usage.receiptDate)}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Количество:</span>
                              <div>{usage.amount.toFixed(2)} {detail.unit}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Стоимость:</span>
                              <div>{usage.totalCost.toFixed(2)} ₽ ({usage.unitPrice.toFixed(2)} ₽/{detail.unit})</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
          
          {recipe.category === 'finished' && (
            <div className="mt-4">
              <h3 className="text-md font-semibold mb-2">Использованные полуфабрикаты</h3>
              
              {recipe.items.filter(item => item.type === 'recipe' && item.recipeId).length === 0 ? (
                <p className="text-gray-500 italic">Нет использованных полуфабрикатов</p>
              ) : (
                <div className="space-y-2">
                  {recipe.items
                    .filter(item => item.type === 'recipe' && item.recipeId)
                    .map((item, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-md">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <ArrowDown className="h-4 w-4 text-gray-500" />
                            <span>{getRecipeName(item.recipeId || '')}</span>
                          </div>
                          <div>
                            <span>{(item.amount * production.quantity / recipe.output).toFixed(2)} ед.</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductionDetailDialog;
