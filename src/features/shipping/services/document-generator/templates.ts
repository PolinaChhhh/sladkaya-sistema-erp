
import { RussianDocumentType } from '@/store/types/shipping';

// Store templates for document types
export const documentTemplates: Record<RussianDocumentType, File | null> = {
  TORG12: null,
  UTD: null,
  TTN: null,
  TN: null
};

/**
 * Set a template file for a specific document type
 */
export const setDocumentTemplate = async (
  documentType: RussianDocumentType,
  file: File
): Promise<void> => {
  documentTemplates[documentType] = file;
  console.log(`Template set for ${documentType}:`, file.name);
};

/**
 * Gets the appropriate template for the document type
 */
export const getDocumentTemplate = async (documentType: RussianDocumentType): Promise<string> => {
  // In a real implementation, this would load the actual template
  // For now, we'll return a placeholder
  return `Template for ${documentType}`;
};
