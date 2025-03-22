
import { StateCreator } from 'zustand';
import { Company } from '../types/company';

export interface CompanySlice {
  company: Company | null;
  updateCompany: (company: Omit<Company, 'id'>) => void;
}

export const createCompanySlice: StateCreator<CompanySlice> = (set) => ({
  company: null,
  
  updateCompany: (companyData) => set((state) => {
    // If there's no existing company, create one with a new ID
    if (!state.company) {
      return {
        company: { 
          ...companyData, 
          id: crypto.randomUUID() 
        }
      };
    }
    
    // Otherwise, update the existing company
    return {
      company: { 
        ...companyData, 
        id: state.company.id 
      }
    };
  }),
});
