
import { Dispatch, SetStateAction } from 'react';
import { ShippingDocument } from '@/store/recipeStore';

export const useShippingForm = (
  formData: {
    buyerId: string;
    date: string;
    items: {
      productionBatchId: string;
      quantity: number;
      price: number;
      vatRate: number;
    }[];
  },
  setFormData: Dispatch<SetStateAction<{
    buyerId: string;
    date: string;
    items: {
      productionBatchId: string;
      quantity: number;
      price: number;
      vatRate: number;
    }[];
  }>>,
  productions: any[],
  shippings: ShippingDocument[]
) => {
  const addShippingItem = () => {
    if (productions.length === 0) {
      return { error: 'Нет доступных партий продукции' };
    }
    
    // Filter out productions that have already been fully shipped
    const availableProductions = productions.filter(p => {
      // Calculate already shipped quantity
      const alreadyShippedQuantity = shippings.reduce((total, shipping) => {
        return total + shipping.items
          .filter(item => item.productionBatchId === p.id)
          .reduce((sum, item) => sum + item.quantity, 0);
      }, 0);
      
      console.log('Checking production availability:', { 
        productionId: p.id, 
        totalQuantity: p.quantity,
        shippedQuantity: alreadyShippedQuantity,
        available: p.quantity - alreadyShippedQuantity
      });
      
      return p.quantity > alreadyShippedQuantity;
    });
    
    if (availableProductions.length === 0) {
      return { error: 'Нет доступных партий продукции для отгрузки' };
    }
    
    const firstBatch = availableProductions[0];
    
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { 
        productionBatchId: firstBatch.id, 
        quantity: 1, 
        price: firstBatch.cost * 1.3, // Default 30% markup
        vatRate: 20, // Default VAT rate 20%
      }],
    }));
    
    return { success: true };
  };
  
  const updateShippingItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    
    if (field === 'productionBatchId' && value !== newItems[index].productionBatchId) {
      // When changing batch, update the price based on the new batch's cost
      const batch = productions.find(p => p.id === value);
      if (batch) {
        newItems[index] = { 
          ...newItems[index], 
          [field]: value,
          price: batch.cost * 1.3 // Default 30% markup when changing batch
        };
      } else {
        newItems[index] = { ...newItems[index], [field]: value };
      }
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    
    setFormData({ ...formData, items: newItems });
  };
  
  const removeShippingItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };
  
  return {
    addShippingItem,
    updateShippingItem,
    removeShippingItem
  };
};

// VAT rate options for dropdown
export const vatRateOptions = [
  { value: 5, label: '5%' },
  { value: 7, label: '7%' },
  { value: 10, label: '10%' },
  { value: 20, label: '20%' }
];
