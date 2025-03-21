
import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChefHat, Edit, Clock, Scale, PercentCircle, ArrowRight, UtensilsCrossed } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Recipe, RecipeItem } from '@/store/types';

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
  // Placeholder image when no image is available
  const placeholderImage = 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d?auto=format&fit=crop&w=800&q=80';
  
  // Parse technological process from description (for this demo)
  // In a real implementation, this would be stored as structured data
  const processSteps = recipe.description
    .split('\n')
    .filter(step => step.trim().length > 0)
    .map(step => step.trim());
  
  const highlightProcessText = (text: string) => {
    const keyWords = ['mix', 'bake', 'cool', 'stir', 'whisk', 'fold', 'knead', 'melt', 'sift', 'beat', 'chill', 'boil', 'simmer', 'roast', 'fry'];
    
    return keyWords.reduce((result, word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      return result.replace(regex, `<span class="text-confection-600 font-medium">${word}</span>`);
    }, text);
  };
  
  // Group items by type (ingredients vs semi-finished products)
  const ingredients = recipe.items.filter(item => item.type === 'ingredient' || !item.type);
  const semiFinished = recipe.items.filter(item => item.type === 'recipe');
  
  return (
    <div className="max-w-4xl mx-auto my-8 animate-scale-in">
      <div className="bg-white rounded-xl p-6 shadow-md">
        {/* Header with title and edit button */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-confection-100 p-2 rounded-full">
              <ChefHat className="h-6 w-6 text-confection-600" />
            </div>
            <div>
              <h1 className="text-3xl font-playfair text-gray-800 font-bold">{recipe.name}</h1>
              <Badge variant="outline" className="bg-white/80 text-xs font-normal mt-1">
                {recipe.category === 'finished' ? 'Готовая продукция' : 'Полуфабрикат'}
              </Badge>
            </div>
          </div>
          
          {onEdit && (
            <Button 
              onClick={() => onEdit(recipe)} 
              variant="outline" 
              size="sm"
            >
              <Edit className="mr-2 h-4 w-4" />
              Редактировать
            </Button>
          )}
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left column: Ingredients and Recipe Image */}
          <div className="md:col-span-1">
            {/* Recipe Image - Larger Circular Format */}
            <div className="flex justify-center mb-6">
              <Avatar className="h-48 w-48 border-4 border-cream-100">
                <AvatarImage 
                  src={recipe.imageUrl || placeholderImage} 
                  alt={recipe.name} 
                  className="object-cover"
                />
                <AvatarFallback className="text-3xl font-playfair text-confection-500">
                  {recipe.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-medium flex items-center gap-2 mb-3 text-gray-800">
                <Scale className="h-5 w-5 text-confection-500" />
                Выход продукта
              </h2>
              <div className="bg-cream-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Количество:</span>
                  <span className="font-medium">{recipe.output} {recipe.outputUnit}</span>
                </div>
                
                {recipe.lossPercentage > 0 && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600 flex items-center">
                      <PercentCircle className="h-4 w-4 text-amber-500 mr-1" /> 
                      Потери:
                    </span>
                    <span className="font-medium">{recipe.lossPercentage}%</span>
                  </div>
                )}
              </div>
            </div>
            
            <h2 className="text-lg font-medium flex items-center gap-2 mb-3 text-gray-800">
              <UtensilsCrossed className="h-5 w-5 text-confection-500" />
              Ингредиенты
            </h2>
            
            <div className="space-y-5">
              {ingredients.length > 0 && (
                <div className="bg-cream-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Основные ингредиенты</h3>
                  <ul className="space-y-2 divide-y divide-cream-200">
                    {ingredients.map((item, idx) => (
                      <li key={`ing-${idx}`} className="pt-2 first:pt-0">
                        <div className="flex justify-between">
                          <span className="text-gray-700">{getIngredientName(item.ingredientId || '')}</span>
                          <span className="font-medium">
                            {item.amount.toFixed(2)} {getIngredientUnit(item.ingredientId || '')}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {semiFinished.length > 0 && (
                <div className="bg-mint-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Полуфабрикаты</h3>
                  <ul className="space-y-2 divide-y divide-mint-200">
                    {semiFinished.map((item, idx) => (
                      <li key={`semi-${idx}`} className="pt-2 first:pt-0">
                        <div className="flex justify-between">
                          <span className="text-gray-700">{getRecipeName(item.recipeId || '')}</span>
                          <span className="font-medium">
                            {item.amount.toFixed(2)} {getRecipeUnit(item.recipeId || '')}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {recipe.tags && recipe.tags.length > 0 && (
                <div className="mt-4">
                  <div className="flex flex-wrap gap-1">
                    {recipe.tags.map(tag => (
                      <Badge 
                        key={tag.id}
                        className="text-xs font-normal text-white"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right column: Process and image */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-medium flex items-center gap-2 mb-3 text-gray-800">
              <Clock className="h-5 w-5 text-confection-500" />
              Технологический процесс
            </h2>
            
            <div className="bg-white border border-gray-100 rounded-lg p-5 mb-6 shadow-sm">
              {processSteps.length > 0 ? (
                <ol className="space-y-4">
                  {processSteps.map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-confection-100 text-confection-600 flex items-center justify-center font-medium text-sm">
                        {index + 1}
                      </div>
                      <div 
                        className="text-gray-700"
                        dangerouslySetInnerHTML={{ 
                          __html: highlightProcessText(step) 
                        }}
                      />
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-gray-400 italic text-center py-6">
                  Технологический процесс не описан
                </p>
              )}
            </div>
            
            <div className="text-right">
              <Button 
                className="bg-confection-600 hover:bg-confection-700"
              >
                Добавить в производство
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChefCard;
