
import { useState, useMemo } from 'react';
import { useRecipeStore } from '@/store/recipeStore';
import { format, parseISO } from 'date-fns';
import { useShippingFilters } from './useShippingFilters';
import { useShippingOperations } from './useShippingOperations';

export const useShipmentsList = () => {
  const {
    shippings,
    buyers,
    productions,
    recipes,
    addShipping,
    updateShipping,
    updateShippingStatus,
    deleteShipping,
    updateProduction
  } = useRecipeStore(state => ({
    shippings: state.shippings,
    buyers: state.buyers,
    productions: state.productions,
    recipes: state.recipes,
    addShipping: state.addShipping,
    updateShipping: state.updateShipping,
    updateShippingStatus: state.updateShippingStatus,
    deleteShipping: state.deleteShipping,
    updateProduction: state.updateProduction
  }));
  
  // Search and filter functionality
  const { searchQuery, setSearchQuery, filteredShippings } = useShippingFilters(shippings, buyers);
  
  // Sort shippings by date, newest first
  const sortedShippings = useMemo(() => {
    return [...filteredShippings].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [filteredShippings]);
  
  // Dialog state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Form data state with initial values
  const [formData, setFormData] = useState({
    buyerId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    items: []
  });
  
  // Reference to the currently selected shipping for edit
  const selectedShippingRef = useState({ current: null })[0];
  
  // Initialize the create form with default values
  const initCreateForm = () => {
    setFormData({
      buyerId: buyers.length > 0 ? buyers[0].id : '',
      date: format(new Date(), 'yyyy-MM-dd'),
      items: []
    });
    setIsCreateDialogOpen(true);
  };
  
  // Initialize the edit form with the selected shipping's values
  const initEditForm = (shipping) => {
    setFormData({
      buyerId: shipping.buyerId || '',
      date: format(parseISO(shipping.date), 'yyyy-MM-dd'),
      items: shipping.items
    });
    selectedShippingRef.current = shipping;
    setIsEditDialogOpen(true);
  };
  
  // Use the shipping operations hook
  const {
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    selectedShipping,
    setSelectedShipping,
    initDeleteConfirm,
    handleDeleteConfirm,
    handleCreateShipping,
    handleUpdateShipping: operationsHandleUpdateShipping,
    handleStatusUpdate,
    canCreateShipment
  } = useShippingOperations({
    shippings,
    addShipping,
    updateShipping,
    updateShippingStatus,
    deleteShipping,
    buyers,
    productions,
    updateProduction
  });
  
  // Handle update shipping submission
  const handleUpdateShipping = () => {
    if (!selectedShippingRef.current) return;
    
    const result = operationsHandleUpdateShipping(selectedShippingRef.current, formData);
    
    if (result) {
      setIsEditDialogOpen(false);
    }
  };
  
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
    initCreateForm,
    initEditForm,
    initDeleteConfirm,
    handleDeleteConfirm,
    handleCreateShipping,
    handleUpdateShipping,
    handleStatusUpdate,
    canCreateShipment
  };
};
