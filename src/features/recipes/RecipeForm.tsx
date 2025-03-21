
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Ingredient, RecipeItem, Recipe, RecipeTag } from '@/store/types';
import { toast } from 'sonner';
import RecipeBasicFields from './RecipeBasicFields';
import RecipeOutputFields from './RecipeOutputFields';
import RecipeItemsManager from './RecipeItemsManager';
import RecipeItemRow from './RecipeItemRow';
import { useRecipeCalculations } from './hooks/useRecipeCalculations';
import PackagingItemsSection from './components/PackagingItemsSection';

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
    category: 'finished';
    tags: RecipeTag[];
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    description: string;
    output: number;
    outputUnit: string;
    lossPercentage: number;
    items: RecipeItem[];
    category: 'finished';
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

  // Automatically set the output unit to "шт"
  useEffect(() => {
    if (formData.outputUnit !== 'шт') {
      setFormData(prev => ({
        ...prev,
        outputUnit: 'шт'
      }));
    }
  }, [formData.outputUnit, setFormData]);

  // Handle tags change
  const handleTagsChange = (tags: RecipeTag[]) => {
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  // Separate items by type (ingredients vs packaging)
  const mainItems = formData.items.filter(item => !item.isPackaging);
  const packagingItems = formData.items.filter(item => item.isPackaging);

  // Handle adding a packaging ingredient
  const handleAddPackaging = () => {
    if (ingredients.length === 0) {
      toast.error('Сначала добавьте ингредиенты');
      return;
    }
    
    const defaultId = ingredients.length > 0 ? ingredients[0].id : '';
    const newItem: RecipeItem = {
      type: 'ingredient',
      ingredientId: defaultId,
      amount: 0,
      isPackaging: true
    };
    
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  // Update items with the new packaging status
  const updateMainItems = (items: RecipeItem[]) => {
    setFormData(prev => ({
      ...prev,
      items: [...packagingItems, ...items.map(item => ({ ...item, isPackaging: false }))]
    }));
  };

  const updatePackagingItems = (items: RecipeItem[]) => {
    setFormData(prev => ({
      ...prev,
      items: [...mainItems, ...items.map(item => ({ ...item, isPackaging: true }))]
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
          tags={formData.tags}
          onNameChange={(value) => setFormData({ ...formData, name: value })}
          onDescriptionChange={(value) => setFormData({ ...formData, description: value })}
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
          items={mainItems}
          ingredients={ingredients}
          recipes={recipes}
          currentRecipeId={currentRecipeId}
          getIngredientName={getIngredientName}
          getIngredientUnit={getIngredientUnit}
          getRecipeName={getRecipeName}
          getRecipeUnit={getRecipeUnit}
          onUpdateItems={updateMainItems}
          category={formData.category}
        />
        
        <PackagingItemsSection
          packagingItems={packagingItems}
          ingredients={ingredients}
          getIngredientName={getIngredientName}
          getIngredientUnit={getIngredientUnit}
          getRecipeName={getRecipeName}
          getRecipeUnit={getRecipeUnit}
          onUpdateItems={updatePackagingItems}
          onAddPackaging={handleAddPackaging}
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
