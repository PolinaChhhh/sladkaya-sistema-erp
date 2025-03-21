
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Ingredient, RecipeItem, Recipe, RecipeCategory, RecipeTag } from '@/store/recipeStore';
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
    category: RecipeCategory;
    tags: RecipeTag[];
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    description: string;
    output: number;
    outputUnit: string;
    lossPercentage: number;
    items: RecipeItem[];
    category: RecipeCategory;
    tags: RecipeTag[];
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

  // Automatically set the output unit based on category
  useEffect(() => {
    if (formData.category === 'semi-finished' && formData.outputUnit !== 'кг') {
      setFormData(prev => ({
        ...prev,
        outputUnit: 'кг'
      }));
    } else if (formData.category === 'finished' && formData.outputUnit !== 'шт') {
      setFormData(prev => ({
        ...prev,
        outputUnit: 'шт'
      }));
    }
  }, [formData.category, formData.outputUnit, setFormData]);

  // Handle category change
  const handleCategoryChange = (category: RecipeCategory) => {
    setFormData({
      ...formData,
      category,
      outputUnit: category === 'semi-finished' ? 'кг' : 'шт'
    });

    // Since we changed category, we should clear the items
    // to avoid mixing semi-finished and finished product items
    setFormData(prev => ({
      ...prev,
      items: []
    }));
  };

  // Handle tags change
  const handleTagsChange = (tags: RecipeTag[]) => {
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <RecipeBasicFields
          name={formData.name}
          description={formData.description}
          category={formData.category}
          tags={formData.tags}
          onNameChange={(value) => setFormData({ ...formData, name: value })}
          onDescriptionChange={(value) => setFormData({ ...formData, description: value })}
          onCategoryChange={handleCategoryChange}
          onTagsChange={handleTagsChange}
        />
        
        <RecipeOutputFields 
          output={formData.output}
          outputUnit={formData.outputUnit}
          calculatedLossPercentage={calculatedLossPercentage}
          totalIngredientsWeight={totalIngredientsWeight}
          category={formData.category}
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
          category={formData.category}
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
