
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ProductionBatch, Recipe } from '@/store/recipeStore';
import IngredientsUsageSection from './IngredientsUsageSection';
import ProductionOverview from './details/ProductionOverview';
import SemiFinalBreakdown from './details/SemiFinalBreakdown';
import ProductionDetailsSummary from './details/ProductionDetailsSummary';

interface ProductionDetailsProps {
  production: ProductionBatch;
  recipe: Recipe | null;
  getRecipeName: (id: string) => string;
  getRecipeOutput: (id: string) => string;
  getIngredientDetails: (recipeId: string, quantity: number) => any[];
  getIngredientUsageDetails: (recipeId: string, quantity: number) => any[];
  getSemiFinalBreakdown: (recipeId: string, quantity: number) => any[];
  calculateTotalCost?: (recipeId: string, quantity: number) => number;
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
  calculateTotalCost,
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
  
  const ingredientDetails = getIngredientDetails(recipe.id, production.quantity);
  const usageDetails = getIngredientUsageDetails(recipe.id, production.quantity);
  const semiFinalBreakdown = getSemiFinalBreakdown(recipe.id, production.quantity);
  
  // Calculate the ingredient cost and semi-finished cost separately for display
  const ingredientCost = usageDetails.reduce((sum, item) => sum + item.totalCost, 0);
  const semiFinalCost = semiFinalBreakdown.reduce((sum, item) => sum + item.cost, 0);
  
  // Calculate the total cost as the sum of ingredient and semi-finished costs
  const totalIngredientCosts = ingredientCost + semiFinalCost;
  
  // Use the actual production cost from the production record
  // which was correctly calculated using FIFO during creation
  const totalCost = production.cost;
  
  return (
    <DialogContent className="sm:max-w-4xl">
      <DialogHeader>
        <DialogTitle>Детали производства</DialogTitle>
      </DialogHeader>
      
      <ProductionDetailsSummary 
        production={production} 
        recipe={recipe} 
        totalCost={totalCost} 
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="overview" className="flex-1">Обзор</TabsTrigger>
          <TabsTrigger value="ingredients" className="flex-1">Ингредиенты</TabsTrigger>
          {semiFinalBreakdown.length > 0 && (
            <TabsTrigger value="semifinal" className="flex-1">Полуфабрикаты</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="overview">
          <ProductionOverview
            production={production}
            recipe={recipe}
            ingredientCost={ingredientCost}
            semiFinalCost={semiFinalCost}
            totalIngredientCosts={totalIngredientCosts}
            totalCost={totalCost}
          />
        </TabsContent>
        
        <TabsContent value="ingredients">
          <IngredientsUsageSection usageDetails={usageDetails} />
        </TabsContent>
        
        {semiFinalBreakdown.length > 0 && (
          <TabsContent value="semifinal">
            <SemiFinalBreakdown semiFinalBreakdown={semiFinalBreakdown} />
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
