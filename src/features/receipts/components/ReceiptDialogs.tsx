
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Receipt } from '@/store/recipeStore';
import ReceiptForm from '../ReceiptForm';
import ReceiptDetails from '../ReceiptDetails';
import DeleteConfirmDialog from '../DeleteConfirmDialog';
import { format } from 'date-fns';

interface ReceiptDialogsProps {
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isViewDialogOpen: boolean;
  setIsViewDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  selectedReceipt: Receipt | null;
  handleDeleteReceipt: () => void;
}

const ReceiptDialogs: React.FC<ReceiptDialogsProps> = ({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isViewDialogOpen,
  setIsViewDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  selectedReceipt,
  handleDeleteReceipt
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch (e) {
      return 'Неизвестная дата';
    }
  };

  return (
    <>
      {/* Create Receipt Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <ReceiptForm 
          isCreateMode={true}
          receipt={null}
          onCancel={() => setIsCreateDialogOpen(false)}
        />
      </Dialog>
      
      {/* Edit Receipt Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        {selectedReceipt && (
          <ReceiptForm 
            isCreateMode={false}
            receipt={selectedReceipt}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        )}
      </Dialog>
      
      {/* View Receipt Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        {selectedReceipt && (
          <ReceiptDetails 
            receipt={selectedReceipt}
            onClose={() => setIsViewDialogOpen(false)}
          />
        )}
      </Dialog>
      
      {/* Delete Receipt Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DeleteConfirmDialog
          title="Удалить поступление"
          description={`Вы уверены, что хотите удалить поступление от "${selectedReceipt ? formatDate(selectedReceipt.date) : ''}"?`}
          onCancel={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteReceipt}
        />
      </Dialog>
    </>
  );
};

export default ReceiptDialogs;
