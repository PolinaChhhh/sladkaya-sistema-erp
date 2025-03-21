
import React, { useMemo } from 'react';
import { Package, Package2 } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductionBatch, Recipe } from '@/store/types';
import EmptyState from './EmptyState';
import { Badge } from '@/components/ui/badge';

interface InStockRecipesProps {
  recipes: Recipe[];
  productions: ProductionBatch[];
  getRecipeUnit: (id: string) => string;
}

interface StockItem {
  recipeId: string;
  recipeName: string;
  quantity: number;
  unit: string;
  lastProduced: string | null;
  category: string;
}

const InStockRecipes: React.FC<InStockRecipesProps> = ({ 
  recipes, 
  productions,
  getRecipeUnit
}) => {
  const inStockItems = useMemo(() => {
    // Calculate in-stock items by summing up all productions for each recipe
    const stockMap: Record<string, StockItem> = {};
    
    // Initialize with all recipes (even those with 0 quantity)
    recipes.forEach(recipe => {
      stockMap[recipe.id] = {
        recipeId: recipe.id,
        recipeName: recipe.name,
        quantity: 0,
        unit: getRecipeUnit(recipe.id),
        lastProduced: recipe.lastProduced,
        category: recipe.category || 'semi-finished' // Default for backward compatibility
      };
    });
    
    // Add up all production quantities
    productions.forEach(production => {
      if (stockMap[production.recipeId]) {
        stockMap[production.recipeId].quantity += production.quantity;
      }
    });
    
    // Convert to array and sort by name
    return Object.values(stockMap)
      .filter(item => item.quantity > 0) // Only show items with stock
      .sort((a, b) => a.recipeName.localeCompare(b.recipeName));
  }, [recipes, productions, getRecipeUnit]);

  // If no items in stock, show empty state
  if (inStockItems.length === 0) {
    return (
      <EmptyState 
        icon={Package}
        title="Нет продукции на складе"
        description="Здесь будет отображаться готовая продукция"
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-confection-50 px-6 py-4 border-b">
          <CardTitle className="text-lg flex items-center">
            <Package2 className="mr-2 h-5 w-5 text-confection-600" />
            Продукция на складе
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[35%]">Название</TableHead>
                <TableHead className="w-[15%]">Категория</TableHead>
                <TableHead className="w-[15%]">Количество</TableHead>
                <TableHead className="w-[15%]">Ед. изм.</TableHead>
                <TableHead className="w-[20%]">Посл. производство</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inStockItems.map((item) => (
                <TableRow key={item.recipeId}>
                  <TableCell className="font-medium">{item.recipeName}</TableCell>
                  <TableCell>
                    <Badge className={item.category === 'semi-finished' 
                      ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' 
                      : 'bg-green-100 text-green-800 hover:bg-green-100'
                    }>
                      {item.category === 'semi-finished' ? 'Полуфабрикат' : 'Готовый продукт'}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>
                    {item.lastProduced 
                      ? new Date(item.lastProduced).toLocaleDateString('ru-RU') 
                      : 'Никогда'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InStockRecipes;
