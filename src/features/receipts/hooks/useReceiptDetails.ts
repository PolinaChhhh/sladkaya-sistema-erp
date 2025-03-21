
import { useStore } from '@/store/recipeStore';
import { Receipt } from '@/store/types';
import { format } from 'date-fns';

export const useReceiptDetails = (receipt: Receipt) => {
  const { suppliers, ingredients } = useStore();
  
  const getSupplierName = (id: string) => {
    const supplier = suppliers.find(s => s.id === id);
    return supplier ? supplier.name : 'Неизвестный поставщик';
  };
  
  const getIngredientName = (id: string) => {
    const ingredient = ingredients.find(i => i.id === id);
    return ingredient ? ingredient.name : 'Неизвестный ингредиент';
  };
  
  const getIngredientUnit = (id: string) => {
    const ingredient = ingredients.find(i => i.id === id);
    return ingredient ? ingredient.unit : '';
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch (e) {
      return 'Неизвестная дата';
    }
  };

  return {
    getSupplierName,
    getIngredientName,
    getIngredientUnit,
    formatDate
  };
};
