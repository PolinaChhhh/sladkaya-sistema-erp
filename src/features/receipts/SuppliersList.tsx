
import React from 'react';
import EmptyState from './EmptyState';
import SupplierListHeader from './suppliers/SupplierListHeader';
import SuppliersTable from './suppliers/SuppliersTable';
import SupplierDialogs from './suppliers/SupplierDialogs';
import { useSupplierForm } from './suppliers/useSupplierForm';

const SuppliersList = () => {
  const {
    formData,
    setFormData,
    selectedSupplier,
    searchTerm,
    setSearchTerm,
    filteredSuppliers,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    initCreateForm,
    initEditForm,
    initDeleteSupplier,
    handleCreateSupplier,
    handleUpdateSupplier,
    handleDeleteSupplier
  } = useSupplierForm();
  
  return (
    <div>
      <SupplierListHeader 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddSupplier={initCreateForm}
      />
      
      {filteredSuppliers.length > 0 ? (
        <SuppliersTable
          suppliers={filteredSuppliers}
          onEdit={initEditForm}
          onDelete={initDeleteSupplier}
        />
      ) : (
        <EmptyState
          title="Нет поставщиков"
          description="Добавьте поставщиков, чтобы отслеживать поступления ингредиентов"
          buttonText="Добавить поставщика"
          onAction={initCreateForm}
        />
      )}
      
      <SupplierDialogs
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        formData={formData}
        setFormData={setFormData}
        selectedSupplier={selectedSupplier}
        onCreateSupplier={handleCreateSupplier}
        onUpdateSupplier={handleUpdateSupplier}
        onDeleteSupplier={handleDeleteSupplier}
      />
    </div>
  );
};

export default SuppliersList;
