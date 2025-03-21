
import React from 'react';
import { TrendingUp } from 'lucide-react';
import ProductionList from './ProductionList';
import EmptyState from './EmptyState';
import SearchBar from './SearchBar';
import { ProductionBatch } from '@/store/types';

interface ProductionListSectionProps {
  productions: ProductionBatch[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  getRecipeName: (recipeId: string) => string;
  getRecipeOutput: (recipeId: string) => string;
  onEdit: (production: ProductionBatch) => void;
  onDelete: (production: ProductionBatch) => void;
  onViewDetails: (production: ProductionBatch) => void;
}

const ProductionListSection: React.FC<ProductionListSectionProps> = ({
  productions,
  searchQuery,
  setSearchQuery,
  getRecipeName,
  getRecipeOutput,
  onEdit,
  onDelete,
  onViewDetails
}) => {
  return (
    <>
      <div className="mb-6">
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Поиск по рецептам..."
        />
      </div>
      
      {productions.length > 0 ? (
        <ProductionList 
          productions={productions}
          getRecipeName={getRecipeName}
          getRecipeOutput={getRecipeOutput}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
        />
      ) : (
        <EmptyState icon={TrendingUp} />
      )}
    </>
  );
};

export default ProductionListSection;
