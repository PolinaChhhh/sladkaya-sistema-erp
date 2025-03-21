
import React from 'react';
import { ShippingDocument } from '@/store/recipeStore';
import GlassMorphicCard from '@/components/ui/GlassMorphicCard';
import {
  ShippingCardHeader,
  ShippingCardActions,
  ShippingItemsTable
} from './shipping-card';

interface ShippingCardProps {
  shipping: ShippingDocument;
  buyers: any[];
  productions: any[];
  recipes: any[];
  onStatusUpdate: (id: string, status: ShippingDocument['status']) => void;
  onDeleteClick: (shipping: ShippingDocument) => void;
}

const ShippingCard: React.FC<ShippingCardProps> = ({
  shipping,
  buyers,
  productions,
  recipes,
  onStatusUpdate,
  onDeleteClick
}) => {
  return (
    <GlassMorphicCard 
      className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <ShippingCardHeader 
            shipping={shipping} 
            buyers={buyers} 
          />
          
          <ShippingCardActions 
            shipping={shipping}
            onStatusUpdate={onStatusUpdate}
            onDeleteClick={onDeleteClick}
          />
        </div>
        
        <ShippingItemsTable
          shipping={shipping}
          productions={productions}
          recipes={recipes}
        />
      </div>
    </GlassMorphicCard>
  );
};

export default ShippingCard;
