
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteConfirmDialogProps {
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  title,
  description,
  onCancel,
  onConfirm
}) => {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          {description}
        </DialogDescription>
      </DialogHeader>
      
      <DialogFooter className="mt-4">
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
