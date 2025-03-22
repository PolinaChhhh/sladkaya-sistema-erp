import { Dispatch, SetStateAction } from 'react';
import { ShippingDocument } from '@/store/recipeStore';
import { getProductsInStock, getAvailableProductionBatches } from '../utils/shippingUtils';

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
    // Get products that are actually in stock, now grouped by recipe
    const productsInStock = getProductsInStock(productions, shippings, recipes);
    
    if (productsInStock.length === 0) {
      return { error: 'Нет доступных товаров на складе' };
    }
    
    // Select the first product in stock for the new item
    const firstProduct = productsInStock[0];
    
    // Find the oldest production batch with available quantity for this recipe (FIFO)
    const availableBatches = getAvailableProductionBatches(
      productions,
      shippings,
      firstProduct.recipeId
    );
    
    if (availableBatches.length === 0) {
      return { error: 'Нет доступных партий продукта' };
    }
    
    // Use the first (oldest) available batch for the initial reference
    const oldestBatch = availableBatches[0];
    
    // Start with just 1 unit, but allow more based on total available quantity
    const initialQuantity = 1;
    
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { 
        productionBatchId: oldestBatch.productionBatchId,
        quantity: initialQuantity, 
        price: oldestBatch.unitCost * 1.3, // Default 30% markup based on actual unit cost
        vatRate: 20, // Default VAT rate 20%
      }],
    }));
    
    return { success: true };
  };
  
  const updateShippingItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    
    if (field === 'productionBatchId' && value !== newItems[index].productionBatchId) {
      // When changing product, update the price based on the production's unit cost
      const selectedProduction = productions.find(p => p.id === value);
      
      if (selectedProduction) {
        // Calculate the unit cost from the production's total cost and quantity
        const unitCost = selectedProduction.quantity > 0 
          ? selectedProduction.cost / selectedProduction.quantity 
          : 0;
        
        // Get the total available quantity for this recipe
        const productsInStock = getProductsInStock(productions, shippings, recipes);
        const recipeProduct = productsInStock.find(p => p.recipeId === selectedProduction.recipeId);
        const totalAvailable = recipeProduct ? recipeProduct.availableQuantity : 0;
        
        // Set default quantity to 1 or keep existing if valid
        const existingQuantity = newItems[index].quantity;
        const newQuantity = Math.min(existingQuantity > 0 ? existingQuantity : 1, totalAvailable);
        
        newItems[index] = { 
          ...newItems[index], 
          [field]: value,
          price: unitCost * 1.3, // Default 30% markup on actual unit cost
          quantity: newQuantity
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
