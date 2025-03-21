
import React, { useState, useEffect } from 'react';
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Recipe } from '@/store/recipeStore';
import { ProductionFormData } from '../hooks/useProductionPage';
import { AlertCircle } from 'lucide-react';

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
  
  // Filtered recipes - only show finished products for the first step
  const finishedRecipes = recipes.filter(r => r.category === 'finished');
  
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
            <div>
              <Label htmlFor="recipe">Продукт</Label>
              <Select
                value={formData.recipeId}
                onValueChange={(value) => onFormDataChange({ recipeId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите продукт" />
                </SelectTrigger>
                <SelectContent>
                  {finishedRecipes.map((recipe) => (
                    <SelectItem key={recipe.id} value={recipe.id}>
                      {recipe.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {currentStep === 'enter-quantity' && (
            <>
              <div>
                <Label htmlFor="quantity">Количество</Label>
                <div className="flex">
                  <Input
                    id="quantity"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={formData.quantity}
                    onChange={(e) => onFormDataChange({ quantity: parseFloat(e.target.value) || 0 })}
                  />
                  <span className="ml-2 flex items-center text-sm">{outputUnit}</span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="date">Дата производства</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => onFormDataChange({ date: e.target.value })}
                />
              </div>
            </>
          )}
          
          {currentStep === 'select-semifinals' && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Требуемые полуфабрикаты</h3>
              
              {requiredSemiFinals.length > 0 ? (
                <div className="space-y-2 border rounded-md p-3">
                  {requiredSemiFinals.map((semiFinal) => (
                    <div key={semiFinal.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`semi-final-${semiFinal.id}`}
                        checked={formData.semiFinalsToProduce?.includes(semiFinal.id) ?? true}
                        onCheckedChange={() => toggleSemiFinal(semiFinal.id)}
                      />
                      <Label htmlFor={`semi-final-${semiFinal.id}`} className="text-sm font-normal">
                        {semiFinal.name} (требуется {semiFinal.amount.toFixed(2)})
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center p-3 text-sm text-amber-600 bg-amber-50 rounded-md">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <span>У данного продукта нет полуфабрикатов</span>
                </div>
              )}
              
              <div className="pt-2">
                <p className="text-xs text-gray-500">
                  Выбранные полуфабрикаты будут произведены автоматически перед основным продуктом
                </p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          {currentStep !== 'select-recipe' && (
            <Button type="button" variant="outline" onClick={handlePrevStep}>
              Назад
            </Button>
          )}
          
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          
          <Button type="submit" className="bg-cream-600 hover:bg-cream-700">
            {currentStep === 'select-semifinals' ? 'Сохранить' : 'Далее'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default ProductionForm;
