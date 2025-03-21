
export type Supplier = {
  id: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  tin?: string; // Tax Identification Number
  legalAddress?: string;
  physicalAddress?: string;
  bankDetails?: string;
};
