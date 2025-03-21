
import React from 'react';

interface ReceiptDetailsHeaderProps {
  supplierName: string;
  formattedDate: string;
  referenceNumber: string | undefined;
  totalAmount: number;
  notes: string | undefined;
}

const ReceiptDetailsHeader: React.FC<ReceiptDetailsHeaderProps> = ({
  supplierName,
  formattedDate,
  referenceNumber,
  totalAmount,
  notes
}) => {
  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500">Поставщик</h4>
          <p className="text-lg font-medium">{supplierName}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Дата</h4>
          <p className="text-lg font-medium">{formattedDate}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500">Номер накладной</h4>
          <p className="text-lg font-medium">{referenceNumber || "-"}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Сумма</h4>
          <p className="text-lg font-medium">{totalAmount.toFixed(2)} ₽</p>
        </div>
      </div>
      
      {notes && (
        <div>
          <h4 className="text-sm font-medium text-gray-500">Примечания</h4>
          <p className="text-md">{notes}</p>
        </div>
      )}
    </div>
  );
};

export default ReceiptDetailsHeader;
