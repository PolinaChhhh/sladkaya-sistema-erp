
export type RussianDocumentType = 'TORG12' | 'UTD' | 'TTN' | 'TN';

export type ShippingDocument = {
  id: string;
  customer: string; // For backward compatibility
  buyerId?: string;  // New field to reference buyers
  buyerName: string; // Buyer name for display purposes
  buyerTin?: string; // Tax Identification Number of the buyer
  buyerKpp?: string; // Tax Registration Reason Code of the buyer
  buyerLegalAddress?: string; // Legal address of the buyer
  buyerPhysicalAddress?: string; // Physical address of the buyer
  date: string;
  items: {
    productionBatchId: string;
    productName?: string; // Made optional since it can be derived from productions and recipes
    quantity: number;
    price: number;
    vatRate: number; // VAT rate as a percentage: 5, 7, 10, or 20
  }[];
  status: 'draft' | 'shipped' | 'delivered';
  shipmentNumber: number; // Sequential number from 1 to 9999
  trackingId?: string; // Optional tracking ID for the shipment
  documentType?: RussianDocumentType; // Type of official document
  documentGenerated?: boolean; // Flag to track if document was generated
};
