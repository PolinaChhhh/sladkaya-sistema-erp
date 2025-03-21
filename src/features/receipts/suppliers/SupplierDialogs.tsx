
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Supplier } from '@/store/recipeStore';
import SupplierForm from '../SupplierForm';
import DeleteConfirmDialog from '../DeleteConfirmDialog';

interface SupplierDialogsProps {
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
  selectedSupplier: Supplier | null;
  onCreateSupplier: () => void;
  onUpdateSupplier: () => void;
  onDeleteSupplier: () => void;
}

const SupplierDialogs: React.FC<SupplierDialogsProps> = ({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  formData,
  setFormData,
  selectedSupplier,
  onCreateSupplier,
  onUpdateSupplier,
  onDeleteSupplier
}) => {
  return (
    <>
      {/* Create Supplier Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <SupplierForm 
          title="Добавить поставщика"
          formData={formData}
          setFormData={setFormData}
          onCancel={() => setIsCreateDialogOpen(false)}
          onSubmit={onCreateSupplier}
          submitLabel="Добавить"
        />
      </Dialog>
      
      {/* Edit Supplier Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <SupplierForm 
          title="Редактировать поставщика"
          formData={formData}
          setFormData={setFormData}
          onCancel={() => setIsEditDialogOpen(false)}
          onSubmit={onUpdateSupplier}
          submitLabel="Сохранить"
        />
      </Dialog>
      
      {/* Delete Supplier Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DeleteConfirmDialog
          title="Удалить поставщика"
          description={`Вы уверены, что хотите удалить поставщика "${selectedSupplier?.name}"?`}
          onCancel={() => setIsDeleteDialogOpen(false)}
          onConfirm={onDeleteSupplier}
        />
      </Dialog>
    </>
  );
};

export default SupplierDialogs;
