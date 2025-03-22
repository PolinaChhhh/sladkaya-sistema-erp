
export type Buyer = {
  id: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  tin?: string; // Tax Identification Number
  kpp?: string; // Code of Reason for Registration
  legalAddress?: string;
  physicalAddress?: string;
  bankDetails?: string;
};
