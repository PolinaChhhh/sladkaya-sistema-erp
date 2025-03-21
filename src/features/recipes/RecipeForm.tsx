
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Ingredient, RecipeItem, Recipe, RecipeTag, RecipeCategory } from '@/store/types';
import { toast } from 'sonner';
import RecipeBasicFields from './RecipeBasicFields';
import RecipeOutputFields from './RecipeOutputFields';
import RecipeItemsManager from './RecipeItemsManager';

interface RecipeFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  formData: {
    name: string;
    description: string;
    output: number;
    outputUnit: string;
    items: RecipeItem[];
    category: RecipeCategory;
    lossPercentage: number;
    tags: RecipeTag[];
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    description: string;
    output: number;
    outputUnit: string;
    items: RecipeItem[];
    category: RecipeCategory;
    lossPercentage: number;
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
  // Handle tags change
  const handleTagsChange = (tags: RecipeTag[]) => {
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  // Handle category change
  const handleCategoryChange = (category: RecipeCategory) => {
    setFormData(prev => ({
      ...prev,
      category
    }));
  };

  // Handle loss percentage change
  const handleLossPercentageChange = (value: number) => {
    setFormData(prev => ({
      ...prev,
      lossPercentage: value
    }));
  };

  // Get only the main items (no packaging)
  const mainItems = formData.items.filter(item => !item.isPackaging);

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
          category={formData.category}
          items={mainItems}
          lossPercentage={formData.lossPercentage}
          onOutputChange={(value) => setFormData({ ...formData, output: value })}
          onOutputUnitChange={(value) => setFormData({ ...formData, outputUnit: value })}
          onCategoryChange={handleCategoryChange}
          onLossPercentageChange={handleLossPercentageChange}
          getIngredientUnit={getIngredientUnit}
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
