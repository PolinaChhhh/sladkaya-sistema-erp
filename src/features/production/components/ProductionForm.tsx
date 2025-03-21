
import React, { useState, useEffect } from 'react';
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { Recipe } from '@/store/recipeStore';
import { ProductionFormData } from '../hooks/useProductionPage';
import { SelectRecipeStep, QuantityStep, SemiFinalsStep, FormFooter } from './form-steps';

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
  const [currentStep, setCurrentStep] = useState<'select-recipe' | 'enter-quantity' | 'select-semifinals'>('select-recipe');
  
  // Find the selected recipe to get its unit and required semi-finals
  const selectedRecipe = recipes.find(r => r.id === formData.recipeId);
  const outputUnit = selectedRecipe ? selectedRecipe.outputUnit : '';
  
  // Get required semi-finals for the selected recipe
  const requiredSemiFinals = selectedRecipe 
    ? selectedRecipe.items
        .filter(item => item.type === 'recipe' && item.recipeId)
        .map(item => {
          const semiFinalRecipe = recipes.find(r => r.id === item.recipeId);
          return {
            id: item.recipeId as string,
            name: semiFinalRecipe ? semiFinalRecipe.name : 'Unknown',
            required: true,
            // Calculate the amount based on the selected quantity
            amount: formData.quantity > 0 
              ? (item.amount * formData.quantity / selectedRecipe.output) 
              : item.amount
          };
        })
    : [];
  
  // Check if the selected recipe has semi-finals
  const hasSemiFinals = requiredSemiFinals.length > 0;
  
  // Effect to update the semi-finals to produce when quantity changes
  useEffect(() => {
    if (selectedRecipe && hasSemiFinals && formData.quantity > 0) {
      // Initialize the selected semi-finals in formData with updated amounts
      const semiFinalsToProduce = requiredSemiFinals.map(sf => sf.id);
      onFormDataChange({ 
        semiFinalsToProduce,
        // Always enable auto-production if there are semi-finals
        autoProduceSemiFinals: true
      });
    }
  }, [formData.quantity, selectedRecipe?.id]);
  
  const handleNextStep = () => {
    if (currentStep === 'select-recipe') {
      // After selecting recipe, go straight to quantity step
      setCurrentStep('enter-quantity');
    } else if (currentStep === 'enter-quantity') {
      if (hasSemiFinals) {
        // If recipe requires semi-finals, move to selecting which ones to produce
        setCurrentStep('select-semifinals');
        
        // Initialize the selected semi-finals in formData
        const semiFinalsToProduce = requiredSemiFinals.map(sf => sf.id);
        onFormDataChange({ 
          semiFinalsToProduce,
          // Always enable auto-production if there are semi-finals
          autoProduceSemiFinals: true
        });
      } else {
        // If no semi-finals required, submit the form
        onSubmit();
      }
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep === 'enter-quantity') {
      setCurrentStep('select-recipe');
    } else if (currentStep === 'select-semifinals') {
      setCurrentStep('enter-quantity');
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 'select-semifinals') {
      onSubmit();
    } else {
      handleNextStep();
    }
  };
  
  const toggleSemiFinal = (semiFinalId: string) => {
    const currentSelected = formData.semiFinalsToProduce || [];
    const newSelected = currentSelected.includes(semiFinalId)
      ? currentSelected.filter(id => id !== semiFinalId)
      : [...currentSelected, semiFinalId];
    
    onFormDataChange({ semiFinalsToProduce: newSelected });
  };
  
  return (
    <DialogContent className="sm:max-w-md">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {currentStep === 'select-recipe' && (
            <SelectRecipeStep 
              recipes={recipes}
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
          
          {currentStep === 'select-semifinals' && (
            <SemiFinalsStep
              requiredSemiFinals={requiredSemiFinals}
              selectedSemiFinals={formData.semiFinalsToProduce || []}
              onSemiFinalToggle={toggleSemiFinal}
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
