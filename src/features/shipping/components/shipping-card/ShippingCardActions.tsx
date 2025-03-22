
import React from 'react';
import { ShippingDocument } from '@/store/types/shipping';
import { Button } from '@/components/ui/button';
import { 
  Truck, 
  CheckCircle, 
  FileText,
  Edit,
  Trash2
} from 'lucide-react';

interface ShippingCardActionsProps {
  shipping: ShippingDocument;
  onStatusUpdate: (id: string, status: ShippingDocument['status']) => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
  handleGenerateDocument: () => void;
  canShip: boolean;
  canDeliver: boolean;
  canGenerate: boolean;
}

const ShippingCardActions: React.FC<ShippingCardActionsProps> = ({
  shipping,
  onStatusUpdate,
  onEditClick,
  onDeleteClick,
  handleGenerateDocument,
  canShip,
  canDeliver,
  canGenerate
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {canShip && (
        <Button 
          onClick={() => onStatusUpdate(shipping.id, 'shipped')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Truck className="h-4 w-4 mr-2" />
          Отгрузить
        </Button>
      )}
      
      {canDeliver && (
        <Button 
          onClick={() => onStatusUpdate(shipping.id, 'delivered')}
          className="bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Подтвердить доставку
        </Button>
      )}
      
      {/* Document generation button */}
      {canGenerate && (
        <Button 
          onClick={handleGenerateDocument}
          variant="outline"
          className="border-blue-300"
        >
          <FileText className="h-4 w-4 mr-2" />
          Печатная форма УПД
        </Button>
      )}
      
      {/* Edit button */}
      <Button 
        onClick={onEditClick}
        variant="outline"
        className="border-gray-300"
      >
        <Edit className="h-4 w-4 mr-2" />
        Редактировать
      </Button>
      
      {/* Delete button */}
      {shipping.status === 'draft' && (
        <Button 
          onClick={onDeleteClick}
          variant="outline"
          className="border-red-300 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-2 text-red-500" />
          Удалить
        </Button>
      )}
      
      {/* Status indicator for delivered shipments */}
      {shipping.status === 'delivered' && (
        <div className="flex items-center text-green-600 ml-auto">
          <CheckCircle className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">Доставлено</span>
          
          {shipping.documentGenerated && (
            <div className="ml-2 flex items-center text-blue-600">
              <FileText className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">{shipping.documentType}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShippingCardActions;
