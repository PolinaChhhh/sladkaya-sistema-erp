
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Buyer } from '@/store/recipeStore';
import BuyerForm from '../BuyerForm';
import DeleteConfirmDialog from '../../receipts/DeleteConfirmDialog';

interface BuyerDialogsProps {
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  formData: {
    name: string;
    contactPerson: string;
    phone: string;
    email: string;
    address: string;
    tin: string;
    legalAddress: string;
    physicalAddress: string;
    bankDetails: string;
  };
  setFormData: (data: any) => void;
  selectedBuyer: Buyer | null;
  onCreateBuyer: () => void;
  onUpdateBuyer: () => void;
  onDeleteBuyer: () => void;
}

const BuyerDialogs: React.FC<BuyerDialogsProps> = ({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  formData,
  setFormData,
  selectedBuyer,
  onCreateBuyer,
  onUpdateBuyer,
  onDeleteBuyer
}) => {
  return (
    <>
      {/* Create Buyer Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <BuyerForm 
          title="Добавить клиента"
          formData={formData}
          setFormData={setFormData}
          onCancel={() => setIsCreateDialogOpen(false)}
          onSubmit={onCreateBuyer}
          submitLabel="Добавить"
        />
      </Dialog>
      
      {/* Edit Buyer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <BuyerForm 
          title="Редактировать клиента"
          formData={formData}
          setFormData={setFormData}
          onCancel={() => setIsEditDialogOpen(false)}
          onSubmit={onUpdateBuyer}
          submitLabel="Сохранить"
        />
      </Dialog>
      
      {/* Delete Buyer Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DeleteConfirmDialog
          title="Удалить клиента"
          description={`Вы уверены, что хотите удалить клиента "${selectedBuyer?.name}"?`}
          onCancel={() => setIsDeleteDialogOpen(false)}
          onConfirm={onDeleteBuyer}
        />
      </Dialog>
    </>
  );
};

export default BuyerDialogs;
