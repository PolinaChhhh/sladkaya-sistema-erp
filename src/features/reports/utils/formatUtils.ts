
/**
 * Utility functions for formatting and styling in reports
 */

/**
 * Returns the appropriate background color class based on profitability percentage
 */
export const getProfitabilityColor = (profitability: number): string => {
  if (profitability < 0) return 'bg-red-100';
  if (profitability < 20) return 'bg-red-50';
  if (profitability < 50) return 'bg-yellow-50';
  return 'bg-green-50';
};

/**
 * Formats a number to a localized string with 2 decimal places
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString('ru-RU', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
