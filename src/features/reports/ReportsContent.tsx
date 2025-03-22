
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart3, PieChart } from 'lucide-react';
import ProductProfitabilityReport from './components/ProductProfitabilityReport';
import CostBreakdownReport from './components/CostBreakdownReport';

const ReportsContent: React.FC = () => {
  return (
    <Tabs defaultValue="profitability" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="profitability">
          <BarChart3 className="mr-2 h-4 w-4" />
          Прибыльность продуктов
        </TabsTrigger>
        <TabsTrigger value="cost-breakdown">
          <PieChart className="mr-2 h-4 w-4" />
          Структура затрат
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="profitability">
        <ProductProfitabilityReport />
      </TabsContent>
      
      <TabsContent value="cost-breakdown">
        <CostBreakdownReport />
      </TabsContent>
    </Tabs>
  );
};

export default ReportsContent;
