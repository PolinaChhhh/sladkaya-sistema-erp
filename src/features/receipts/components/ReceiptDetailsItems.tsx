
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { ReceiptItem } from '@/store/recipeStore';

interface ReceiptDetailsItemsProps {
  items: ReceiptItem[];
  getIngredientName: (id: string) => string;
  getIngredientUnit: (id: string) => string;
}

const ReceiptDetailsItems: React.FC<ReceiptDetailsItemsProps> = ({
  items,
  getIngredientName,
  getIngredientUnit
}) => {
  return (
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
            {items.map((item) => (
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
  );
};

export default ReceiptDetailsItems;
