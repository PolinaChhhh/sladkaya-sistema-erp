
import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShippingDocument } from '@/store/types/shipping';

interface DocumentGenerationButtonProps {
  shipping: ShippingDocument;
  onGenerateClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const DocumentGenerationButton: React.FC<DocumentGenerationButtonProps> = ({
  shipping,
  onGenerateClick,
  disabled = false,
  isLoading = false
}) => {
  // Determine button text based on document status
  const getButtonText = () => {
    if (isLoading) return 'Создание документа...';
    if (shipping.documentGenerated) return 'Повторно создать документ';
    return 'Создать документ';
  };

  return (
    <Button 
      onClick={onGenerateClick}
      disabled={disabled || isLoading}
      variant={shipping.documentGenerated ? "outline" : "default"}
      className="w-full"
    >
      <FileText className="h-4 w-4 mr-2" />
      {getButtonText()}
    </Button>
  );
};

export default DocumentGenerationButton;
