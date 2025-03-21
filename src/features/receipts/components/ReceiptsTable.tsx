
import React from 'react';
import { Receipt } from '@/store/recipeStore';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { FileText, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface ReceiptsTableProps {
  receipts: Receipt[];
  getSupplierName: (supplierId: string) => string;
  onViewDetails: (receipt: Receipt) => void;
  onEdit: (receipt: Receipt) => void;
  onDelete: (receipt: Receipt) => void;
}

const ReceiptsTable: React.FC<ReceiptsTableProps> = ({
  receipts,
  getSupplierName,
  onViewDetails,
  onEdit,
  onDelete
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch (e) {
      return 'Неизвестная дата';
    }
  };

  return (
    <div className="glass rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Дата</TableHead>
            <TableHead>Поставщик</TableHead>
            <TableHead>Номер накладной</TableHead>
            <TableHead>Сумма</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {receipts.map((receipt) => (
            <TableRow key={receipt.id}>
              <TableCell>{formatDate(receipt.date)}</TableCell>
              <TableCell className="font-medium">{getSupplierName(receipt.supplierId)}</TableCell>
              <TableCell>{receipt.referenceNumber || "-"}</TableCell>
              <TableCell>{receipt.totalAmount.toFixed(2)} ₽</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onViewDetails(receipt)}>
                    <FileText className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(receipt)}>
                    <Edit className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(receipt)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReceiptsTable;
