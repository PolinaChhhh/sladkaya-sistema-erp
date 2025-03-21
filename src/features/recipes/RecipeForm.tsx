
import React, { useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Ingredient, RecipeItem, Recipe } from '@/store/recipeStore';
import { toast } from 'sonner';
import RecipeItemRow from './RecipeItemRow';
import RecipeOutputFields from './RecipeOutputFields';

interface RecipeFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  formData: {
    name: string;
    description: string;
    output: number;
    outputUnit: string;
    lossPercentage: number;
    items: RecipeItem[];
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    description: string;
    output: number;
    outputUnit: string;
    lossPercentage: number;
    items: RecipeItem[];
  }>>;
  onSubmit: () => void;
  ingredients: Ingredient[];
  recipes: Recipe[];
  currentRecipeId?: string;
  getIngredientName: (id: string) => string;
  getIngredientUnit: (id: string) => string;
  getRecipeName: (id: string) => string;
  getRecipeUnit: (id: string) => string;
}

const RecipeForm: React.FC<RecipeFormProps> = ({
  isOpen,
  onClose,
  title,
  formData,
  setFormData,
  onSubmit,
  ingredients,
  recipes,
  currentRecipeId,
  getIngredientName,
  getIngredientUnit,
  getRecipeName,
  getRecipeUnit,
}) => {
  // Filter out the current recipe from the list of available recipes
  // to prevent circular references
  const availableRecipes = recipes.filter(recipe => recipe.id !== currentRecipeId);
  
  const addRecipeItem = () => {
    if (ingredients.length === 0 && availableRecipes.length === 0) {
      toast.error('Сначала добавьте ингредиенты или рецепты');
      return;
    }
    
    // Default type based on what's available
    const defaultType = ingredients.length > 0 ? 'ingredient' : 'recipe';
    const defaultId = defaultType === 'ingredient' && ingredients.length > 0 ? 
      ingredients[0].id : 
      (defaultType === 'recipe' && availableRecipes.length > 0 ? availableRecipes[0].id : '');
    
    // Create a properly typed new item
    const newItem: RecipeItem = defaultType === 'ingredient' 
      ? { type: 'ingredient', ingredientId: defaultId, amount: 0 }
      : { type: 'recipe', recipeId: defaultId, amount: 0 };
    
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    
    console.log('Added new recipe item:', newItem);
  };
  
  const updateRecipeItem = (index: number, field: keyof RecipeItem, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
    
    console.log('Updated recipe item:', index, field, value, newItems[index]);
  };
  
  const removeRecipeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  // Calculate total ingredients weight and loss percentage
  const { totalIngredientsWeight, calculatedLossPercentage } = useMemo(() => {
    // Sum up the weights of all ingredients and recipes (assuming all are in kg or convertible to kg)
    const total = formData.items.reduce((sum, item) => {
      if (!item.amount) return sum;
      
      let weightInKg = item.amount;
      
      if (item.type === 'ingredient' && item.ingredientId) {
        const unit = getIngredientUnit(item.ingredientId);
        
        // Convert to kg if needed (simplified conversion)
        if (unit === 'г') {
          weightInKg = item.amount / 1000;
        }
      } else if (item.type === 'recipe' && item.recipeId) {
        const unit = getRecipeUnit(item.recipeId);
        
        // Convert to kg if needed (simplified conversion)
        if (unit === 'г') {
          weightInKg = item.amount / 1000;
        }
      } else {
        // Skip items with incomplete data
        return sum;
      }
      
      return sum + weightInKg;
    }, 0);
    
    // Calculate loss percentage based on output and total weight
    let lossPercentage = 0;
    if (total > 0 && formData.outputUnit === 'кг') {
      // If output is less than ingredients, there's a loss
      lossPercentage = ((total - formData.output) / total) * 100;
    }
    
    return { 
      totalIngredientsWeight: total, 
      calculatedLossPercentage: lossPercentage 
    };
  }, [formData.items, formData.output, formData.outputUnit, getIngredientUnit, getRecipeUnit]);

  // Update lossPercentage in formData whenever it's calculated
  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      lossPercentage: calculatedLossPercentage
    }));
  }, [calculatedLossPercentage, setFormData]);

  // Debug logging for form data
  console.log('RecipeForm - formData:', formData);
  console.log('RecipeForm - availableRecipes:', availableRecipes);

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Название</Label>
          <Input 
            id="name" 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Введите название рецепта"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="description">Описание</Label>
          <Textarea 
            id="description" 
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Описание рецепта (опционально)"
          />
        </div>
        
        <RecipeOutputFields 
          output={formData.output}
          outputUnit={formData.outputUnit}
          calculatedLossPercentage={calculatedLossPercentage}
          totalIngredientsWeight={totalIngredientsWeight}
          onOutputChange={(value) => setFormData({ ...formData, output: value })}
          onOutputUnitChange={(value) => setFormData({ ...formData, outputUnit: value })}
        />
        
        <div className="space-y-3 mt-2">
          <div className="flex justify-between items-center">
            <Label>Ингредиенты и рецепты</Label>
            <Button type="button" variant="outline" size="sm" onClick={addRecipeItem}>
              <Plus className="h-3 w-3 mr-1" /> Добавить
            </Button>
          </div>
          
          {formData.items.length > 0 ? (
            <div className="space-y-3 mt-3">
              {formData.items.map((item, index) => (
                <RecipeItemRow
                  key={index}
                  item={item}
                  index={index}
                  ingredients={ingredients}
                  recipes={availableRecipes}
                  getIngredientName={getIngredientName}
                  getIngredientUnit={getIngredientUnit}
                  getRecipeName={getRecipeName}
                  getRecipeUnit={getRecipeUnit}
                  onUpdate={updateRecipeItem}
                  onRemove={removeRecipeItem}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 py-2">Нет добавленных ингредиентов</p>
          )}
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Отмена
        </Button>
        <Button className="bg-confection-600 hover:bg-confection-700" onClick={onSubmit}>
          {title === "Создать новый рецепт" ? "Создать рецепт" : "Сохранить изменения"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default RecipeForm;
