
import { Dispatch, SetStateAction } from 'react';

export interface ShippingFormData {
  buyerId: string;
  date: string;
  items: any[];
}

export interface BuyerSelectorProps {
  buyers: any[];
  buyerId: string;
  onChange: (value: string) => void;
}

export interface DateSelectorProps {
  date: string;
  onChange: (value: string) => void;
}

export interface ShippingFormBasicFieldsProps {
  buyers: any[];
  formData: ShippingFormData;
  setFormData: Dispatch<SetStateAction<ShippingFormData>>;
}
