
import { ShippingDocument, RussianDocumentType } from '@/store/types/shipping';
import { Buyer } from '@/store/types/buyer';

// VAT rate options as per Russian legislation
export const VAT_RATES = [0, 5, 7, 10, 20];

// Interface for document generation
export interface DocumentGenerationData {
  shipping: ShippingDocument;
  buyer: Buyer;
  items: Array<{
    productName: string;
    quantity: number;
    unit: string;
    priceWithoutVat: number;
    vatRate: number;
    vatAmount: number;
    priceWithVat: number;
    totalAmount: number;
  }>;
  totalWithoutVat: number;
  totalVatAmount: number;
  totalWithVat: number;
}
