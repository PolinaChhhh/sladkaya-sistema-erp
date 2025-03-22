
import React, { useState } from 'react';
import { Edit, Trash, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShippingDocument } from '@/store/types/shipping';
import { 
  ShippingCardHeader, 
  ShippingItemsTable
} from './shipping-card';
import { 
  getStatusText, 
  getStatusColor, 
  getBuyerName
} from '../hooks/useShippingUtils';
import { DocumentGenerationButton } from './document-generation';
import { DocumentGenerationDialog } from './document-generation';

interface ShippingCardProps {
  shipping: ShippingDocument;
  buyers: any[];
  productions: any[];
  recipes: any[];
  onStatusUpdate: (id: string, status: ShippingDocument['status']) => void;
  onDeleteClick: (shipping: ShippingDocument) => void;
  onEditClick: (shipping: ShippingDocument) => void;
}

const ShippingCard: React.FC<ShippingCardProps> = ({
  shipping,
  buyers,
  productions,
  recipes,
  onStatusUpdate,
  onDeleteClick,
  onEditClick
}) => {
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  
  // Only allow document generation for non-draft shipments
  const canGenerateDocument = shipping.status !== 'draft';
  
  // Only allow editing and deleting draft shipments
  const isDraft = shipping.status === 'draft';
  
  // Get buyer name
  const buyerName = getBuyerName(buyers, shipping);
  
  // Get status display info
  const statusText = getStatusText(shipping.status);
  const statusColor = getStatusColor(shipping.status);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <ShippingCardHeader 
        shipping={shipping} 
        buyerName={buyerName}
      />
      
      <ShippingItemsTable 
        items={shipping.items}
        productions={productions}
        recipes={recipes}
      />
      
      <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center">
          <Badge className={statusColor}>{statusText}</Badge>
          
          {shipping.documentGenerated && (
            <Badge variant="outline" className="ml-2 border-blue-200 text-blue-700">
              <FileText className="h-3 w-3 mr-1" />
              {shipping.documentType}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {isDraft && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEditClick(shipping)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Изменить
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500" 
                onClick={() => onDeleteClick(shipping)}
              >
                <Trash className="h-4 w-4 mr-1" />
                Удалить
              </Button>
            </>
          )}
          
          {!isDraft && (
            <DocumentGenerationButton 
              shipping={shipping}
              onGenerateClick={() => setIsDocumentDialogOpen(true)}
              disabled={!canGenerateDocument}
            />
          )}
        </div>
      </div>
      
      <DocumentGenerationDialog 
        isOpen={isDocumentDialogOpen}
        onOpenChange={setIsDocumentDialogOpen}
        shipping={shipping}
      />
    </div>
  );
};

export default ShippingCard;
