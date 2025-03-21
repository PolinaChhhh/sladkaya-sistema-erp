
import React from 'react';
import IngredientUsageItem from './IngredientUsageItem';

interface FifoDetail {
  receiptId: string;
  referenceNumber?: string;
  date: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface IngredientUsage {
  ingredientId: string;
  name: string;
  totalAmount: number;
  unit: string;
  totalCost: number;
  fifoDetails: FifoDetail[];
}

interface IngredientUsageListProps {
  usageDetails: IngredientUsage[];
}

const IngredientUsageList: React.FC<IngredientUsageListProps> = ({ usageDetails }) => {
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({});
  
  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (usageDetails.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Нет данных об использованных ингредиентах
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {usageDetails.map((usage, index) => (
        <IngredientUsageItem
          key={index}
          usage={usage}
          isOpen={openItems[usage.ingredientId] || false}
          onToggle={() => toggleItem(usage.ingredientId)}
        />
      ))}
    </div>
  );
};

export default IngredientUsageList;
