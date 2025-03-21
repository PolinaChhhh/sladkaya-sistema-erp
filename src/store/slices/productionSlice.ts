
import { StateCreator } from 'zustand';
import { ProductionBatch } from '../types';

export interface ProductionSlice {
  productions: ProductionBatch[];
  addProduction: (production: Omit<ProductionBatch, 'id'>) => void;
  updateProduction: (id: string, data: Partial<ProductionBatch>) => void;
  deleteProduction: (id: string) => void;
}

export const createProductionSlice: StateCreator<ProductionSlice> = (set) => ({
  productions: [],
  
  addProduction: (production) => set((state) => ({
    productions: [...state.productions, { ...production, id: crypto.randomUUID() }]
  })),
  
  updateProduction: (id, data) => set((state) => ({
    productions: state.productions.map((prod) => 
      prod.id === id ? { ...prod, ...data } : prod
    )
  })),
  
  deleteProduction: (id) => set((state) => ({
    productions: state.productions.filter((prod) => prod.id !== id)
  })),
});
