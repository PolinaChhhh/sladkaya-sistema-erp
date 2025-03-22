
import React from 'react';
import ChefCardHeader from './ChefCardHeader';
import RecipeIngredients from './RecipeIngredients';
import RecipeImage from './RecipeImage';
import RecipeOutput from './RecipeOutput';
import RecipeProcess from './RecipeProcess';
import { Recipe } from '@/store/types';

interface ChefCardProps {
  recipe: Recipe;
  onClose: () => void;
  onEdit?: (recipe: Recipe) => void;
  getIngredientName: (id: string) => string;
  getIngredientUnit: (id: string) => string;
  getRecipeName: (id: string) => string;
  getRecipeUnit: (id: string) => string;
}

const ChefCard: React.FC<ChefCardProps> = ({ 
  recipe, 
  onClose,
  onEdit,
  getIngredientName,
  getIngredientUnit,
  getRecipeName,
  getRecipeUnit
}) => {
  // Separate ingredients and semi-finished products
  const mainIngredients = recipe.items.filter(
    item => item.type === 'ingredient' && !item.isPackaging
  );
  
  const semiFinished = recipe.items.filter(
    item => item.type === 'recipe'
  );
  
  return (
    <div className="bg-cream-50 p-6 rounded-2xl h-full overflow-auto">
      <ChefCardHeader 
        recipe={recipe} 
        onEdit={onEdit} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Left column */}
        <div className="md:col-span-2 space-y-6">
          <RecipeOutput 
            output={recipe.output} 
            outputUnit={recipe.outputUnit} 
            lossPercentage={recipe.lossPercentage} 
          />
          
          <RecipeProcess 
            processSteps={recipe.process || []} 
            preparationTime={recipe.preparationTime}
            bakingTemperature={recipe.bakingTemperature}
            category={recipe.category}
            recipeName={recipe.name}
            items={recipe.items}
            output={recipe.output}
            outputUnit={recipe.outputUnit}
            getIngredientName={getIngredientName}
            getIngredientUnit={getIngredientUnit}
            getRecipeName={getRecipeName}
            getRecipeUnit={getRecipeUnit}
          />
        </div>
        
        {/* Right column */}
        <div className="space-y-6">
          <RecipeImage 
            name={recipe.name}
            imageUrl={recipe.imageUrl} 
          />
          
          <RecipeIngredients 
            ingredients={mainIngredients} 
            semiFinished={semiFinished}
            tags={recipe.tags}
            getIngredientName={getIngredientName}
            getIngredientUnit={getIngredientUnit}
            getRecipeName={getRecipeName}
            getRecipeUnit={getRecipeUnit}
          />
        </div>
      </div>
    </div>
  );
};

export default ChefCard;
