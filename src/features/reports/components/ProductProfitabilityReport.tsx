
import React from 'react';
import { Card } from '@/components/ui/card';
import { useProductProfitability } from '../hooks/useProductProfitability';
import ProductProfitabilityTable from './ProductProfitabilityTable';
import EmptyReportState from './EmptyReportState';
import { Skeleton } from '@/components/ui/skeleton';

const ProductProfitabilityReport: React.FC = () => {
  const { profitabilityData, isLoading } = useProductProfitability();
  
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Анализ валовой прибыли по продуктам</h2>
        <div className="text-sm text-muted-foreground">
          Данные основаны на фактических отгрузках
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : profitabilityData.length > 0 ? (
        <ProductProfitabilityTable data={profitabilityData} />
      ) : (
        <EmptyReportState />
      )}
    </Card>
  );
};

export default ProductProfitabilityReport;
