
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useStore, Receipt } from '@/store/recipeStore';
import { format } from 'date-fns';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

interface ReceiptDetailsProps {
  receipt: Receipt;
  onClose: () => void;
}

const ReceiptDetails: React.FC<ReceiptDetailsProps> = ({ receipt, onClose }) => {
  const { suppliers, ingredients } = useStore();
  
  const getSupplierName = (id: string) => {
    const supplier = suppliers.find(s => s.id === id);
    return supplier ? supplier.name : 'Неизвестный поставщик';
  };
  
  const getIngredientName = (id: string) => {
    const ingredient = ingredients.find(i => i.id === id);
    return ingredient ? ingredient.name : 'Неизвестный ингредиент';
  };
  
  const getIngredientUnit = (id: string) => {
    const ingredient = ingredients.find(i => i.id === id);
    return ingredient ? ingredient.unit : '';
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch (e) {
      return 'Неизвестная дата';
    }
  };

  return (
    <DialogContent className="sm:max-w-3xl">
      <DialogHeader>
        <DialogTitle>Детали поступления</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Поставщик</h4>
            <p className="text-lg font-medium">{getSupplierName(receipt.supplierId)}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Дата</h4>
            <p className="text-lg font-medium">{formatDate(receipt.date)}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Номер накладной</h4>
            <p className="text-lg font-medium">{receipt.referenceNumber || "-"}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Сумма</h4>
            <p className="text-lg font-medium">{receipt.totalAmount.toFixed(2)} ₽</p>
          </div>
        </div>
        
        {receipt.notes && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">Примечания</h4>
            <p className="text-md">{receipt.notes}</p>
          </div>
        )}
        
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Ингредиенты</h4>
          <div className="glass rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ингредиент</TableHead>
                  <TableHead>Количество</TableHead>
                  <TableHead>Цена за ед.</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Остаток</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipt.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{getIngredientName(item.ingredientId)}</TableCell>
                    <TableCell>{item.quantity} {getIngredientUnit(item.ingredientId)}</TableCell>
                    <TableCell>{item.unitPrice.toFixed(2)} ₽</TableCell>
                    <TableCell>{item.totalPrice.toFixed(2)} ₽</TableCell>
                    <TableCell>
                      {item.remainingQuantity} {getIngredientUnit(item.ingredientId)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button onClick={onClose}>
          Закрыть
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ReceiptDetails;
