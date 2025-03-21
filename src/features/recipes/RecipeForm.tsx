
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Ingredient, RecipeItem, Recipe, RecipeTag } from '@/store/recipeStore';
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
        
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">Упаковка</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleAddPackaging}
              className="flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-package">
                <path d="m7.5 4.27 9 5.15" />
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
              </svg>
              Добавить упаковку
            </Button>
          </div>

          {packagingItems.length > 0 ? (
            <div className="space-y-2">
              {packagingItems.map((item, index) => (
                <RecipeItemRow
                  key={`packaging-${index}`}
                  item={item}
                  index={index}
                  ingredients={ingredients}
                  recipes={[]}
                  getIngredientName={getIngredientName}
                  getIngredientUnit={getIngredientUnit}
                  getRecipeName={getRecipeName}
                  getRecipeUnit={getRecipeUnit}
                  onUpdate={(idx, field, value) => {
                    const newItems = [...packagingItems];
                    newItems[idx] = { ...newItems[idx], [field]: value };
                    updatePackagingItems(newItems);
                  }}
                  onRemove={(idx) => {
                    updatePackagingItems(packagingItems.filter((_, i) => i !== idx));
                  }}
                  forcedType="ingredient"
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 py-2">
              Нет добавленной упаковки
            </p>
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
