
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface DeleteConfirmDialogProps {
  name: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({ 
  name, 
  onCancel, 
  onConfirm 
}) => {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Удалить рецепт</DialogTitle>
      </DialogHeader>
      <div className="py-3">
        <p className="text-gray-700">
          Вы уверены, что хотите удалить рецепт "{name}"? Это действие нельзя отменить.
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
