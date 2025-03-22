
/**
 * Форматирование числа с разделителем тысяч и двумя десятичными
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('ru-RU', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(num);
};

/**
 * Форматирование даты в формате дд.мм.гггг
 */
export const formatDate = (dateString: string): string => {
  const parts = dateString.split('-');
  if (parts.length === 3) {
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  }
  return dateString;
};
