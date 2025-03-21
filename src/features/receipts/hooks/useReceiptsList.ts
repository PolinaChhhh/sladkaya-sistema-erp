
import { useState } from 'react';
import { useStore, Receipt } from '@/store/recipeStore';

export const useReceiptsList = () => {
  const { receipts, suppliers, deleteReceipt } = useStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const getSupplierName = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : 'Неизвестный поставщик';
  };
  
  const filteredReceipts = receipts.filter(receipt => {
    const supplierName = getSupplierName(receipt.supplierId);
    return supplierName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           (receipt.referenceNumber && receipt.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()));
  });
  
  const sortedReceipts = [...filteredReceipts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const initCreateForm = () => {
    setIsCreateDialogOpen(true);
  };
  
  const initEditForm = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setIsEditDialogOpen(true);
  };
  
  const initViewDetails = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setIsViewDialogOpen(true);
  };
  
  const initDeleteReceipt = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteReceipt = () => {
    if (!selectedReceipt) return;
    deleteReceipt(selectedReceipt.id);
    setIsDeleteDialogOpen(false);
  };

  return {
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
  };
};
