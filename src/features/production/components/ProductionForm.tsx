
import React, { useState } from 'react';
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { Recipe } from '@/store/recipeStore';
import { ProductionFormData } from '../hooks/useProductionPage';
import { SelectRecipeStep, QuantityStep, FormFooter } from './form-steps';

interface ProductionFormProps {
  title: string;
  recipes: Recipe[];
  formData: ProductionFormData;
  onFormDataChange: (data: Partial<ProductionFormData>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const ProductionForm: React.FC<ProductionFormProps> = ({
  title,
  recipes,
  formData,
  onFormDataChange,
  onSubmit,
  onCancel
}) => {
  // Track form steps
  const [currentStep, setCurrentStep] = useState<'select-recipe' | 'enter-quantity'>('select-recipe');
  
  // Find the selected recipe to get its unit
  const selectedRecipe = recipes.find(r => r.id === formData.recipeId);
  const outputUnit = selectedRecipe ? selectedRecipe.outputUnit : '';
  
  const handleNextStep = () => {
    if (currentStep === 'select-recipe') {
      // After selecting recipe, go straight to quantity step
      setCurrentStep('enter-quantity');
    } else if (currentStep === 'enter-quantity') {
      // Submit the form when done with quantity
      onSubmit();
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep === 'enter-quantity') {
      setCurrentStep('select-recipe');
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 'enter-quantity') {
      onSubmit();
    } else {
      handleNextStep();
    }
  };
  
  // Отфильтруем рецепты, оставив только готовую продукцию
  const finishedRecipes = recipes.filter(r => r.category === 'finished');
  
  return (
    <DialogContent className="sm:max-w-md">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {currentStep === 'select-recipe' && (
            <SelectRecipeStep 
              recipes={finishedRecipes}
              selectedRecipeId={formData.recipeId}
              onRecipeChange={(value) => onFormDataChange({ recipeId: value })}
            />
          )}
          
          {currentStep === 'enter-quantity' && (
            <QuantityStep
              quantity={formData.quantity}
              onQuantityChange={(value) => onFormDataChange({ quantity: value })}
              date={formData.date}
              onDateChange={(value) => onFormDataChange({ date: value })}
              outputUnit={outputUnit}
            />
          )}
        </div>
        
        <FormFooter
          currentStep={currentStep}
          onPrevious={handlePrevStep}
          onCancel={onCancel}
          onNext={handleNextStep}
        />
      </form>
    </DialogContent>
  );
};

export default ProductionForm;
