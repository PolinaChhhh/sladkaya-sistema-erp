
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardDescription 
} from '@/components/ui/card';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';

interface CostBreakdownItem {
  name: string;
  value: number;
  percent: number;
  color: string;
}

interface CostBreakdownChartProps {
  data: CostBreakdownItem[];
  unit: string;
  selectedProduct: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
        <p className="font-medium">{data.name}</p>
        <p>₽{data.value.toFixed(2)}</p>
        <p className="text-gray-600">{data.percent.toFixed(2)}% от общей стоимости</p>
      </div>
    );
  }
  return null;
};

const CostBreakdownChart: React.FC<CostBreakdownChartProps> = ({ 
  data, 
  unit,
  selectedProduct 
}) => {
  const totalCost = data.reduce((sum, item) => sum + item.value, 0);
  
  if (data.length === 0) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Структура затрат</CardTitle>
          <CardDescription>Нет данных о производстве выбранного продукта за указанный период</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Производства не найдены</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Структура затрат: {selectedProduct}</CardTitle>
        <CardDescription>
          Общая себестоимость: ₽{totalCost.toFixed(2)} за {unit}
          <span className="ml-2 text-sm text-muted-foreground">(на основе данных о производстве)</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                innerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${percent.toFixed(1)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostBreakdownChart;
