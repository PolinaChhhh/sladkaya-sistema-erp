
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProductionBatch, Recipe } from '@/store/recipeStore';
import IngredientsUsageSection from './IngredientsUsageSection';

interface ProductionDetailsProps {
  production: ProductionBatch;
  recipe: Recipe | null;
  getRecipeName: (id: string) => string;
  getRecipeOutput: (id: string) => string;
  getIngredientDetails: (recipes: Recipe[], recipeId: string, quantity: number) => any[];
  getIngredientUsageDetails: (recipeId: string, quantity: number) => any[];
  getSemiFinalBreakdown: (recipeId: string, quantity: number) => any[];
  onClose: () => void;
}

const ProductionDetails: React.FC<ProductionDetailsProps> = ({
  production,
  recipe,
  getRecipeName,
  getRecipeOutput,
  getIngredientDetails,
  getIngredientUsageDetails,
  getSemiFinalBreakdown,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!recipe) {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ошибка загрузки данных</DialogTitle>
        </DialogHeader>
        <p>Рецепт не найден.</p>
        <DialogFooter>
          <Button onClick={onClose}>Закрыть</Button>
        </DialogFooter>
      </DialogContent>
    );
  }
  
  const ingredientDetails = getIngredientDetails([recipe], recipe.id, production.quantity);
  const usageDetails = getIngredientUsageDetails(recipe.id, production.quantity);
  const semiFinalBreakdown = getSemiFinalBreakdown(recipe.id, production.quantity);
  
  return (
    <DialogContent className="sm:max-w-4xl">
      <DialogHeader>
        <DialogTitle>Детали производства</DialogTitle>
      </DialogHeader>
      
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
          <p className="font-medium">{production.cost.toFixed(2)} ₽</p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="overview" className="flex-1">Обзор</TabsTrigger>
          <TabsTrigger value="ingredients" className="flex-1">Ингредиенты</TabsTrigger>
          {semiFinalBreakdown.length > 0 && (
            <TabsTrigger value="semifinal" className="flex-1">Полуфабрикаты</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="overview">
          <div className="glass rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead colSpan={2}>Общая информация</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Продукт</TableCell>
                  <TableCell>{recipe.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Количество</TableCell>
                  <TableCell>{production.quantity} {recipe.outputUnit}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Дата производства</TableCell>
                  <TableCell>{format(new Date(production.date), 'dd.MM.yyyy')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Себестоимость единицы</TableCell>
                  <TableCell>{(production.cost / production.quantity).toFixed(2)} ₽/{recipe.outputUnit}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Общая себестоимость</TableCell>
                  <TableCell>{production.cost.toFixed(2)} ₽</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="ingredients">
          <IngredientsUsageSection usageDetails={usageDetails} />
        </TabsContent>
        
        {semiFinalBreakdown.length > 0 && (
          <TabsContent value="semifinal">
            <div className="space-y-6">
              {semiFinalBreakdown.map((semi, index) => (
                <div key={index} className="glass rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead colSpan={4}>{semi.name} ({semi.quantity} {semi.unit})</TableHead>
                      </TableRow>
                      <TableRow>
                        <TableHead>Ингредиент</TableHead>
                        <TableHead>Количество</TableHead>
                        <TableHead>Стоимость за ед.</TableHead>
                        <TableHead>Общая стоимость</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {semi.ingredients.map((ing, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{ing.name}</TableCell>
                          <TableCell>{ing.amount.toFixed(2)} {ing.unit}</TableCell>
                          <TableCell>{(ing.cost / ing.amount).toFixed(2)} ₽/{ing.unit}</TableCell>
                          <TableCell>{ing.cost.toFixed(2)} ₽</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="font-medium text-right">Итого:</TableCell>
                        <TableCell className="font-medium">{semi.cost.toFixed(2)} ₽</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
      
      <DialogFooter>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ProductionDetails;
