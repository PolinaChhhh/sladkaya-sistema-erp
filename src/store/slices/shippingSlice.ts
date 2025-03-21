
import { StateCreator } from 'zustand';
import { ShippingDocument } from '../types';

export interface ShippingSlice {
  shippings: ShippingDocument[];
  lastShipmentNumber: number; // Track the last used shipment number
  addShipping: (shipping: Omit<ShippingDocument, 'id' | 'shipmentNumber'>) => void;
  updateShipping: (updatedShipping: ShippingDocument) => void;
  updateShippingStatus: (id: string, status: ShippingDocument['status']) => void;
  deleteShipping: (id: string) => void;
}

export const createShippingSlice: StateCreator<ShippingSlice> = (set, get) => ({
  shippings: [],
  lastShipmentNumber: 0, // Initialize at 0, first shipment will be 1
  
  addShipping: (shipping) => set((state) => {
    const nextShipmentNumber = state.lastShipmentNumber + 1;
    
    return {
      shippings: [...state.shippings, { 
        ...shipping, 
        id: crypto.randomUUID(),
        shipmentNumber: nextShipmentNumber
      }],
      lastShipmentNumber: nextShipmentNumber
    };
  }),
  
  updateShipping: (updatedShipping) => set((state) => ({
    shippings: state.shippings.map((shipping) => 
      shipping.id === updatedShipping.id ? updatedShipping : shipping
    )
  })),
  
  updateShippingStatus: (id, status) => set((state) => ({
    shippings: state.shippings.map((shipping) => 
      shipping.id === id ? { ...shipping, status } : shipping
    )
  })),
  
  deleteShipping: (id) => set((state) => ({
    shippings: state.shippings.filter((shipping) => shipping.id !== id)
  })),
});
