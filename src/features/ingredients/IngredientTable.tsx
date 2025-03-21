
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

// Function to determine badge variant and custom class based on ingredient type
const getTypeBadgeProps = (type: string): { variant: "default" | "secondary" | "destructive" | "outline", className: string } => {
  // Base pastel color palette for different ingredient types
  const typeMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", className: string }> = {
    'Ингредиент': { variant: 'outline', className: 'bg-blue-50 text-blue-700 hover:bg-blue-50/80 border-blue-100' },
    'Молочные': { variant: 'outline', className: 'bg-green-50 text-green-700 hover:bg-green-50/80 border-green-100' },
    'Мука': { variant: 'outline', className: 'bg-amber-50 text-amber-700 hover:bg-amber-50/80 border-amber-100' },
    'Упаковка': { variant: 'outline', className: 'bg-rose-50 text-rose-700 hover:bg-rose-50/80 border-rose-100' },
  };
  
  // For custom types, generate a consistent pastel color based on the type string
  if (!typeMap[type]) {
    const pastelColors = [
      { variant: 'outline' as const, className: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-50/80 border-indigo-100' }, // Soft Purple
      { variant: 'outline' as const, className: 'bg-orange-50 text-orange-700 hover:bg-orange-50/80 border-orange-100' }, // Soft Peach
      { variant: 'outline' as const, className: 'bg-amber-50 text-amber-700 hover:bg-amber-50/80 border-amber-100' }, // Soft Orange
      { variant: 'outline' as const, className: 'bg-gray-50 text-gray-700 hover:bg-gray-50/80 border-gray-100' }, // Soft Gray
    ];
    
    // Use hash of string to select a consistent pastel color for custom types
    const hash = type.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return pastelColors[hash % pastelColors.length];
  }
  
  return typeMap[type];
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
          {ingredients.map((ingredient) => {
            const { variant, className } = getTypeBadgeProps(ingredient.type);
            return (
              <TableRow key={ingredient.id}>
                <TableCell className="font-medium">{ingredient.name}</TableCell>
                <TableCell>
                  <Badge variant={variant} className={className}>
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
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default IngredientTable;
