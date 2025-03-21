
import React from 'react';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ProductionBatch } from '@/store/types';

interface EditProductionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  production: ProductionBatch | null;
  formData: {
    quantity: number;
    date: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    quantity: number;
    date: string;
  }>>;
  onSubmit: () => void;
  recipeOutput: string;
  calculateCost: (recipeId: string, quantity: number) => number;
}

const EditProductionDialog: React.FC<EditProductionDialogProps> = ({
  isOpen,
  onClose,
  production,
  formData,
  setFormData,
  onSubmit,
  recipeOutput,
  calculateCost
}) => {
  if (!production) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Редактировать производство</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="quantity">Количество</Label>
            <Input 
              id="quantity" 
              type="number"
              min="0.1"
              step="0.1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
            />
            <p className="text-xs text-gray-500">
              Единица измерения: {recipeOutput}
            </p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="date">Дата производства</Label>
            <Input 
              id="date" 
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          
          <div className="mt-2 p-3 bg-mint-50 rounded-md border border-mint-200">
            <div className="flex items-center text-sm font-medium text-mint-800 mb-1">
              <Info className="h-4 w-4 mr-1.5" />
              Расчет себестоимости
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Общая себестоимость: <span className="font-medium">{calculateCost(production.recipeId, formData.quantity).toFixed(2)} ₽</span>
            </p>
            <p className="text-sm text-gray-600">
              Себестоимость за единицу: <span className="font-medium">
                {(calculateCost(production.recipeId, formData.quantity) / formData.quantity).toFixed(2)} ₽/{recipeOutput}
              </span>
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button className="bg-mint-600 hover:bg-mint-700" onClick={onSubmit}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductionDialog;
