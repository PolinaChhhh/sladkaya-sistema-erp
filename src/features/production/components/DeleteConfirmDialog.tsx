
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface DeleteConfirmDialogProps {
  recipeName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({ 
  recipeName, 
  onCancel, 
  onConfirm 
}) => {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Удалить запись о производстве</DialogTitle>
      </DialogHeader>
      <div className="py-3">
        <p className="text-gray-700">
          Вы уверены, что хотите удалить запись о производстве "{recipeName}"? 
          Это действие нельзя отменить, но ингредиенты будут возвращены на склад.
        </p>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          Удалить
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default DeleteConfirmDialog;
