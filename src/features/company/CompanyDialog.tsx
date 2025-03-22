
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { useCompanyDialog } from './useCompanyDialog';
import CompanyForm from './CompanyForm';

interface CompanyDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CompanyDialog: React.FC<CompanyDialogProps> = ({ isOpen, setIsOpen }) => {
  const { formData, setFormData, handleSave } = useCompanyDialog();
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <CompanyForm 
        formData={formData}
        setFormData={setFormData}
        onCancel={() => setIsOpen(false)}
        onSubmit={handleSave}
      />
    </Dialog>
  );
};

export default CompanyDialog;
