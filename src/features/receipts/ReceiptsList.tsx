
import React from 'react';
import { useReceiptsList } from './hooks/useReceiptsList';
import ReceiptListHeader from './components/ReceiptListHeader';
import ReceiptsTable from './components/ReceiptsTable';
import ReceiptDialogs from './components/ReceiptDialogs';
import EmptyState from './EmptyState';

const ReceiptsList = () => {
  const {
    searchTerm,
    setSearchTerm,
    sortedReceipts,
    getSupplierName,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    selectedReceipt,
    initCreateForm,
    initEditForm,
    initViewDetails,
    initDeleteReceipt,
    handleDeleteReceipt
  } = useReceiptsList();
  
  return (
    <div>
      <ReceiptListHeader 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddReceipt={initCreateForm}
      />
      
      {sortedReceipts.length > 0 ? (
        <ReceiptsTable 
          receipts={sortedReceipts}
          getSupplierName={getSupplierName}
          onViewDetails={initViewDetails}
          onEdit={initEditForm}
          onDelete={initDeleteReceipt}
        />
      ) : (
        <EmptyState
          title="Нет поступлений"
          description="Добавьте поступления, чтобы отслеживать закупки ингредиентов"
          buttonText="Добавить поступление"
          onAction={initCreateForm}
        />
      )}
      
      <ReceiptDialogs 
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isViewDialogOpen={isViewDialogOpen}
        setIsViewDialogOpen={setIsViewDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        selectedReceipt={selectedReceipt}
        handleDeleteReceipt={handleDeleteReceipt}
      />
    </div>
  );
};

export default ReceiptsList;
