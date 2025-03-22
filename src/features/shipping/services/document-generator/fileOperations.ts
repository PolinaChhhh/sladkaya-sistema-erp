
import { RussianDocumentType } from '@/store/types/shipping';
import { formatShipmentNumber } from '../../hooks/useShippingUtils';

/**
 * Downloads the generated document
 */
export const downloadDocument = (blob: Blob, fileName: string): void => {
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link element
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  
  // Append to the document, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Release the URL object
  URL.revokeObjectURL(url);
};

/**
 * Builds a filename for the document
 */
export const buildDocumentFileName = (
  documentType: RussianDocumentType,
  shipmentNumber: number,
  buyerName: string,
  format: 'pdf' | 'excel' = 'pdf'
): string => {
  const formattedNumber = formatShipmentNumber(shipmentNumber);
  const sanitizedBuyerName = buyerName.replace(/[^\w\s]/gi, '').substring(0, 20);
  const extension = format === 'excel' ? 'xlsx' : 'pdf';
  
  return `${documentType}_${formattedNumber}_${sanitizedBuyerName}.${extension}`;
};
