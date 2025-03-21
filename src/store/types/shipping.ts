
export type ShippingDocument = {
  id: string;
  customer: string; // For backward compatibility
  buyerId?: string;  // New field to reference buyers
  date: string;
  items: {
    productionBatchId: string;
    quantity: number;
    price: number;
  }[];
  status: 'draft' | 'shipped' | 'delivered';
};
