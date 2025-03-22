
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ShippingDocument, Buyer, ProductionBatch, Recipe } from '@/store/types';
import { 
  ShippingCardHeader, 
  ShippingCardActions,
  ShippingItemsTable
} from './shipping-card';
import { DocumentGenerationDialog } from './document-generation';

interface ShippingCardProps {
  shipping: ShippingDocument;
  buyers: Buyer[];
  productions: ProductionBatch[];
  recipes: Recipe[];
  onEditClick: (shipping: ShippingDocument) => void;
  onDeleteClick: (shipping: ShippingDocument) => void;
  onStatusUpdate: (shippingId: string, newStatus: ShippingDocument['status']) => void;
}

const ShippingCard: React.FC<ShippingCardProps> = ({
  shipping,
  buyers,
  productions,
  recipes,
  onEditClick,
  onDeleteClick,
  onStatusUpdate
}) => {
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  
  const canShip = shipping.status === 'draft';
  const canDeliver = shipping.status === 'shipped';
  const canGenerate = true; // Allow document generation in any status
  
  const handleGenerateDocument = () => {
    console.log('Generate document for shipment:', shipping.id);
    setIsDocumentDialogOpen(true);
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
      
      {/* Document Generation Dialog */}
      <DocumentGenerationDialog
        isOpen={isDocumentDialogOpen}
        onOpenChange={setIsDocumentDialogOpen}
        shipping={shipping}
      />
    </Card>
  );
};

export default ShippingCard;
