
import { StateCreator } from 'zustand';
import { Buyer } from '../types';

export interface BuyerSlice {
  buyers: Buyer[];
  addBuyer: (buyer: Omit<Buyer, 'id'>) => void;
  updateBuyer: (id: string, updatedBuyer: Omit<Buyer, 'id'>) => void;
  deleteBuyer: (id: string) => void;
}

export const createBuyerSlice: StateCreator<BuyerSlice> = (set) => ({
  buyers: [],
  
  addBuyer: (buyer) => set((state) => ({
    buyers: [...state.buyers, { ...buyer, id: crypto.randomUUID() }]
  })),
  
  updateBuyer: (id, updatedBuyer) => set((state) => ({
    buyers: state.buyers.map((buyer) => 
      buyer.id === id ? { ...updatedBuyer, id } : buyer
    )
  })),
  
  deleteBuyer: (id) => set((state) => ({
    buyers: state.buyers.filter((buyer) => buyer.id !== id)
  })),
});
