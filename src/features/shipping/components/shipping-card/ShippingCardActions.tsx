
import React from 'react';
import { Truck, ClipboardCheck, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShippingDocument } from '@/store/recipeStore';

interface ShippingCardActionsProps {
  shipping: ShippingDocument;
  onStatusUpdate: (id: string, status: ShippingDocument['status']) => void;
  onDeleteClick: (shipping: ShippingDocument) => void;
  onEditClick: (shipping: ShippingDocument) => void;
}

const ShippingCardActions: React.FC<ShippingCardActionsProps> = ({
  shipping,
  onStatusUpdate,
  onDeleteClick,
  onEditClick
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {shipping.status === 'draft' && (
        <>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onStatusUpdate(shipping.id, 'shipped')}
          >
            <Truck className="h-4 w-4 mr-1.5" />
            Отгружено
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEditClick(shipping)}
          >
            <Edit className="h-4 w-4 mr-1.5" />
            Изменить
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="text-red-500 border-red-200 hover:bg-red-50"
            onClick={() => onDeleteClick(shipping)}
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            Удалить
          </Button>
        </>
      )}
      
      {shipping.status === 'shipped' && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onStatusUpdate(shipping.id, 'delivered')}
        >
          <ClipboardCheck className="h-4 w-4 mr-1.5" />
          Доставлено
        </Button>
      )}
    </div>
  );
};

export default ShippingCardActions;
