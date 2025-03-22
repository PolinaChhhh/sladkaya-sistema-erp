
export type Company = {
  id: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  tin?: string; // Tax Identification Number (ИНН)
  legalAddress?: string;
  physicalAddress?: string;
  bankDetails?: string;
};
