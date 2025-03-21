
import { useState } from 'react';
import { ShippingDocument } from '@/store/recipeStore';
import { format } from 'date-fns';

export const useShippingDialogs = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<ShippingDocument | null>(null);
  
  const [formData, setFormData] = useState<{
    buyerId: string;
    date: string;
    items: {
      productionBatchId: string;
      quantity: number;
      price: number;
      vatRate: number;
    }[];
  }>({
    buyerId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    items: [],
  });
  
  const initCreateForm = (defaultBuyerId: string = '') => {
    setFormData({
      buyerId: defaultBuyerId,
      date: format(new Date(), 'yyyy-MM-dd'),
      items: [],
    });
    setIsCreateDialogOpen(true);
  };
  
  const initEditForm = (shipping: ShippingDocument) => {
    setSelectedShipping(shipping);
    setFormData({
      buyerId: shipping.buyerId || '',
      date: shipping.date,
      items: [...shipping.items],
    });
    setIsEditDialogOpen(true);
  };
  
  return {
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedShipping,
    setSelectedShipping,
    formData,
    setFormData,
    initCreateForm,
    initEditForm
  };
};
