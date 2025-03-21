
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface ReceiptListHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onAddReceipt: () => void;
}

const ReceiptListHeader: React.FC<ReceiptListHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  onAddReceipt
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="relative w-64">
        <input
          type="text"
          placeholder="Поиск поступлений..."
          className="w-full px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Button onClick={onAddReceipt} className="bg-cream-600 hover:bg-cream-700">
        <PlusCircle className="mr-2 h-4 w-4" />
        Добавить поступление
      </Button>
    </div>
  );
};

export default ReceiptListHeader;
