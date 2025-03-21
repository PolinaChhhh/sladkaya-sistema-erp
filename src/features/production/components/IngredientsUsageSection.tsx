
import React from 'react';
import IngredientUsageList from './ingredients/IngredientUsageList';

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

interface IngredientsUsageSectionProps {
  usageDetails: IngredientUsage[];
}

const IngredientsUsageSection: React.FC<IngredientsUsageSectionProps> = ({ usageDetails }) => {
  return <IngredientUsageList usageDetails={usageDetails} />;
};

export default IngredientsUsageSection;
