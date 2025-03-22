
import React from 'react';
import { Card } from '@/components/ui/card';
import { useProductProfitability } from '../hooks/useProductProfitability';
import ProductProfitabilityTable from './ProductProfitabilityTable';
import EmptyReportState from './EmptyReportState';
import ReportFilters from './filters/ReportFilters';
import CostChart from './chart/CostChart';
import { Skeleton } from '@/components/ui/skeleton';

const ProductProfitabilityReport: React.FC = () => {
  const { 
    profitabilityData, 
    costChartData,
    isLoading,
    selectedMonth,
    setSelectedMonth,
    selectedRecipeId,
    setSelectedRecipeId,
    recipes,
    outputUnit
  } = useProductProfitability();
  
  const showChart = selectedRecipeId !== null && costChartData.length > 0;
  
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Анализ валовой прибыли по продуктам</h2>
        <div className="text-sm text-muted-foreground">
          Данные на основе фактических отгрузок
        </div>
      </div>
      
      <ReportFilters
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedRecipeId={selectedRecipeId}
        setSelectedRecipeId={setSelectedRecipeId}
        recipes={recipes}
      />
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : profitabilityData.length > 0 ? (
        <>
          <ProductProfitabilityTable data={profitabilityData} />
          
          {showChart && (
            <CostChart data={costChartData} unit={outputUnit} />
          )}
        </>
      ) : (
        <EmptyReportState />
      )}
    </Card>
  );
};

export default ProductProfitabilityReport;
