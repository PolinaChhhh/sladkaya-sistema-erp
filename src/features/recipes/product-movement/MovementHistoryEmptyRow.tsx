
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';

const MovementHistoryEmptyRow: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
        Нет данных о движении продукта
      </TableCell>
    </TableRow>
  );
};

export default MovementHistoryEmptyRow;
