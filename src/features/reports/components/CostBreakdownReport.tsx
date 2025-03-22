
import React from 'react';
import { Card } from '@/components/ui/card';
import { useProductProfitability } from '../hooks/useProductProfitability';
import EmptyReportState from './EmptyReportState';
import ReportFilters from './filters/ReportFilters';
import CostBreakdownChart from './chart/CostBreakdownChart';
import { Skeleton } from '@/components/ui/skeleton';

const CostBreakdownReport: React.FC = () => {
  const { 
    profitabilityData, 
    costBreakdownData,
    isLoading,
    selectedMonth,
    setSelectedMonth,
    selectedRecipeId,
    setSelectedRecipeId,
    recipes,
    outputUnit
  } = useProductProfitability();
  
  const showChart = selectedRecipeId !== null && costBreakdownData.length > 0;
  
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Структура затрат по продуктам</h2>
        <div className="text-sm text-muted-foreground">
          Данные на основе фактического производства
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
          <Skeleton className="h-64 w-full" />
        </div>
      ) : showChart ? (
        <CostBreakdownChart 
          data={costBreakdownData} 
          unit={outputUnit}
          selectedProduct={recipes.find(r => r.id === selectedRecipeId)?.name || ''}
        />
      ) : (
        <EmptyReportState message="Выберите продукт и период для просмотра структуры затрат" />
      )}
    </Card>
  );
};

export default CostBreakdownReport;
