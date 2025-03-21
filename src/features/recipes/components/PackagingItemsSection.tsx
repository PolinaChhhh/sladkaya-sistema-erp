
import React from 'react';
import { Button } from '@/components/ui/button';
import { RecipeItem, Ingredient, Recipe } from '@/store/types';
import RecipeItemRow from '../RecipeItemRow';
import { toast } from 'sonner';

interface PackagingItemsSectionProps {
  packagingItems: RecipeItem[];
  ingredients: Ingredient[];
  getIngredientName: (id: string) => string;
  getIngredientUnit: (id: string) => string;
  getRecipeName: (id: string) => string;
  getRecipeUnit: (id: string) => string;
  onUpdateItems: (items: RecipeItem[]) => void;
  onAddPackaging: () => void;
}

const PackagingItemsSection: React.FC<PackagingItemsSectionProps> = ({
  packagingItems,
  ingredients,
  getIngredientName,
  getIngredientUnit,
  getRecipeName,
  getRecipeUnit,
  onUpdateItems,
  onAddPackaging
}) => {
  const updatePackagingItem = (index: number, field: keyof RecipeItem, value: any) => {
    const newItems = [...packagingItems];
    newItems[index] = { ...newItems[index], [field]: value };
    onUpdateItems(newItems);
  };

  const removePackagingItem = (index: number) => {
    onUpdateItems(packagingItems.filter((_, i) => i !== index));
  };

  return (
    <div className="border-t pt-3 mt-3">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium">Упаковка</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={onAddPackaging}
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
                updatePackagingItem(idx, field, value);
              }}
              onRemove={(idx) => {
                removePackagingItem(idx);
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
  );
};

export default PackagingItemsSection;
