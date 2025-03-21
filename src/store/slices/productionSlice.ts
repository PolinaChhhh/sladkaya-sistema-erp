
import { StateCreator } from 'zustand';
import { ProductionBatch } from '../types';

export interface ProductionSlice {
  productions: ProductionBatch[];
  addProduction: (production: Omit<ProductionBatch, 'id'>) => { error?: boolean; insufficientItems?: Array<{name: string, required: number, available: number, unit: string}> };
  updateProduction: (id: string, data: Partial<ProductionBatch>) => void;
  deleteProduction: (id: string) => void;
}

export const createProductionSlice: StateCreator<ProductionSlice> = (set) => ({
  productions: [],
  
  addProduction: (production) => {
    set((state) => ({
      productions: [...state.productions, { ...production, id: crypto.randomUUID() }]
    }));
    
    // Return empty object to match the expected return type
    return {};
  },
  
  updateProduction: (id, data) => set((state) => ({
    productions: state.productions.map((prod) => 
      prod.id === id ? { ...prod, ...data } : prod
    )
  })),
  
  deleteProduction: (id) => set((state) => ({
    productions: state.productions.filter((prod) => prod.id !== id)
  })),
});
