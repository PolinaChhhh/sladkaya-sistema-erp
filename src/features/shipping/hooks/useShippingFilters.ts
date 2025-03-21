
import { useState } from 'react';
import { ShippingDocument } from '@/store/recipeStore';

export const useShippingFilters = (shippings: ShippingDocument[], buyers: any[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter shippings based on search query
  const filteredShippings = shippings.filter(shipping => {
    const buyer = buyers.find(b => b.id === shipping.buyerId);
    const customerName = buyer ? buyer.name : shipping.customer;
    return customerName.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Sort shipping documents by date (newest first)
  const sortedShippings = [...filteredShippings].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  return {
    searchQuery,
    setSearchQuery,
    sortedShippings
  };
};
