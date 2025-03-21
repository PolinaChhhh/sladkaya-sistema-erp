
import React from 'react'; 
import { useShipmentsList } from './hooks/useShipmentsList';
import ShippingHeader from './components/ShippingHeader';
import ShippingCard from './components/ShippingCard';
import EmptyShippingState from './components/EmptyShippingState';
import CreateShippingDialog from './components/CreateShippingDialog';
import DeleteShippingDialog from './components/DeleteShippingDialog';

const ShipmentsList = () => {
  const {
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
  } = useShipmentsList();
  
  return (
    <div>
      <ShippingHeader 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateClick={initCreateForm}
        canCreateShipment={canCreateShipment}
      />
      
      {sortedShippings.length > 0 ? (
        <div className="grid gap-4">
          {sortedShippings.map((shipping) => (
            <ShippingCard 
              key={shipping.id}
              shipping={shipping}
              buyers={buyers}
              productions={productions}
              recipes={recipes}
              onStatusUpdate={handleStatusUpdate}
              onDeleteClick={initDeleteConfirm}
            />
          ))}
        </div>
      ) : (
        <EmptyShippingState />
      )}
      
      {/* Create Shipping Dialog */}
      <CreateShippingDialog 
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        formData={formData}
        setFormData={setFormData}
        buyers={buyers}
        productions={productions}
        recipes={recipes}
        shippings={shippings}
        onSubmit={handleCreateShipping}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteShippingDialog 
        isOpen={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default ShipmentsList;
