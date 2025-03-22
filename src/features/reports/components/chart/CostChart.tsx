
import React from 'react';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent 
} from '@/components/ui/chart';
import { format } from 'date-fns';
import { 
  Line, 
  LineChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface DailyCostData {
  date: string;
  unitCost: number;
  formattedDate: string;
}

interface CostChartProps {
  data: DailyCostData[];
  unit: string;
}

const CostChart: React.FC<CostChartProps> = ({ data, unit }) => {
  // Define chart configuration
  const chartConfig = {
    unitCost: {
      label: `Cost per ${unit}`,
      theme: {
        light: 'rgb(134, 239, 172)', // Light green color
        dark: 'rgb(134, 239, 172)'
      }
    }
  };

  if (data.length === 0) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Production Cost Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">No data available for the selected period</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Production Cost Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ChartContainer config={chartConfig}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                tickFormatter={(value) => `₽${value.toFixed(0)}`}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={60}
              />
              <Tooltip content={<></>} />
              <ChartTooltip 
                content={
                  <ChartTooltipContent 
                    formatter={(value, name) => {
                      return [
                        `₽${Number(value).toFixed(2)}`,
                        name === 'unitCost' ? 'Cost per unit' : name
                      ];
                    }}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="unitCost"
                name="unitCost"
                stroke="var(--color-unitCost)"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostChart;
