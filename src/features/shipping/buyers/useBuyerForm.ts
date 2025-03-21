
import { useState } from 'react';
import { useStore, Buyer } from '@/store/recipeStore';

interface BuyerFormData {
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  tin: string; // Tax Identification Number
  legalAddress: string;
  physicalAddress: string;
  bankDetails: string;
}

export const useBuyerForm = () => {
  const { buyers, addBuyer, updateBuyer, deleteBuyer } = useStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<BuyerFormData>({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    tin: '',
    legalAddress: '',
    physicalAddress: '',
    bankDetails: '',
  });
  
  const filteredBuyers = buyers.filter(buyer => 
    buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (buyer.contactPerson && buyer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const initCreateForm = () => {
    setFormData({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      tin: '',
      legalAddress: '',
      physicalAddress: '',
      bankDetails: '',
    });
    setIsCreateDialogOpen(true);
  };
  
  const initEditForm = (buyer: Buyer) => {
    setSelectedBuyer(buyer);
    setFormData({
      name: buyer.name,
      contactPerson: buyer.contactPerson || '',
      phone: buyer.phone || '',
      email: buyer.email || '',
      address: buyer.address || '',
      tin: buyer.tin || '',
      legalAddress: buyer.legalAddress || '',
      physicalAddress: buyer.physicalAddress || '',
      bankDetails: buyer.bankDetails || '',
    });
    setIsEditDialogOpen(true);
  };
  
  const handleCreateBuyer = () => {
    addBuyer({
      name: formData.name,
      contactPerson: formData.contactPerson || undefined,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      address: formData.address || undefined,
      tin: formData.tin || undefined,
      legalAddress: formData.legalAddress || undefined,
      physicalAddress: formData.physicalAddress || undefined,
      bankDetails: formData.bankDetails || undefined,
    });
    setIsCreateDialogOpen(false);
  };
  
  const handleUpdateBuyer = () => {
    if (!selectedBuyer) return;
    
    updateBuyer(selectedBuyer.id, {
      name: formData.name,
      contactPerson: formData.contactPerson || undefined,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      address: formData.address || undefined,
      tin: formData.tin || undefined,
      legalAddress: formData.legalAddress || undefined,
      physicalAddress: formData.physicalAddress || undefined,
      bankDetails: formData.bankDetails || undefined,
    });
    setIsEditDialogOpen(false);
  };
  
  const initDeleteBuyer = (buyer: Buyer) => {
    setSelectedBuyer(buyer);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteBuyer = () => {
    if (!selectedBuyer) return;
    deleteBuyer(selectedBuyer.id);
    setIsDeleteDialogOpen(false);
  };
  
  return {
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
  };
};
