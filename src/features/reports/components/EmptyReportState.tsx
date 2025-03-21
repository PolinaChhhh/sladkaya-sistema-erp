
import React from 'react';
import { FileBarChart } from 'lucide-react';

const EmptyReportState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <FileBarChart className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-lg font-medium">Нет данных для отчёта</h3>
      <p className="mt-2 text-sm text-gray-500">
        Для формирования отчёта необходимо создать отгрузки продукции клиентам.
      </p>
    </div>
  );
};

export default EmptyReportState;
