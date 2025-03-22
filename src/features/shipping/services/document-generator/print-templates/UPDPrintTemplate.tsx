
import React from 'react';
import { DocumentGenerationData } from '../types';
import './UPDPrintTemplate.css';
import { formatNumber, formatDate } from './utils';
import { 
  UPDHeader, 
  UPDTable, 
  UPDSignatures, 
  UPDFooter, 
  UPDElectronicInfo 
} from './components';

interface UPDPrintTemplateProps {
  data: DocumentGenerationData;
}

/**
 * Печатная форма УПД (Универсальный передаточный документ)
 * Соответствует формату, утвержденному Постановлением Правительства РФ
 */
const UPDPrintTemplate: React.FC<UPDPrintTemplateProps> = ({ data }) => {
  return (
    <div className="upd-print-container">
      <UPDHeader data={data} formatDate={formatDate} />
      <UPDTable data={data} formatNumber={formatNumber} />
      <UPDSignatures data={data} />
      <UPDFooter data={data} formatDate={formatDate} />
      <UPDElectronicInfo data={data} />
    </div>
  );
};

export default UPDPrintTemplate;
