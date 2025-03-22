
import React from 'react';
import { ShippingDocument } from '@/store/types/shipping';
import { Button } from '@/components/ui/button';
import { 
  Truck, 
  CheckCircle, 
  AlertCircle,
  FileText
} from 'lucide-react';

interface ShippingCardActionsProps {
  shipping: ShippingDocument;
  onStatusUpdate: (id: string, status: ShippingDocument['status']) => void;
}

const ShippingCardActions: React.FC<ShippingCardActionsProps> = ({
  shipping,
  onStatusUpdate
}) => {
  // Different actions based on current status
  if (shipping.status === 'draft') {
    return (
      <Button 
        onClick={() => onStatusUpdate(shipping.id, 'shipped')}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <Truck className="h-4 w-4 mr-2" />
        Отгрузить
      </Button>
    );
  }
  
  if (shipping.status === 'shipped') {
    return (
      <Button 
        onClick={() => onStatusUpdate(shipping.id, 'delivered')}
        className="bg-green-600 hover:bg-green-700"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Подтвердить доставку
      </Button>
    );
  }
  
  if (shipping.status === 'delivered') {
    return (
      <div className="flex items-center text-green-600">
        <CheckCircle className="h-4 w-4 mr-1" />
        <span className="text-sm font-medium">Доставлено</span>
        
        {shipping.documentGenerated && (
          <div className="ml-2 flex items-center text-blue-600">
            <FileText className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">{shipping.documentType}</span>
          </div>
        )}
      </div>
    );
  }
  
  // Default fallback
  return (
    <div className="flex items-center text-amber-600">
      <AlertCircle className="h-4 w-4 mr-1" />
      <span className="text-sm">Неизвестный статус</span>
    </div>
  );
};

export default ShippingCardActions;
