
import { StateCreator } from 'zustand';
import { Supplier } from '../types';

export interface SupplierSlice {
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, data: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
}

export const createSupplierSlice: StateCreator<SupplierSlice> = (set) => ({
  suppliers: [],
  
  addSupplier: (supplier) => set((state) => ({
    suppliers: [...state.suppliers, { ...supplier, id: crypto.randomUUID() }]
  })),
  
  updateSupplier: (id, data) => set((state) => ({
    suppliers: state.suppliers.map((supplier) => 
      supplier.id === id ? { ...supplier, ...data } : supplier
    )
  })),
  
  deleteSupplier: (id) => set((state) => ({
    suppliers: state.suppliers.filter((supplier) => supplier.id !== id)
  })),
});
