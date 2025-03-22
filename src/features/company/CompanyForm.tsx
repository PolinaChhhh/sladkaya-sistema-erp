
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CompanyFormData {
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  tin: string; // Tax Identification Number (ИНН)
  legalAddress: string;
  physicalAddress: string;
  bankDetails: string;
}

interface CompanyFormProps {
  formData: CompanyFormData;
  setFormData: (data: CompanyFormData) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

const CompanyForm: React.FC<CompanyFormProps> = ({
  formData,
  setFormData,
  onCancel,
  onSubmit
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      return; // Don't submit if name is empty
    }
    onSubmit();
  };

  return (
    <DialogContent className="sm:max-w-lg">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Данные компании</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
          <div className="grid gap-2">
            <Label htmlFor="name">Название компании *</Label>
            <Input 
              id="name" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Введите название компании"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="tin">ИНН</Label>
            <Input 
              id="tin" 
              value={formData.tin}
              onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
              placeholder="Введите ИНН компании"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="contactPerson">Контактное лицо</Label>
            <Input 
              id="contactPerson" 
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              placeholder="Введите имя контактного лица"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input 
                id="phone" 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+7 (999) 123-45-67"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@example.com"
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="legalAddress">Юридический адрес</Label>
            <Textarea 
              id="legalAddress" 
              value={formData.legalAddress}
              onChange={(e) => setFormData({ ...formData, legalAddress: e.target.value })}
              placeholder="Юридический адрес компании"
              rows={2}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="physicalAddress">Фактический адрес</Label>
            <Textarea 
              id="physicalAddress" 
              value={formData.physicalAddress}
              onChange={(e) => setFormData({ ...formData, physicalAddress: e.target.value })}
              placeholder="Фактический адрес компании"
              rows={2}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="address">Адрес для корреспонденции</Label>
            <Textarea 
              id="address" 
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Адрес для корреспонденции"
              rows={2}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="bankDetails">Банковские реквизиты</Label>
            <Textarea 
              id="bankDetails" 
              value={formData.bankDetails}
              onChange={(e) => setFormData({ ...formData, bankDetails: e.target.value })}
              placeholder="Банковские реквизиты компании"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button type="submit" className="bg-confection-600 hover:bg-confection-700">
            Сохранить
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default CompanyForm;
