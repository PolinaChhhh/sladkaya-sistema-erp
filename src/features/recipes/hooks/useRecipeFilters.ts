
import { useState, useMemo } from 'react';
import { Recipe, RecipeTag } from '@/store/types';

export const useRecipeFilters = (recipes: Recipe[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Collect all unique tags from recipes
  const allTags = useMemo(() => {
    const tagMap = new Map<string, RecipeTag>();
    
    recipes.forEach(recipe => {
      if (recipe.tags) {
        recipe.tags.forEach(tag => {
          if (!tagMap.has(tag.id)) {
            tagMap.set(tag.id, tag);
          }
        });
      }
    });
    
    return Array.from(tagMap.values());
  }, [recipes]);

  // Handle tag filtering
  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };
  
  // Filter recipes by search query, category, and tags
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || recipe.category === categoryFilter;
    
    // Tag filtering
    const matchesTags = selectedTags.length === 0 || 
      (recipe.tags && selectedTags.every(tagId => 
        recipe.tags.some(tag => tag.id === tagId)
      ));
    
    return matchesSearch && matchesCategory && matchesTags;
  });
  
  return {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    categoryFilter,
    setCategoryFilter,
    selectedTags,
    allTags,
    handleTagToggle,
    filteredRecipes
  };
};
