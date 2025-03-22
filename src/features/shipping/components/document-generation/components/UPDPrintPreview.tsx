
import React from 'react';
import { ShippingDocument } from '@/store/types/shipping';
import UPDTemplate from './UPDTemplate';
import { useStore } from '@/store/recipeStore';

interface UPDPrintPreviewProps {
  shipping: ShippingDocument;
}

const UPDPrintPreview: React.FC<UPDPrintPreviewProps> = ({ shipping }) => {
  return (
    <div className="overflow-auto max-h-[70vh] p-4 bg-white">
      <div className="mb-4 text-sm text-gray-500">
        <p>Предварительный просмотр печатной формы УПД</p>
      </div>
      
      <div className="print:p-0 border border-gray-200">
        <UPDTemplate shipping={shipping} />
      </div>
      
      <div className="mt-4 flex justify-end gap-2 print:hidden">
        <button 
          onClick={() => window.print()}
          className="px-4 py-2 bg-confection-600 text-white rounded hover:bg-confection-700 transition-colors"
        >
          Печать
        </button>
      </div>
    </div>
  );
};

export default UPDPrintPreview;
