
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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

interface BuyerFormProps {
  title: string;
  formData: BuyerFormData;
  setFormData: (data: BuyerFormData) => void;
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
}

const BuyerForm: React.FC<BuyerFormProps> = ({
  title,
  formData,
  setFormData,
  onCancel,
  onSubmit,
  submitLabel
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
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
          <div className="grid gap-2">
            <Label htmlFor="name">Название клиента *</Label>
            <Input 
              id="name" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Введите название клиента"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="tin">ИНН</Label>
            <Input 
              id="tin" 
              value={formData.tin}
              onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
              placeholder="Введите ИНН клиента"
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
              placeholder="Юридический адрес клиента"
              rows={2}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="physicalAddress">Фактический адрес</Label>
            <Textarea 
              id="physicalAddress" 
              value={formData.physicalAddress}
              onChange={(e) => setFormData({ ...formData, physicalAddress: e.target.value })}
              placeholder="Фактический адрес клиента"
              rows={2}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="address">Адрес</Label>
            <Textarea 
              id="address" 
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Адрес клиента"
              rows={2}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="bankDetails">Банковские реквизиты</Label>
            <Textarea 
              id="bankDetails" 
              value={formData.bankDetails}
              onChange={(e) => setFormData({ ...formData, bankDetails: e.target.value })}
              placeholder="Банковские реквизиты клиента"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            {submitLabel}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default BuyerForm;
