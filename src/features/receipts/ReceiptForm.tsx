
import React, { useState, useEffect } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, PlusCircle } from 'lucide-react';
import { useStore, Receipt, ReceiptItem, Ingredient } from '@/store/recipeStore';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ReceiptFormProps {
  isCreateMode: boolean;
  receipt: Receipt | null;
  onCancel: () => void;
}

const ReceiptForm: React.FC<ReceiptFormProps> = ({
  isCreateMode,
  receipt,
  onCancel
}) => {
  const { suppliers, ingredients, addReceipt, updateReceipt } = useStore();
  
  const [formData, setFormData] = useState<{
    supplierId: string;
    date: string;
    referenceNumber: string;
    notes: string;
    items: ReceiptItem[];
  }>({
    supplierId: suppliers.length > 0 ? suppliers[0].id : '',
    date: format(new Date(), 'yyyy-MM-dd'),
    referenceNumber: '',
    notes: '',
    items: [],
  });
  
  // Initialize form with receipt data if editing
  useEffect(() => {
    if (!isCreateMode && receipt) {
      setFormData({
        supplierId: receipt.supplierId,
        date: receipt.date.split('T')[0], // Format date for input
        referenceNumber: receipt.referenceNumber || '',
        notes: receipt.notes || '',
        items: receipt.items,
      });
    }
  }, [isCreateMode, receipt]);
  
  const calculateTotalAmount = () => {
    return formData.items.reduce((total, item) => total + item.totalPrice, 0);
  };
  
  const updateIngredientQuantities = (items: ReceiptItem[]) => {
    // This function would update ingredient quantities based on receipt items
    // For the FIFO implementation, we track remainingQuantity separately
  };
  
  const addReceiptItem = () => {
    if (ingredients.length === 0) {
      toast.error('Сначала добавьте ингредиенты');
      return;
    }
    
    const defaultIngredientId = ingredients.length > 0 ? ingredients[0].id : '';
    
    const newItem: ReceiptItem = {
      id: crypto.randomUUID(),
      receiptId: receipt ? receipt.id : '',
      ingredientId: defaultIngredientId,
      quantity: 0,
      unitPrice: 0,
      totalPrice: 0,
      remainingQuantity: 0,
    };
    
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };
  
  const updateReceiptItem = (index: number, field: keyof Omit<ReceiptItem, 'id' | 'receiptId'>, value: any) => {
    const newItems = [...formData.items];
    
    // Update the specified field
    newItems[index] = { 
      ...newItems[index], 
      [field]: value 
    };
    
    // If quantity or unitPrice was updated, recalculate totalPrice
    if (field === 'quantity' || field === 'unitPrice') {
      const item = newItems[index];
      const quantity = field === 'quantity' ? value : item.quantity;
      const unitPrice = field === 'unitPrice' ? value : item.unitPrice;
      
      newItems[index].totalPrice = quantity * unitPrice;
      
      // Also update remainingQuantity to match quantity on new items
      if (isCreateMode) {
        newItems[index].remainingQuantity = quantity;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };
  
  const removeReceiptItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };
  
  const getIngredientName = (id: string) => {
    const ingredient = ingredients.find(i => i.id === id);
    return ingredient ? ingredient.name : 'Неизвестный ингредиент';
  };
  
  const getIngredientUnit = (id: string) => {
    const ingredient = ingredients.find(i => i.id === id);
    return ingredient ? ingredient.unit : '';
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.supplierId) {
      toast.error('Выберите поставщика');
      return;
    }
    
    if (formData.items.length === 0) {
      toast.error('Добавьте хотя бы один ингредиент');
      return;
    }
    
    // Check for valid quantity and price
    const invalidItems = formData.items.filter(item => 
      item.quantity <= 0 || item.unitPrice <= 0
    );
    
    if (invalidItems.length > 0) {
      toast.error('Проверьте количество и цену для каждого ингредиента');
      return;
    }
    
    const totalAmount = calculateTotalAmount();
    
    if (isCreateMode) {
      addReceipt({
        supplierId: formData.supplierId,
        date: new Date(formData.date).toISOString(),
        referenceNumber: formData.referenceNumber || undefined,
        totalAmount,
        notes: formData.notes || undefined,
        items: formData.items.map(item => ({
          ...item,
          remainingQuantity: item.quantity // Initialize remaining quantity to full quantity
        })),
      });
      
      toast.success('Поступление успешно добавлено');
    } else if (receipt) {
      updateReceipt(receipt.id, {
        supplierId: formData.supplierId,
        date: new Date(formData.date).toISOString(),
        referenceNumber: formData.referenceNumber || undefined,
        totalAmount,
        notes: formData.notes || undefined,
        items: formData.items,
      });
      
      toast.success('Поступление успешно обновлено');
    }
    
    updateIngredientQuantities(formData.items);
    onCancel();
  };

  return (
    <DialogContent className="sm:max-w-3xl">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>
            {isCreateMode ? 'Добавить поступление' : 'Редактировать поступление'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="supplier">Поставщик *</Label>
              {suppliers.length > 0 ? (
                <Select 
                  value={formData.supplierId}
                  onValueChange={(value) => setFormData({ ...formData, supplierId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите поставщика" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-sm text-red-500">
                  Сначала добавьте поставщиков
                </div>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="date">Дата *</Label>
              <Input 
                id="date" 
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="referenceNumber">Номер накладной</Label>
              <Input 
                id="referenceNumber" 
                value={formData.referenceNumber}
                onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                placeholder="Введите номер накладной"
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Итоговая сумма</Label>
              <div className="h-10 flex items-center px-3 py-2 border rounded-md bg-gray-50">
                {calculateTotalAmount().toFixed(2)} ₽
              </div>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="notes">Примечания</Label>
            <Textarea 
              id="notes" 
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Введите примечания"
              rows={2}
            />
          </div>
          
          {/* Receipt Items */}
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
            
            {formData.items.length > 0 ? (
              <div className="space-y-3 mt-2">
                {formData.items.map((item, index) => (
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
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button type="submit" className="bg-cream-600 hover:bg-cream-700">
            {isCreateMode ? 'Добавить' : 'Сохранить'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default ReceiptForm;
