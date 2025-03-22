
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
  onEditClick: (shipping: ShippingDocument) => void;
  onDeleteClick: (shipping: ShippingDocument) => void;
  onStatusUpdate: (shippingId: string, newStatus: ShippingDocument['status']) => void;
}

const ShippingCard: React.FC<ShippingCardProps> = ({
  shipping,
  onEditClick,
  onDeleteClick,
  onStatusUpdate
}) => {
  const { productions, recipes, buyers } = useStore();
  
  const canShip = shipping.status === 'draft';
  const canDeliver = shipping.status === 'shipped';
  const canGenerate = true; // Allow document generation in any status
  
  const handleGenerateDocument = () => {
    console.log('Generate document for shipment:', shipping.id);
    // This will be implemented with the document generation feature
  };
  
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
            onStatusUpdate={onStatusUpdate}
            onEditClick={() => onEditClick(shipping)}
            onDeleteClick={() => onDeleteClick(shipping)}
            handleGenerateDocument={handleGenerateDocument}
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
