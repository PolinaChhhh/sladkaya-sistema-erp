
import { useStore } from '@/store/recipeStore';
import { useShippingFilters } from './useShippingFilters';
import { useShippingOperations } from './useShippingOperations';
import { useShippingDialogs } from './useShippingDialogs';
import { useShippingUtils } from './useShippingUtils';

export const useShipmentsList = () => {
  const { productions, shippings, recipes, buyers, addShipping, updateShipping, updateShippingStatus, deleteShipping } = useStore();
  
  // Use our new hooks
  const { searchQuery, setSearchQuery, sortedShippings } = useShippingFilters(shippings, buyers);
  
  const {
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
  } = useShippingDialogs();
  
  const {
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    initDeleteConfirm,
    handleDeleteConfirm,
    handleCreateShipping,
    handleUpdateShipping,
    handleStatusUpdate,
    canCreateShipment
  } = useShippingOperations({
    shippings,
    addShipping,
    updateShipping,
    updateShippingStatus,
    deleteShipping,
    buyers
  });
  
  // Export all the hooks methods and values
  return {
    searchQuery,
    setSearchQuery,
    sortedShippings,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    selectedShipping,
    formData,
    setFormData,
    buyers,
    productions,
    recipes,
    shippings,
    initCreateForm: () => initCreateForm(buyers.length > 0 ? buyers[0].id : ''),
    initEditForm,
    initDeleteConfirm,
    handleDeleteConfirm,
    handleCreateShipping: () => handleCreateShipping(formData),
    handleUpdateShipping: () => selectedShipping && handleUpdateShipping(selectedShipping, formData),
    handleStatusUpdate,
    canCreateShipment
  };
};

// Re-export the utility functions so they can still be imported from useShipmentsList
export { 
  getStatusText,
  getStatusColor,
  formatDate,
  getBuyerName,
  calculateTotalAmount,
  calculateVatAmount,
  calculatePriceWithVat,
  formatShipmentNumber
} from './useShippingUtils';
