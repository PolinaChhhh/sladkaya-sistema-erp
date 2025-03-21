
import React from 'react';
import { Calendar, Hash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ShippingDocument } from '@/store/recipeStore';
import { 
  formatDate, 
  getStatusColor, 
  getStatusText, 
  getBuyerName,
  formatShipmentNumber
} from '../../hooks/useShipmentsList';

interface ShippingCardHeaderProps {
  shipping: ShippingDocument;
  buyers: any[];
}

const ShippingCardHeader: React.FC<ShippingCardHeaderProps> = ({
  shipping,
  buyers
}) => {
  return (
    <div>
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-lg">{getBuyerName(buyers, shipping)}</h3>
        <Badge className={`${getStatusColor(shipping.status)}`}>
          {getStatusText(shipping.status)}
        </Badge>
      </div>
      <div className="flex items-center gap-3 mt-1">
        <div className="flex items-center text-gray-600">
          <Calendar className="h-4 w-4 mr-1.5" />
          <span className="text-sm">{formatDate(shipping.date)}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Hash className="h-4 w-4 mr-1.5" />
          <span className="text-sm">№{formatShipmentNumber(shipping.shipmentNumber || 0)}</span>
        </div>
      </div>
    </div>
  );
};

export default ShippingCardHeader;
