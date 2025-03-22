
import React from 'react';
import { Card } from '@/components/ui/card';
import { useStore } from '@/store/recipeStore';
import { ShippingDocument } from '@/store/types';
import { 
  ShippingCardHeader, 
  ShippingCardActions,
  ShippingItemsTable
} from './shipping-card';

interface ShippingCardProps {
  shipping: ShippingDocument;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateStatus: (status: ShippingDocument['status']) => void;
  onGenerateDocument: () => void;
}

const ShippingCard: React.FC<ShippingCardProps> = ({
  shipping,
  onEdit,
  onDelete,
  onUpdateStatus,
  onGenerateDocument
}) => {
  const { productions, recipes, buyers } = useStore();
  
  const canShip = shipping.status === 'draft';
  const canDeliver = shipping.status === 'shipped';
  const canGenerate = true; // Allow document generation in any status
  
  return (
    <Card className="overflow-hidden glass border-blue-100">
      <div className="p-5">
        <ShippingCardHeader 
          shipping={shipping} 
          buyers={buyers}
        />
        
        <div className="mt-4">
          <ShippingItemsTable 
            shipping={shipping}
            productions={productions}
            recipes={recipes}
          />
        </div>
        
        <div className="mt-4">
          <ShippingCardActions 
            shipping={shipping}
            onEdit={onEdit}
            onDelete={onDelete}
            onUpdateStatus={onUpdateStatus}
            onGenerateDocument={onGenerateDocument}
            canShip={canShip}
            canDeliver={canDeliver}
            canGenerate={canGenerate}
          />
        </div>
      </div>
    </Card>
  );
};

export default ShippingCard;
