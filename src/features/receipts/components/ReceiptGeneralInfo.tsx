
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Supplier } from '@/store/recipeStore';

interface ReceiptGeneralInfoProps {
  supplierId: string;
  setSupplierId: (id: string) => void;
  date: string;
  setDate: (date: string) => void;
  referenceNumber: string;
  setReferenceNumber: (ref: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  totalAmount: number;
  suppliers: Supplier[];
}

const ReceiptGeneralInfo: React.FC<ReceiptGeneralInfoProps> = ({
  supplierId,
  setSupplierId,
  date,
  setDate,
  referenceNumber,
  setReferenceNumber,
  notes,
  setNotes,
  totalAmount,
  suppliers
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="supplier">Поставщик *</Label>
          {suppliers.length > 0 ? (
            <Select 
              value={supplierId}
              onValueChange={(value) => setSupplierId(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите поставщика" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="text-sm text-red-500">
              Сначала добавьте поставщиков
            </div>
          )}
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="date">Дата *</Label>
          <Input 
            id="date" 
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="referenceNumber">Номер накладной</Label>
          <Input 
            id="referenceNumber" 
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            placeholder="Введите номер накладной"
          />
        </div>
        
        <div className="grid gap-2">
          <Label>Итоговая сумма</Label>
          <div className="h-10 flex items-center px-3 py-2 border rounded-md bg-gray-50">
            {totalAmount.toFixed(2)} ₽
          </div>
        </div>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="notes">Примечания</Label>
        <Textarea 
          id="notes" 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Введите примечания"
          rows={2}
        />
      </div>
    </>
  );
};

export default ReceiptGeneralInfo;
