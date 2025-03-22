
export interface ShippingItemRowProps {
  item: {
    productionBatchId: string;
    quantity: number;
    price: number;
    vatRate: number;
  };
  idx: number;
  availableQuantity: number;
  productName: string;
  productUnit: string;
  updateShippingItem: (index: number, field: string, value: any) => void;
  removeShippingItem: (index: number) => void;
  productions: any[];
  recipes: any[];
  shippings: any[];
}
