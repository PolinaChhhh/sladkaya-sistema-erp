
import React from 'react';
import { Card } from '@/components/ui/card';
import { useProductProfitability } from '../hooks/useProductProfitability';
import ProductProfitabilityTable from './ProductProfitabilityTable';
import EmptyReportState from './EmptyReportState';

const ProductProfitabilityReport: React.FC = () => {
  const { profitabilityData, isLoading } = useProductProfitability();
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Анализ валовой прибыли по продуктам</h2>
      
      {isLoading ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">Загрузка данных...</p>
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
