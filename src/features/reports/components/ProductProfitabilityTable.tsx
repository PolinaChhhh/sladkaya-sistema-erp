
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProfitabilityData } from '../types/reports';
import { cn } from '@/lib/utils';

interface ProductProfitabilityTableProps {
  data: ProfitabilityData[];
}

const getProfitabilityColor = (profitability: number): string => {
  if (profitability < 50) return 'bg-red-50';
  if (profitability < 60) return 'bg-yellow-50';
  return 'bg-green-50';
};

const ProductProfitabilityTable: React.FC<ProductProfitabilityTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Наименование продукта</TableHead>
            <TableHead className="text-right">Продано, шт</TableHead>
            <TableHead className="text-right">Себестоимость, ₽</TableHead>
            <TableHead className="text-right">Выручка, ₽</TableHead>
            <TableHead className="text-right">Прибыль, ₽</TableHead>
            <TableHead className="text-right">Рентабельность, %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow 
              key={item.recipeId} 
              className={cn(getProfitabilityColor(item.profitabilityPercent))}
            >
              <TableCell className="font-medium">{item.productName}</TableCell>
              <TableCell className="text-right">{item.quantitySold.toFixed(2)}</TableCell>
              <TableCell className="text-right">{item.totalCost.toFixed(2)}</TableCell>
              <TableCell className="text-right">{item.totalRevenue.toFixed(2)}</TableCell>
              <TableCell className="text-right">{item.grossProfit.toFixed(2)}</TableCell>
              <TableCell className="text-right">{item.profitabilityPercent.toFixed(2)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductProfitabilityTable;
