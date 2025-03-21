
import React from 'react';
import { format } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ProductionBatch } from '@/store/recipeStore';
import { Edit, Trash2, Eye } from 'lucide-react';

interface ProductionListProps {
  productions: ProductionBatch[];
  getRecipeName: (id: string) => string;
  getRecipeOutput: (id: string) => string;
  onEdit: (production: ProductionBatch) => void;
  onDelete: (production: ProductionBatch) => void;
  onViewDetails: (production: ProductionBatch) => void;
}

const ProductionList: React.FC<ProductionListProps> = ({
  productions,
  getRecipeName,
  getRecipeOutput,
  onEdit,
  onDelete,
  onViewDetails
}) => {
  if (productions.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
        <p className="text-gray-500">Нет записей о производстве</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Дата</TableHead>
            <TableHead>Продукт</TableHead>
            <TableHead>Количество</TableHead>
            <TableHead>Себестоимость</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productions.map((production) => (
            <TableRow key={production.id}>
              <TableCell>
                {format(new Date(production.date), 'dd.MM.yyyy')}
              </TableCell>
              <TableCell className="font-medium">
                {getRecipeName(production.recipeId)}
              </TableCell>
              <TableCell>
                {production.quantity} {getRecipeOutput(production.recipeId)}
              </TableCell>
              <TableCell>{production.cost.toFixed(2)} ₽</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onViewDetails(production)}
                  >
                    <Eye className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onEdit(production)}
                  >
                    <Edit className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onDelete(production)}
                  >
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

export default ProductionList;
