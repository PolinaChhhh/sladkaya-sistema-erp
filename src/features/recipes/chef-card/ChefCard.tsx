
import React from 'react';
import { Recipe } from '@/store/types';
import ChefCardHeader from './ChefCardHeader';
import RecipeImage from './RecipeImage';
import RecipeOutput from './RecipeOutput';
import RecipeIngredients from './RecipeIngredients';
import RecipeProcess from './RecipeProcess';

interface ChefCardProps {
  recipe: Recipe;
  onEdit?: (recipe: Recipe) => void;
  getIngredientName: (id: string) => string;
  getIngredientUnit: (id: string) => string;
  getRecipeName: (id: string) => string;
  getRecipeUnit: (id: string) => string;
}

const ChefCard: React.FC<ChefCardProps> = ({
  recipe,
  onEdit,
  getIngredientName,
  getIngredientUnit,
  getRecipeName,
  getRecipeUnit
}) => {
  // Parse technological process from description
  const processSteps = recipe.description
    .split('\n')
    .filter(step => step.trim().length > 0)
    .map(step => step.trim());
  
  // Group items by type (ingredients vs semi-finished products)
  const ingredients = recipe.items.filter(item => item.type === 'ingredient' || !item.type);
  const semiFinished = recipe.items.filter(item => item.type === 'recipe');
  
  return (
    <div className="max-w-4xl mx-auto my-8 animate-scale-in">
      <div className="bg-white rounded-xl p-6 shadow-md">
        {/* Header with title and edit button */}
        <ChefCardHeader recipe={recipe} onEdit={onEdit} />
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left column: Ingredients and Recipe Image */}
          <div className="md:col-span-1">
            {/* Recipe Image - Circular Format */}
            <RecipeImage name={recipe.name} imageUrl={recipe.imageUrl} />
            
            {/* Recipe Output Section */}
            <RecipeOutput 
              output={recipe.output} 
              outputUnit={recipe.outputUnit} 
              lossPercentage={recipe.lossPercentage}
            />
            
            {/* Recipe Ingredients Section */}
            <RecipeIngredients 
              ingredients={ingredients}
              semiFinished={semiFinished}
              tags={recipe.tags}
              getIngredientName={getIngredientName}
              getIngredientUnit={getIngredientUnit}
              getRecipeName={getRecipeName}
              getRecipeUnit={getRecipeUnit}
            />
          </div>
          
          {/* Right column: Process */}
          <div className="md:col-span-2">
            {/* Recipe Process Section */}
            <RecipeProcess 
              processSteps={processSteps} 
              preparationTime={recipe.preparationTime}
              category={recipe.category}
              bakingTemperature={recipe.bakingTemperature}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChefCard;
