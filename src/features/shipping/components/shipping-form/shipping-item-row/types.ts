
import { ShippingDocument } from '@/store/recipeStore';

export interface ShippingItemData {
  productionBatchId: string;
  quantity: number;
  price: number;
  vatRate: number;
}

export interface ShippingItemRowProps {
  item: ShippingItemData;
  idx: number;
  availableQuantity: number; // Total recipe quantity
  preciseAvailableQuantity?: number; // Current batch quantity
  productName: string;
  productUnit: string;
  updateShippingItem: (index: number, field: string, value: any) => void;
  removeShippingItem: (index: number) => void;
  productions: any[];
  recipes: any[];
  shippings: ShippingDocument[];
}
