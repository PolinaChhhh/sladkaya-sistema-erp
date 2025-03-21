
import { useState } from 'react';
import { useStore, Supplier } from '@/store/recipeStore';

interface SupplierFormData {
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  tin: string;
  legalAddress: string;
  physicalAddress: string;
  bankDetails: string;
}

export const useSupplierForm = () => {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<SupplierFormData>({
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
  
  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (supplier.contactPerson && supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()))
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
  
  const initEditForm = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setFormData({
      name: supplier.name,
      contactPerson: supplier.contactPerson || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
      tin: supplier.tin || '',
      legalAddress: supplier.legalAddress || '',
      physicalAddress: supplier.physicalAddress || '',
      bankDetails: supplier.bankDetails || '',
    });
    setIsEditDialogOpen(true);
  };
  
  const handleCreateSupplier = () => {
    addSupplier({
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
  
  const handleUpdateSupplier = () => {
    if (!selectedSupplier) return;
    
    updateSupplier(selectedSupplier.id, {
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
  
  const initDeleteSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteSupplier = () => {
    if (!selectedSupplier) return;
    deleteSupplier(selectedSupplier.id);
    setIsDeleteDialogOpen(false);
  };
  
  return {
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
  };
};
