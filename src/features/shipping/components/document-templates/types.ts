
import { RussianDocumentType } from '@/store/types/shipping';

export interface DocumentTemplate {
  id: string;
  name: string;
  type: RussianDocumentType;
  format: 'word' | 'excel';
  description: string;
  dateCreated: string;
  substitutionRules: string; // JSON string with rules for data substitution
  file: File | null;
}
