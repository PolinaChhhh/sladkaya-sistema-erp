
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { HistoryIcon } from 'lucide-react';
import { ProductionBatch, Recipe, ShippingDocument } from '@/store/types';
import MovementHistoryHeader from './MovementHistoryHeader';
import MovementHistoryTable from './MovementHistoryTable';
import { useMovementHistory } from './useMovementHistory';

interface ProductMovementHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe | null;
  productions: ProductionBatch[];
  shippings: ShippingDocument[];
  getRecipeUnit: (id: string) => string;
}

const ProductMovementHistory: React.FC<ProductMovementHistoryProps> = ({
  isOpen,
  onClose,
  recipe,
  productions,
  shippings,
  getRecipeUnit
}) => {
  const [dateFilter, setDateFilter] = useState('');
  
  const movementHistory = useMovementHistory(recipe, productions, shippings, dateFilter);
  
  if (!recipe) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HistoryIcon className="h-5 w-5" />
            История движения продукта: {recipe.name}
          </DialogTitle>
          <DialogDescription>
            Отслеживание производства и отгрузок для продукта
          </DialogDescription>
        </DialogHeader>
        
        <MovementHistoryHeader 
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />
        
        <MovementHistoryTable 
          movementHistory={movementHistory}
          recipe={recipe}
          getRecipeUnit={getRecipeUnit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductMovementHistory;
