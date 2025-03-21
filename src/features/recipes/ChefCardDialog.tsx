
import React from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ChefCard from './chef-card/ChefCard';
import { Recipe } from '@/store/types';

interface ChefCardDialogProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (recipe: Recipe) => void;
  getIngredientName: (id: string) => string;
  getIngredientUnit: (id: string) => string;
  getRecipeName: (id: string) => string;
  getRecipeUnit: (id: string) => string;
}

const ChefCardDialog: React.FC<ChefCardDialogProps> = ({
  recipe,
  isOpen,
  onClose,
  onEdit,
  getIngredientName,
  getIngredientUnit,
  getRecipeName,
  getRecipeUnit
}) => {
  if (!recipe) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden">
        <Button
          className="absolute right-4 top-4 z-10 rounded-full h-8 w-8 p-0 bg-white/80"
          variant="ghost"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        
        <ChefCard
          recipe={recipe}
          onEdit={onEdit}
          getIngredientName={getIngredientName}
          getIngredientUnit={getIngredientUnit}
          getRecipeName={getRecipeName}
          getRecipeUnit={getRecipeUnit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ChefCardDialog;
