
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProfitabilityData } from '../types/reports';
import { cn } from '@/lib/utils';

interface ProductProfitabilityTableProps {
  data: ProfitabilityData[];
}

const getProfitabilityColor = (profitability: number): string => {
  if (profitability < 0) return 'bg-red-100';
  if (profitability < 20) return 'bg-red-50';
  if (profitability < 50) return 'bg-yellow-50';
  return 'bg-green-50';
};

const formatNumber = (value: number): string => {
  return value.toLocaleString('ru-RU', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
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
              <TableCell className="text-right">{formatNumber(item.quantitySold)} {item.unit}</TableCell>
              <TableCell className="text-right">{formatNumber(item.totalCost)}</TableCell>
              <TableCell className="text-right">{formatNumber(item.totalRevenue)}</TableCell>
              <TableCell className={cn(
                "text-right",
                item.grossProfit < 0 ? "text-red-600 font-medium" : ""
              )}>
                {formatNumber(item.grossProfit)}
              </TableCell>
              <TableCell className={cn(
                "text-right",
                item.profitabilityPercent < 0 ? "text-red-600 font-medium" : ""
              )}>
                {formatNumber(item.profitabilityPercent)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductProfitabilityTable;
