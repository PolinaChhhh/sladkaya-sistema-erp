
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProfitabilityData } from '../../types/reports';
import { cn } from '@/lib/utils';
import { formatNumber, getProfitabilityColor } from '../../utils/formatUtils';

interface ProfitabilityTableViewProps {
  data: ProfitabilityData[];
}

const ProfitabilityTableView: React.FC<ProfitabilityTableViewProps> = ({ data }) => {
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
              className={getProfitabilityColor(item.profitabilityPercent)}
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

export default ProfitabilityTableView;
