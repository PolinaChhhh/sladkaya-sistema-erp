
import React from 'react';
import { useStore } from '@/store/recipeStore';
import { ShippingDocument } from '@/store/types/shipping';
import '../styles/upd/index.css';
import { UPDHeader, UPDTable, UPDSignatures, UPDFooter } from './upd-sections';

interface UPDTemplateProps {
  shipping: ShippingDocument;
}

const UPDTemplate: React.FC<UPDTemplateProps> = ({ shipping }) => {
  return (
    <div className="upd-container">
      <UPDHeader shipping={shipping} />
      <UPDTable shipping={shipping} />
      <UPDSignatures />
      <UPDFooter shipping={shipping} />
    </div>
  );
};

export default UPDTemplate;
