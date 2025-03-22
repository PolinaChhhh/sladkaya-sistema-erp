
import { useMemo } from 'react';

export const useProcessUtils = () => {
  // Format preparation time from minutes to hours and minutes if needed
  const formatPrepTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes} мин`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) return `${hours} ч`;
    return `${hours} ч ${remainingMinutes} мин`;
  };
  
  // Highlight cooking keywords in process text
  const highlightProcessText = (text: string) => {
    const keyWords = ['mix', 'bake', 'cool', 'stir', 'whisk', 'fold', 'knead', 'melt', 'sift', 'beat', 'chill', 'boil', 'simmer', 'roast', 'fry'];
    
    return keyWords.reduce((result, word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      return result.replace(regex, `<span class="text-confection-500 font-medium">${word}</span>`);
    }, text);
  };
  
  return {
    formatPrepTime,
    highlightProcessText
  };
};
