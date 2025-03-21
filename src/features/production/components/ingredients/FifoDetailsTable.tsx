
import React from 'react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface FifoDetail {
  receiptId: string;
  referenceNumber?: string;
  date: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface FifoDetailsTableProps {
  fifoDetails: FifoDetail[];
  unit: string;
}

const FifoDetailsTable: React.FC<FifoDetailsTableProps> = ({ fifoDetails, unit }) => {
  if (!fifoDetails || fifoDetails.length === 0) {
    return (
      <p className="text-sm text-gray-500">Нет данных о закупках для этого ингредиента</p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Номер поступления</TableHead>
          <TableHead>Дата</TableHead>
          <TableHead>Количество</TableHead>
          <TableHead>Цена за ед.</TableHead>
          <TableHead>Сумма</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fifoDetails.map((detail, idx) => (
          <TableRow key={idx}>
            <TableCell>{detail.referenceNumber || 'Б/Н'}</TableCell>
            <TableCell>{format(new Date(detail.date), 'dd.MM.yyyy')}</TableCell>
            <TableCell>{detail.quantity.toFixed(2)} {unit}</TableCell>
            <TableCell>{detail.unitPrice.toFixed(2)} ₽</TableCell>
            <TableCell>{detail.totalPrice.toFixed(2)} ₽</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default FifoDetailsTable;
