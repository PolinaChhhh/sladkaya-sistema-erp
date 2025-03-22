
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Ingredient, RecipeItem, Recipe, RecipeTag, RecipeCategory } from '@/store/types';
import { toast } from 'sonner';
import RecipeBasicFields from './RecipeBasicFields';
import RecipeOutputFields from './RecipeOutputFields';
import RecipeItemsManager from './RecipeItemsManager';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    imageUrl?: string;
    preparationTime?: number;
    bakingTemperature?: number;
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
    imageUrl?: string;
    preparationTime?: number;
    bakingTemperature?: number;
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

  // Handle image change
  const handleImageChange = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      imageUrl
    }));
  };
  
  // Handle preparation time change
  const handlePreparationTimeChange = (time: number) => {
    setFormData(prev => ({
      ...prev,
      preparationTime: time
    }));
  };
  
  // Handle baking temperature change
  const handleBakingTemperatureChange = (temp: number) => {
    setFormData(prev => ({
      ...prev,
      bakingTemperature: temp
    }));
  };

  // Get only the main items (no packaging)
  const mainItems = formData.items.filter(item => !item.isPackaging);

  return (
    <DialogContent className="sm:max-w-[65vw] max-h-[90vh]">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <ScrollArea className="max-h-[70vh] pr-4">
        <div className="grid gap-4 py-4">
          <RecipeBasicFields
            name={formData.name}
            description={formData.description}
            tags={formData.tags}
            imageUrl={formData.imageUrl}
            preparationTime={formData.preparationTime}
            bakingTemperature={formData.bakingTemperature}
            category={formData.category}
            onNameChange={(value) => setFormData({ ...formData, name: value })}
            onDescriptionChange={(value) => setFormData({ ...formData, description: value })}
            onTagsChange={handleTagsChange}
            onImageChange={handleImageChange}
            onPreparationTimeChange={handlePreparationTimeChange}
            onBakingTemperatureChange={handleBakingTemperatureChange}
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
      </ScrollArea>
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
