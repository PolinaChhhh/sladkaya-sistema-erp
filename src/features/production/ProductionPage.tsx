
import React from 'react';
import { TrendingUp } from 'lucide-react';
import ProductionHeader from './components/ProductionHeader';
import ProductionList from './components/ProductionList';
import ProductionDialog from './components/ProductionDialog';
import SearchBar from './components/SearchBar';
import { useProductionState } from './hooks/useProductionState';
import EmptyState from './components/EmptyState';

const ProductionPage = () => {
  const {
    searchQuery,
    setSearchQuery,
    sortedProductions,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    formData,
    setFormData,
    handleCreateProduction,
    calculateCost,
    getRecipeName,
    getRecipeOutput
  } = useProductionState();

  return (
    <div className="max-w-5xl mx-auto">
      <ProductionHeader onAddNew={() => setIsCreateDialogOpen(true)} />
      
      <div className="mb-6">
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Поиск по рецептам..."
        />
      </div>
      
      {sortedProductions.length > 0 ? (
        <ProductionList 
          productions={sortedProductions}
          getRecipeName={getRecipeName}
          getRecipeOutput={getRecipeOutput}
        />
      ) : (
        <EmptyState icon={TrendingUp} />
      )}
      
      <ProductionDialog 
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleCreateProduction}
        calculateCost={calculateCost}
        getRecipeOutput={getRecipeOutput}
      />
    </div>
  );
};

export default ProductionPage;
