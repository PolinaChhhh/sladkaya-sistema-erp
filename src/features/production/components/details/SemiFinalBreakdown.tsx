
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SemiFinalIngredient {
  name: string;
  amount: number;
  unit: string;
  cost: number;
}

interface SemiFinalItem {
  name: string;
  quantity: number;
  unit: string;
  cost: number;
  ingredients: SemiFinalIngredient[];
}

interface SemiFinalBreakdownProps {
  semiFinalBreakdown: SemiFinalItem[];
}

const SemiFinalBreakdown: React.FC<SemiFinalBreakdownProps> = ({ semiFinalBreakdown }) => {
  if (semiFinalBreakdown.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Нет данных о полуфабрикатах
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {semiFinalBreakdown.map((semi, index) => (
        <div key={index} className="glass rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={4}>{semi.name} ({semi.quantity} {semi.unit})</TableHead>
              </TableRow>
              <TableRow>
                <TableHead>Ингредиент</TableHead>
                <TableHead>Количество</TableHead>
                <TableHead>Стоимость за ед.</TableHead>
                <TableHead>Общая стоимость</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {semi.ingredients.map((ing, idx) => (
                <TableRow key={idx}>
                  <TableCell>{ing.name}</TableCell>
                  <TableCell>{ing.amount.toFixed(2)} {ing.unit}</TableCell>
                  <TableCell>{(ing.cost / ing.amount).toFixed(2)} ₽/{ing.unit}</TableCell>
                  <TableCell>{ing.cost.toFixed(2)} ₽</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="font-medium text-right">Итого:</TableCell>
                <TableCell className="font-medium">{semi.cost.toFixed(2)} ₽</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
};

export default SemiFinalBreakdown;
