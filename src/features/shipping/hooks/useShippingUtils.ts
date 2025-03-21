
import { format } from 'date-fns';
import { ShippingDocument } from '@/store/recipeStore';

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

export const useShippingUtils = () => {
  return {
    getStatusText,
    getStatusColor,
    formatDate,
    getBuyerName,
    calculateTotalAmount,
    calculateVatAmount,
    calculatePriceWithVat,
    formatShipmentNumber
  };
};
