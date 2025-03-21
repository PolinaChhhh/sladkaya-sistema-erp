
import React from 'react';
import { useBuyerForm } from './buyers/useBuyerForm';
import BuyerListHeader from './buyers/BuyerListHeader';
import BuyersTable from './buyers/BuyersTable';
import BuyerDialogs from './buyers/BuyerDialogs';
import EmptyState from '../receipts/EmptyState';

const BuyersList = () => {
  const {
    formData,
    setFormData,
    selectedBuyer,
    searchTerm,
    setSearchTerm,
    filteredBuyers,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    initCreateForm,
    initEditForm,
    initDeleteBuyer,
    handleCreateBuyer,
    handleUpdateBuyer,
    handleDeleteBuyer
  } = useBuyerForm();
  
  return (
    <div>
      <BuyerListHeader 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddBuyer={initCreateForm}
      />
      
      {filteredBuyers.length > 0 ? (
        <BuyersTable
          buyers={filteredBuyers}
          onEdit={initEditForm}
          onDelete={initDeleteBuyer}
        />
      ) : (
        <EmptyState
          title="Нет клиентов"
          description="Добавьте клиентов, чтобы отслеживать отгрузки продукции"
          buttonText="Добавить клиента"
          onAction={initCreateForm}
        />
      )}
      
      <BuyerDialogs
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        formData={formData}
        setFormData={setFormData}
        selectedBuyer={selectedBuyer}
        onCreateBuyer={handleCreateBuyer}
        onUpdateBuyer={handleUpdateBuyer}
        onDeleteBuyer={handleDeleteBuyer}
      />
    </div>
  );
};

export default BuyersList;
