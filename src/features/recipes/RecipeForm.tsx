
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Ingredient, RecipeItem, Recipe } from '@/store/recipeStore';
import { toast } from 'sonner';
import RecipeBasicFields from './RecipeBasicFields';
import RecipeOutputFields from './RecipeOutputFields';
import RecipeItemsManager from './RecipeItemsManager';
import { useRecipeCalculations } from './hooks/useRecipeCalculations';

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
  // Use custom hook for calculations
  const { totalIngredientsWeight, calculatedLossPercentage } = useRecipeCalculations({
    items: formData.items,
    output: formData.output,
    outputUnit: formData.outputUnit,
    getIngredientUnit,
    getRecipeUnit,
  });

  // Update lossPercentage in formData whenever it's calculated
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      lossPercentage: calculatedLossPercentage
    }));
  }, [calculatedLossPercentage, setFormData]);

  // Debug logging for form data
  console.log('RecipeForm - formData:', formData);

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <RecipeBasicFields
          name={formData.name}
          description={formData.description}
          onNameChange={(value) => setFormData({ ...formData, name: value })}
          onDescriptionChange={(value) => setFormData({ ...formData, description: value })}
        />
        
        <RecipeOutputFields 
          output={formData.output}
          outputUnit={formData.outputUnit}
          calculatedLossPercentage={calculatedLossPercentage}
          totalIngredientsWeight={totalIngredientsWeight}
          onOutputChange={(value) => setFormData({ ...formData, output: value })}
          onOutputUnitChange={(value) => setFormData({ ...formData, outputUnit: value })}
        />
        
        <RecipeItemsManager
          items={formData.items}
          ingredients={ingredients}
          recipes={recipes}
          currentRecipeId={currentRecipeId}
          getIngredientName={getIngredientName}
          getIngredientUnit={getIngredientUnit}
          getRecipeName={getRecipeName}
          getRecipeUnit={getRecipeUnit}
          onUpdateItems={(items) => setFormData({ ...formData, items })}
        />
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
