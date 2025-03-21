
import { useState } from 'react';
import { useStore, ShippingDocument } from '@/store/recipeStore';
import { format } from 'date-fns';
import { toast } from 'sonner';

export const useShipmentsList = () => {
  const { productions, shippings, recipes, buyers, addShipping, updateShippingStatus, deleteShipping } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
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
  
  const filteredShippings = shippings.filter(shipping => {
    const buyer = buyers.find(b => b.id === shipping.buyerId);
    const customerName = buyer ? buyer.name : shipping.customer;
    return customerName.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Sort shipping documents by date (newest first)
  const sortedShippings = [...filteredShippings].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  const initCreateForm = () => {
    setFormData({
      buyerId: buyers.length > 0 ? buyers[0].id : '',
      date: format(new Date(), 'yyyy-MM-dd'),
      items: [],
    });
    setIsCreateDialogOpen(true);
  };
  
  const initDeleteConfirm = (shipping: ShippingDocument) => {
    setSelectedShipping(shipping);
    setIsDeleteConfirmOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (selectedShipping) {
      deleteShipping(selectedShipping.id);
      toast.success('Отгрузка удалена');
      setIsDeleteConfirmOpen(false);
    }
  };
  
  const handleCreateShipping = () => {
    if (formData.buyerId.trim() === '') {
      toast.error('Выберите клиента');
      return;
    }
    
    if (formData.items.length === 0) {
      toast.error('Добавьте товары для отгрузки');
      return;
    }
    
    // Find the selected buyer
    const selectedBuyer = buyers.find(b => b.id === formData.buyerId);
    
    addShipping({
      buyerId: formData.buyerId,
      customer: selectedBuyer ? selectedBuyer.name : 'Неизвестный клиент', // For backward compatibility
      date: formData.date,
      items: formData.items,
      status: 'draft',
    });
    
    toast.success('Отгрузка создана');
    setIsCreateDialogOpen(false);
  };
  
  const handleStatusUpdate = (shippingId: string, newStatus: ShippingDocument['status']) => {
    updateShippingStatus(shippingId, newStatus);
    toast.success(`Статус отгрузки обновлен: ${getStatusText(newStatus)}`);
  };

  // Check if we have buyers data to enable the create button
  const canCreateShipment = buyers.length > 0;
  
  return {
    searchQuery,
    setSearchQuery,
    sortedShippings,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    selectedShipping,
    formData,
    setFormData,
    buyers,
    productions,
    recipes,
    shippings,
    initCreateForm,
    initDeleteConfirm,
    handleDeleteConfirm,
    handleCreateShipping,
    handleStatusUpdate,
    canCreateShipment
  };
};

export const getStatusText = (status: ShippingDocument['status']): string => {
  switch (status) {
    case 'draft': return 'Черновик';
    case 'shipped': return 'Отгружено';
    case 'delivered': return 'Доставлено';
    default: return 'Неизвестно';
  }
};

export const getStatusColor = (status: ShippingDocument['status']): string => {
  switch (status) {
    case 'draft': return 'bg-gray-200 text-gray-800';
    case 'shipped': return 'bg-blue-200 text-blue-800';
    case 'delivered': return 'bg-green-200 text-green-800';
    default: return 'bg-gray-200 text-gray-800';
  }
};

export const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'dd.MM.yyyy');
  } catch {
    return 'Неизвестная дата';
  }
};

export const getBuyerName = (buyers: any[], shipping: ShippingDocument): string => {
  if (shipping.buyerId) {
    const buyer = buyers.find(b => b.id === shipping.buyerId);
    return buyer ? buyer.name : shipping.customer;
  }
  return shipping.customer;
};

export const calculateTotalAmount = (items: ShippingDocument['items']): number => {
  return items.reduce((sum, item) => {
    const priceWithVat = item.price * (1 + item.vatRate / 100);
    return sum + (item.quantity * priceWithVat);
  }, 0);
};

export const calculateVatAmount = (items: ShippingDocument['items']): number => {
  return items.reduce((sum, item) => {
    const vatAmount = item.price * (item.vatRate / 100) * item.quantity;
    return sum + vatAmount;
  }, 0);
};

export const calculatePriceWithVat = (price: number, vatRate: number): number => {
  return price * (1 + vatRate / 100);
};

export const formatShipmentNumber = (number: number): string => {
  return number.toString().padStart(4, '0');
};
