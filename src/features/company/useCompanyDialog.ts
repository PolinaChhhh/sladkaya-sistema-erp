
import { useState, useEffect } from 'react';
import { useStore } from '@/store/recipeStore';
import { toast } from 'sonner';

interface CompanyFormData {
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

export const useCompanyDialog = () => {
  const { company, updateCompany } = useStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState<CompanyFormData>({
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
  
  // Load existing company data when the dialog opens
  useEffect(() => {
    if (isDialogOpen && company) {
      setFormData({
        name: company.name,
        contactPerson: company.contactPerson || '',
        phone: company.phone || '',
        email: company.email || '',
        address: company.address || '',
        tin: company.tin || '',
        legalAddress: company.legalAddress || '',
        physicalAddress: company.physicalAddress || '',
        bankDetails: company.bankDetails || '',
      });
    }
  }, [isDialogOpen, company]);
  
  const openDialog = () => {
    setIsDialogOpen(true);
  };
  
  const handleSave = () => {
    try {
      updateCompany({
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
      toast.success('Данные компании сохранены');
    } catch (error) {
      console.error('Error saving company data:', error);
      toast.error('Ошибка при сохранении данных компании');
    }
  };
  
  return {
    isDialogOpen,
    setIsDialogOpen,
    formData,
    setFormData,
    openDialog,
    handleSave,
    hasCompanyData: !!company
  };
};
