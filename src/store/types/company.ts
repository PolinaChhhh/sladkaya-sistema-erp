
export type Company = {
  id: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  tin?: string; // Tax Identification Number (ИНН)
  kpp?: string; // Tax Registration Reason Code (КПП)
  legalAddress?: string;
  physicalAddress?: string;
  bankDetails?: string;
};
