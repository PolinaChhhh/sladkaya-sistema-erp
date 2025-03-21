
import React from 'react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Recipe, ProductionBatch } from '@/store/recipeStore';

interface ProductionOverviewProps {
  production: ProductionBatch;
  recipe: Recipe;
  ingredientCost: number;
  semiFinalCost: number;
  totalIngredientCosts: number;
  totalCost: number;
}

const ProductionOverview: React.FC<ProductionOverviewProps> = ({
  production,
  recipe,
  ingredientCost,
  semiFinalCost,
  totalIngredientCosts,
  totalCost
}) => {
  // Calculate unit cost
  const unitCost = production.quantity > 0 ? totalCost / production.quantity : 0;

  return (
    <div className="glass rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead colSpan={2}>Общая информация</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Продукт</TableCell>
            <TableCell>{recipe.name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Количество</TableCell>
            <TableCell>{production.quantity} {recipe.outputUnit}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Дата производства</TableCell>
            <TableCell>{format(new Date(production.date), 'dd.MM.yyyy')}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Стоимость ингредиентов</TableCell>
            <TableCell>{ingredientCost.toFixed(2)} ₽</TableCell>
          </TableRow>
          {semiFinalCost > 0 && (
            <TableRow>
              <TableCell className="font-medium">Стоимость полуфабрикатов</TableCell>
              <TableCell>{semiFinalCost.toFixed(2)} ₽</TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell className="font-medium">Общая стоимость сырья</TableCell>
            <TableCell>{totalIngredientCosts.toFixed(2)} ₽</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Себестоимость единицы</TableCell>
            <TableCell>{unitCost.toFixed(2)} ₽/{recipe.outputUnit}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Общая себестоимость</TableCell>
            <TableCell>{totalCost.toFixed(2)} ₽</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductionOverview;
