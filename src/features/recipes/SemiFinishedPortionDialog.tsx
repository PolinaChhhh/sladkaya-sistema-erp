
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Recipe } from '@/store/types';

interface SemiFinishedPortionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  semiFinishedRecipe: Recipe;
  onConfirm: (portionSize: number) => void;
}

const SemiFinishedPortionDialog: React.FC<SemiFinishedPortionDialogProps> = ({
  isOpen,
  onClose,
  semiFinishedRecipe,
  onConfirm
}) => {
  const [portionSize, setPortionSize] = useState<number>(100);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(portionSize);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Добавить "{semiFinishedRecipe.name}" как ингредиенты</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="portionSize" className="text-right col-span-2">
                Количество ({semiFinishedRecipe.outputUnit}):
              </Label>
              <div className="col-span-2">
                <Input
                  id="portionSize"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={portionSize}
                  onChange={(e) => setPortionSize(parseFloat(e.target.value) || 0)}
                  placeholder={`Введите количество в ${semiFinishedRecipe.outputUnit}`}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="text-sm text-gray-500 col-span-4 mt-2">
              Система разложит полуфабрикат на ингредиенты пропорционально указанному количеству
              и добавит их в рецепт.
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit">Добавить ингредиенты</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SemiFinishedPortionDialog;
