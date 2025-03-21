
import React from 'react';
import { Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Ingredient } from '@/store/types';
import { format } from 'date-fns';

interface IngredientTableProps {
  ingredients: Ingredient[];
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (ingredient: Ingredient) => void;
}

// Function to determine badge variant based on ingredient type
const getTypeBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
  const typeMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    'Ингредиент': 'default',
    'Молочные': 'secondary',
    'Мука': 'outline',
    'Упаковка': 'destructive',
  };
  
  return typeMap[type] || 'default';
};

const IngredientTable: React.FC<IngredientTableProps> = ({ 
  ingredients, 
  onEdit, 
  onDelete 
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch (e) {
      return 'Не указано';
    }
  };

  return (
    <div className="glass rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Тип</TableHead>
            <TableHead>Стоимость</TableHead>
            <TableHead>Количество</TableHead>
            <TableHead>Последняя закупка</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ingredients.map((ingredient) => (
            <TableRow key={ingredient.id}>
              <TableCell className="font-medium">{ingredient.name}</TableCell>
              <TableCell>
                <Badge variant={getTypeBadgeVariant(ingredient.type)}>
                  {ingredient.type || 'Ингредиент'}
                </Badge>
              </TableCell>
              <TableCell>{ingredient.cost.toFixed(2)} ₽/{ingredient.unit}</TableCell>
              <TableCell>
                <span className={
                  ingredient.quantity <= 0 
                    ? "text-red-500 font-medium" 
                    : ingredient.quantity < 5 
                      ? "text-orange-500 font-medium"
                      : ""
                }>
                  {ingredient.quantity} {ingredient.unit}
                </span>
              </TableCell>
              <TableCell>{formatDate(ingredient.lastPurchaseDate)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(ingredient)}>
                    <Edit className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(ingredient)}>
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

export default IngredientTable;
