
import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface FormFooterProps {
  currentStep: 'select-recipe' | 'enter-quantity' | 'select-semifinals';
  onPrevious: () => void;
  onCancel: () => void;
  onNext: () => void;
  isSubmitting?: boolean;
}

const FormFooter: React.FC<FormFooterProps> = ({
  currentStep,
  onPrevious,
  onCancel,
  onNext,
  isSubmitting = false
}) => {
  return (
    <DialogFooter>
      {currentStep !== 'select-recipe' && (
        <Button type="button" variant="outline" onClick={onPrevious}>
          Назад
        </Button>
      )}
      
      <Button type="button" variant="outline" onClick={onCancel}>
        Отмена
      </Button>
      
      <Button 
        type="submit" 
        className="bg-cream-600 hover:bg-cream-700"
        disabled={isSubmitting}
      >
        {currentStep === 'select-semifinals' ? 'Сохранить' : 'Далее'}
      </Button>
    </DialogFooter>
  );
};

export default FormFooter;
