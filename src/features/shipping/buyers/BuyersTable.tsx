
import React from 'react';
import { Buyer } from '@/store/recipeStore';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

interface BuyersTableProps {
  buyers: Buyer[];
  onEdit: (buyer: Buyer) => void;
  onDelete: (buyer: Buyer) => void;
}

const BuyersTable: React.FC<BuyersTableProps> = ({
  buyers,
  onEdit,
  onDelete
}) => {
  return (
    <div className="glass rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>ИНН</TableHead>
            <TableHead>Контактное лицо</TableHead>
            <TableHead>Телефон</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buyers.map((buyer) => (
            <TableRow key={buyer.id}>
              <TableCell className="font-medium">{buyer.name}</TableCell>
              <TableCell>{buyer.tin || "-"}</TableCell>
              <TableCell>{buyer.contactPerson || "-"}</TableCell>
              <TableCell>{buyer.phone || "-"}</TableCell>
              <TableCell>{buyer.email || "-"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(buyer)}>
                    <Edit className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(buyer)}>
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

export default BuyersTable;
