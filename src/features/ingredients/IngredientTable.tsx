
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
    'Ингредиент': { variant: 'outline', className: 'bg-[#D3E4FD] text-blue-700 hover:bg-[#D3E4FD]/80 border-[#D3E4FD]' },
    'Молочные': { variant: 'outline', className: 'bg-[#F2FCE2] text-green-700 hover:bg-[#F2FCE2]/80 border-[#F2FCE2]' },
    'Мука': { variant: 'outline', className: 'bg-[#FEF7CD] text-amber-700 hover:bg-[#FEF7CD]/80 border-[#FEF7CD]' },
    'Упаковка': { variant: 'outline', className: 'bg-[#FFDEE2] text-rose-700 hover:bg-[#FFDEE2]/80 border-[#FFDEE2]' },
  };
  
  // For custom types, generate a consistent pastel color based on the type string
  if (!typeMap[type]) {
    const pastelColors = [
      { variant: 'outline' as const, className: 'bg-[#E5DEFF] text-indigo-700 hover:bg-[#E5DEFF]/80 border-[#E5DEFF]' }, // Soft Purple
      { variant: 'outline' as const, className: 'bg-[#FDE1D3] text-orange-700 hover:bg-[#FDE1D3]/80 border-[#FDE1D3]' }, // Soft Peach
      { variant: 'outline' as const, className: 'bg-[#FEC6A1] text-amber-800 hover:bg-[#FEC6A1]/80 border-[#FEC6A1]' }, // Soft Orange
      { variant: 'outline' as const, className: 'bg-[#F1F0FB] text-gray-700 hover:bg-[#F1F0FB]/80 border-[#F1F0FB]' }, // Soft Gray
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
