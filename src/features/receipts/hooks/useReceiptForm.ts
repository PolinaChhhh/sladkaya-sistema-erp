
import { useState, useEffect } from 'react';
import { useStore, Receipt, ReceiptItem } from '@/store/recipeStore';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface UseReceiptFormProps {
  isCreateMode: boolean;
  receipt: Receipt | null;
  onCancel: () => void;
}

export const useReceiptForm = ({ isCreateMode, receipt, onCancel }: UseReceiptFormProps) => {
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
    
    onCancel();
  };

  return {
    formData,
    setFormData,
    suppliers,
    ingredients,
    calculateTotalAmount,
    addReceiptItem,
    updateReceiptItem,
    removeReceiptItem,
    getIngredientName,
    getIngredientUnit,
    handleSubmit
  };
};
