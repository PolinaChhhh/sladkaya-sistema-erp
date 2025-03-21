
import { StateCreator } from 'zustand';
import { ShippingDocument } from '../types';

export interface ShippingSlice {
  shippings: ShippingDocument[];
  addShipping: (shipping: Omit<ShippingDocument, 'id'>) => void;
  updateShippingStatus: (id: string, status: ShippingDocument['status']) => void;
}

export const createShippingSlice: StateCreator<ShippingSlice> = (set) => ({
  shippings: [],
  
  addShipping: (shipping) => set((state) => ({
    shippings: [...state.shippings, { ...shipping, id: crypto.randomUUID() }]
  })),
  
  updateShippingStatus: (id, status) => set((state) => ({
    shippings: state.shippings.map((shipping) => 
      shipping.id === id ? { ...shipping, status } : shipping
    )
  })),
});
