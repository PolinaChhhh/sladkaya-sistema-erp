
export type ShippingDocument = {
  id: string;
  customer: string;
  date: string;
  items: {
    productionBatchId: string;
    quantity: number;
    price: number;
  }[];
  status: 'draft' | 'shipped' | 'delivered';
};
