
import React from 'react';
import ReportsContent from '@/features/reports/ReportsContent';

const Reports: React.FC = () => {
  return (
    <div className="container py-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Отчёты</h1>
      <ReportsContent />
    </div>
  );
};

export default Reports;
