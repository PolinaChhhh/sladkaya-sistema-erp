
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Ingredient, RecipeItem, Recipe, RecipeCategory } from '@/store/types';
import { toast } from 'sonner';
import RecipeItemRow from './RecipeItemRow';
import SemiFinishedPortionDialog from './SemiFinishedPortionDialog';
import { expandSemiFinishedToIngredients } from './utils/expandSemiFinished';

interface RecipeItemsManagerProps {
  items: RecipeItem[];
  ingredients: Ingredient[];
  recipes: Recipe[];
  currentRecipeId?: string;
  getIngredientName: (id: string) => string;
  getIngredientUnit: (id: string) => string;
  getRecipeName: (id: string) => string;
  getRecipeUnit: (id: string) => string;
  onUpdateItems: (items: RecipeItem[]) => void;
  category: RecipeCategory;
}

const RecipeItemsManager: React.FC<RecipeItemsManagerProps> = ({
  items,
  ingredients,
  recipes,
  currentRecipeId,
  getIngredientName,
  getIngredientUnit,
  getRecipeName,
  getRecipeUnit,
  onUpdateItems,
  category,
}) => {
  const [isPortionDialogOpen, setIsPortionDialogOpen] = useState(false);
  const [selectedSemiFinished, setSelectedSemiFinished] = useState<Recipe | null>(null);

  const addRecipeItem = () => {
    if (ingredients.length === 0) {
      toast.error('Сначала добавьте ингредиенты');
      return;
    }
      
    const defaultId = ingredients.length > 0 ? ingredients[0].id : '';
    const newItem: RecipeItem = { 
      type: 'ingredient', 
      ingredientId: defaultId, 
      amount: 0,
      isPackaging: false 
    };
      
    console.log('Added new ingredient item:', newItem);
    onUpdateItems([...items, newItem]);
  };
  
  const updateRecipeItem = (index: number, field: keyof RecipeItem, value: any) => {
    const newItems = [...items];
    
    // Create a copy of the item to modify
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Log the update for debugging
    console.log(`Updated recipe item: ${index} ${String(field)} ${value}`, newItems[index]);
    
    onUpdateItems(newItems);
  };
  
  const removeRecipeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onUpdateItems(newItems);
  };

  // For finished products, only ingredients are allowed
  const allowRecipeItems = category === 'semi-finished';

  // Open semi-finished portion dialog
  const openSemiFinishedDialog = (recipe: Recipe) => {
    setSelectedSemiFinished(recipe);
    setIsPortionDialogOpen(true);
  };

  // Handle confirmation from portion dialog
  const handleAddSemiFinishedIngredients = (portionSize: number) => {
    if (!selectedSemiFinished) return;

    // Expand the semi-finished recipe into its ingredient components
    const expandedIngredients = expandSemiFinishedToIngredients(
      selectedSemiFinished,
      portionSize,
      recipes
    );

    // Add all expanded ingredients to the current recipe
    onUpdateItems([...items, ...expandedIngredients]);
    
    toast.success(
      `Добавлены ингредиенты из "${selectedSemiFinished.name}" (${portionSize} ${selectedSemiFinished.outputUnit})`
    );
  };

  // Get all semi-finished recipes (excluding the current one if editing)
  const semiFinishedRecipes = recipes.filter(
    recipe => recipe.category === 'semi-finished' && recipe.id !== currentRecipeId
  );

  return (
    <div className="space-y-3 mt-2">
      <div className="flex justify-between items-center">
        <Label>
          {category === 'finished' ? 'Ингредиенты' : 'Состав полуфабриката'}
        </Label>
        <div className="flex gap-2">
          {category === 'finished' && semiFinishedRecipes.length > 0 && (
            <div className="dropdown dropdown-end">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="dropdown-toggle" 
                onClick={() => {}}
              >
                Добавить из полуфабриката
              </Button>
              <ul className="dropdown-menu z-10 bg-white border rounded-md shadow-lg p-2 mt-1 max-h-60 overflow-auto">
                {semiFinishedRecipes.map((recipe) => (
                  <li key={recipe.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => openSemiFinishedDialog(recipe)}
                  >
                    {recipe.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Button type="button" variant="outline" size="sm" onClick={addRecipeItem}>
            <Plus className="h-3 w-3 mr-1" /> Добавить
          </Button>
        </div>
      </div>
      
      {items.length > 0 ? (
        <div className="space-y-3 mt-3">
          {items.map((item, index) => (
            <RecipeItemRow
              key={index}
              item={item}
              index={index}
              ingredients={ingredients}
              recipes={allowRecipeItems ? recipes.filter(r => r.id !== currentRecipeId) : []}
              getIngredientName={getIngredientName}
              getIngredientUnit={getIngredientUnit}
              getRecipeName={getRecipeName}
              getRecipeUnit={getRecipeUnit}
              onUpdate={updateRecipeItem}
              onRemove={removeRecipeItem}
              allowRecipeItems={allowRecipeItems}
              forceRecipeItems={false}
              forcedType={category === 'finished' ? 'ingredient' : undefined}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 py-2">
          {category === 'finished' 
            ? 'Нет добавленных ингредиентов' 
            : 'Нет добавленных компонентов'}
        </p>
      )}

      {/* Dialog for selecting semi-finished portion size */}
      {selectedSemiFinished && (
        <SemiFinishedPortionDialog
          isOpen={isPortionDialogOpen}
          onClose={() => setIsPortionDialogOpen(false)}
          semiFinishedRecipe={selectedSemiFinished}
          onConfirm={handleAddSemiFinishedIngredients}
        />
      )}
    </div>
  );
};

export default RecipeItemsManager;
