
import { Dispatch, SetStateAction } from 'react';
import { ShippingDocument } from '@/store/recipeStore';
import { getProductsInStock } from '../utils/shippingUtils';

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
  shippings: ShippingDocument[],
  recipes: any[]
) => {
  const addShippingItem = () => {
    // Get products that are actually in stock using the utility function
    const productsInStock = getProductsInStock(productions, shippings, recipes);
    
    if (productsInStock.length === 0) {
      return { error: 'Нет доступных товаров на складе' };
    }
    
    // Select the first product in stock for the new item
    const firstProduct = productsInStock[0];
    
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { 
        productionBatchId: firstProduct.productionBatchId, 
        quantity: 1, 
        price: firstProduct.cost * 1.3, // Default 30% markup
        vatRate: 20, // Default VAT rate 20%
      }],
    }));
    
    return { success: true };
  };
  
  const updateShippingItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    
    if (field === 'productionBatchId' && value !== newItems[index].productionBatchId) {
      // When changing product, update the price based on the new product's cost
      const productsInStock = getProductsInStock(productions, shippings, recipes);
      const selectedProduct = productsInStock.find(p => p.productionBatchId === value);
      
      if (selectedProduct) {
        newItems[index] = { 
          ...newItems[index], 
          [field]: value,
          price: selectedProduct.cost * 1.3 // Default 30% markup when changing product
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
