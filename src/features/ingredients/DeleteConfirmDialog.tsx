
import React from 'react';
import { 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
        <DialogTitle>Удалить ингредиент</DialogTitle>
      </DialogHeader>
      <div className="py-3">
        <p className="text-gray-700">
          Вы уверены, что хотите удалить ингредиент "{name}"? Это действие нельзя отменить.
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
