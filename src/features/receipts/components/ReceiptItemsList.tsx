
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2 } from 'lucide-react';
import { ReceiptItem, Ingredient } from '@/store/recipeStore';

interface ReceiptItemsListProps {
  items: ReceiptItem[];
  ingredients: Ingredient[];
  addReceiptItem: () => void;
  updateReceiptItem: (index: number, field: keyof Omit<ReceiptItem, 'id' | 'receiptId'>, value: any) => void;
  removeReceiptItem: (index: number) => void;
  getIngredientName: (id: string) => string;
  getIngredientUnit: (id: string) => string;
}

const ReceiptItemsList: React.FC<ReceiptItemsListProps> = ({
  items,
  ingredients,
  addReceiptItem,
  updateReceiptItem,
  removeReceiptItem,
  getIngredientName,
  getIngredientUnit
}) => {
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <Label>Ингредиенты</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addReceiptItem}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Добавить ингредиент
        </Button>
      </div>
      
      {items.length > 0 ? (
        <div className="space-y-3 mt-2">
          {items.map((item, index) => (
            <div key={item.id} className="bg-gray-50 p-3 rounded-md">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-5">
                  <Label className="text-xs">Ингредиент</Label>
                  <Select 
                    value={item.ingredientId}
                    onValueChange={(value) => updateReceiptItem(index, 'ingredientId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите ингредиент" />
                    </SelectTrigger>
                    <SelectContent>
                      {ingredients.map((ingredient) => (
                        <SelectItem key={ingredient.id} value={ingredient.id}>
                          {ingredient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-2">
                  <Label className="text-xs">Количество</Label>
                  <div className="flex items-center">
                    <Input 
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={item.quantity || ''}
                      onChange={(e) => updateReceiptItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                    />
                    <span className="ml-1 text-xs text-gray-500">
                      {getIngredientUnit(item.ingredientId)}
                    </span>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <Label className="text-xs">Цена за ед.</Label>
                  <div className="flex items-center">
                    <Input 
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={item.unitPrice || ''}
                      onChange={(e) => updateReceiptItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    />
                    <span className="ml-1 text-xs text-gray-500">₽</span>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <Label className="text-xs">Сумма</Label>
                  <div className="h-10 flex items-center px-3 py-2 border rounded-md bg-gray-100">
                    {item.totalPrice.toFixed(2)} ₽
                  </div>
                </div>
                
                <div className="col-span-1 flex items-end justify-end">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeReceiptItem(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500 p-4 text-center border rounded-md">
          Нет добавленных ингредиентов
        </div>
      )}
    </div>
  );
};

export default ReceiptItemsList;
