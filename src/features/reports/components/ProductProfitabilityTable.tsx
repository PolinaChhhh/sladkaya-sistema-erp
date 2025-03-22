
import React from 'react';
import { ProfitabilityData } from '../types/reports';
import ProfitabilityTableView from './table/ProfitabilityTableView';

interface ProductProfitabilityTableProps {
  data: ProfitabilityData[];
}

/**
 * Component that displays profitability data in a table format
 */
const ProductProfitabilityTable: React.FC<ProductProfitabilityTableProps> = ({ data }) => {
  return <ProfitabilityTableView data={data} />;
};

export default ProductProfitabilityTable;
