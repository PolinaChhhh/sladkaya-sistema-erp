
import { useState } from 'react';
import { ShippingDocument } from '@/store/recipeStore';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { getStatusText } from './useShippingUtils';

export const useShippingOperations = ({
  shippings,
  addShipping,
  updateShipping,
  updateShippingStatus,
  deleteShipping,
  buyers,
  productions,
  updateProduction
}: {
  shippings: ShippingDocument[];
  addShipping: (shipping: Omit<ShippingDocument, 'id' | 'shipmentNumber'>) => void;
  updateShipping: (updatedShipping: ShippingDocument) => void;
  updateShippingStatus: (id: string, status: ShippingDocument['status']) => void;
  deleteShipping: (id: string) => { _deletedShipping?: ShippingDocument };
  buyers: any[];
  productions: any[];
  updateProduction: (id: string, data: Partial<any>) => void;
}) => {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<ShippingDocument | null>(null);
  
  const initDeleteConfirm = (shipping: ShippingDocument) => {
    setSelectedShipping(shipping);
    setIsDeleteConfirmOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (selectedShipping) {
      // Delete the shipping and get the deleted document
      const result = deleteShipping(selectedShipping.id);
      
      // If we have the deleted shipping document, restore the items to inventory
      if (result._deletedShipping) {
        // For each item in the deleted shipping, restore the quantity to the production batch
        result._deletedShipping.items.forEach(item => {
          // Find the production batch
          const production = productions.find(p => p.id === item.productionBatchId);
          
          if (production) {
            // Increase the quantity of the production batch by the shipped quantity
            const newQuantity = production.quantity + item.quantity;
            console.log(`Restoring ${item.quantity} units to production ${item.productionBatchId}, new quantity: ${newQuantity}`);
            
            // Update the production batch
            updateProduction(item.productionBatchId, { quantity: newQuantity });
          }
        });
      }
      
      toast.success('Отгрузка удалена');
      setIsDeleteConfirmOpen(false);
      
      // Return the result to maintain type compatibility
      return result;
    }
    
    // If there's no selected shipping, return an empty object to satisfy the type
    return {};
  };
  
  const handleCreateShipping = (formData: {
    buyerId: string;
    date: string;
    items: {
      productionBatchId: string;
      quantity: number;
      price: number;
      vatRate: number;
    }[];
  }) => {
    if (formData.buyerId.trim() === '') {
      toast.error('Выберите клиента');
      return false;
    }
    
    if (formData.items.length === 0) {
      toast.error('Добавьте товары для отгрузки');
      return false;
    }
    
    // Find the selected buyer
    const selectedBuyer = buyers.find(b => b.id === formData.buyerId);
    
    // Add the shipping with the optional productName field defaulting to undefined
    addShipping({
      buyerId: formData.buyerId,
      customer: selectedBuyer ? selectedBuyer.name : 'Неизвестный клиент', // For backward compatibility
      buyerName: selectedBuyer ? selectedBuyer.name : 'Неизвестный клиент',
      buyerTin: selectedBuyer?.tin,
      buyerKpp: selectedBuyer?.kpp,
      buyerLegalAddress: selectedBuyer?.legalAddress,
      buyerPhysicalAddress: selectedBuyer?.physicalAddress,
      date: formData.date,
      items: formData.items, // TypeScript now allows this because productName is optional
      status: 'draft',
    });
    
    toast.success('Отгрузка создана');
    return true;
  };
  
  const handleUpdateShipping = (
    selectedShipping: ShippingDocument,
    formData: {
      buyerId: string;
      date: string;
      items: {
        productionBatchId: string;
        quantity: number;
        price: number;
        vatRate: number;
      }[];
    }
  ) => {
    if (formData.buyerId.trim() === '') {
      toast.error('Выберите клиента');
      return false;
    }
    
    if (formData.items.length === 0) {
      toast.error('Добавьте товары для отгрузки');
      return false;
    }
    
    // Find the selected buyer
    const selectedBuyer = buyers.find(b => b.id === formData.buyerId);
    
    // Create updated shipping document
    const updatedShipping: ShippingDocument = {
      ...selectedShipping,
      buyerId: formData.buyerId,
      customer: selectedBuyer ? selectedBuyer.name : 'Неизвестный клиент',
      buyerName: selectedBuyer ? selectedBuyer.name : 'Неизвестный клиент',
      buyerTin: selectedBuyer?.tin,
      buyerKpp: selectedBuyer?.kpp,
      buyerLegalAddress: selectedBuyer?.legalAddress,
      buyerPhysicalAddress: selectedBuyer?.physicalAddress,
      date: formData.date,
      items: formData.items, // TypeScript now allows this because productName is optional
    };
    
    // Update shipping in store
    updateShipping(updatedShipping);
    
    toast.success('Отгрузка обновлена');
    return true;
  };
  
  const handleStatusUpdate = (shippingId: string, newStatus: ShippingDocument['status']) => {
    updateShippingStatus(shippingId, newStatus);
    toast.success(`Статус отгрузки обновлен: ${getStatusText(newStatus)}`);
  };

  // Check if we have buyers data to enable the create button
  const canCreateShipment = buyers.length > 0;
  
  return {
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    selectedShipping,
    setSelectedShipping,
    initDeleteConfirm,
    handleDeleteConfirm,
    handleCreateShipping,
    handleUpdateShipping,
    handleStatusUpdate,
    canCreateShipment
  };
};
