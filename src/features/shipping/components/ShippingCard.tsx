
import React from 'react';
import { Calendar, Truck, ClipboardCheck, Trash2, Hash } from 'lucide-react';
import { ShippingDocument } from '@/store/recipeStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import GlassMorphicCard from '@/components/ui/GlassMorphicCard';
import { 
  formatDate, 
  getStatusColor, 
  getStatusText, 
  getBuyerName, 
  calculateTotalAmount, 
  calculateVatAmount,
  formatShipmentNumber 
} from '../hooks/useShipmentsList';
import { getProductName, getProductUnit } from '../utils/shippingUtils';

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
  // Calculate total and VAT amounts
  const totalWithoutVat = shipping.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const vatAmount = calculateVatAmount(shipping.items);
  const totalWithVat = calculateTotalAmount(shipping.items);

  return (
    <GlassMorphicCard 
      className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap justify-between items-start gap-3">
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
        </div>
        
        <div className="bg-white/70 rounded-lg border border-blue-200 overflow-hidden">
          <div className="grid grid-cols-7 gap-2 p-3 bg-blue-50 text-sm font-medium text-gray-600">
            <div className="col-span-2">Товар</div>
            <div className="text-center">Количество</div>
            <div className="text-center">Цена (без НДС)</div>
            <div className="text-center">НДС %</div>
            <div className="text-center">Цена (с НДС)</div>
            <div className="text-right">Сумма</div>
          </div>
          
          {shipping.items.map((item, idx) => {
            const vatRate = item.vatRate || 0;
            const priceWithVat = item.price * (1 + vatRate / 100);
            const amount = item.quantity * priceWithVat;
            
            return (
              <div key={idx} className="grid grid-cols-7 gap-2 p-3 text-sm border-t border-blue-100">
                <div className="col-span-2">{getProductName(productions, recipes, item.productionBatchId)}</div>
                <div className="text-center">{item.quantity} {getProductUnit(productions, recipes, item.productionBatchId)}</div>
                <div className="text-center">{item.price.toFixed(2)} ₽</div>
                <div className="text-center">{vatRate}%</div>
                <div className="text-center">{priceWithVat.toFixed(2)} ₽</div>
                <div className="text-right font-medium">{amount.toFixed(2)} ₽</div>
              </div>
            );
          })}
          
          <div className="grid grid-cols-7 gap-2 p-3 bg-blue-50 border-t border-blue-100">
            <div className="col-span-6 text-right font-medium">Сумма без НДС:</div>
            <div className="text-right font-medium">{totalWithoutVat.toFixed(2)} ₽</div>
          </div>
          
          <div className="grid grid-cols-7 gap-2 p-3 bg-blue-50 border-t border-blue-100">
            <div className="col-span-6 text-right font-medium">НДС:</div>
            <div className="text-right font-medium">{vatAmount.toFixed(2)} ₽</div>
          </div>
          
          <div className="grid grid-cols-7 gap-2 p-3 bg-blue-50 border-t border-blue-100">
            <div className="col-span-6 text-right font-medium">Итого с НДС:</div>
            <div className="text-right font-bold">{totalWithVat.toFixed(2)} ₽</div>
          </div>
        </div>
      </div>
    </GlassMorphicCard>
  );
};

export default ShippingCard;
