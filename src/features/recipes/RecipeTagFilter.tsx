
import React from 'react';
import { RecipeTag } from '@/store/types';
import { Tag } from 'lucide-react';

interface RecipeTagFilterProps {
  allTags: RecipeTag[];
  selectedTags: string[];
  onTagToggle: (tagId: string) => void;
}

const RecipeTagFilter: React.FC<RecipeTagFilterProps> = ({ 
  allTags, 
  selectedTags, 
  onTagToggle 
}) => {
  if (allTags.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Tag size={16} className="text-gray-500" />
        <span className="text-sm font-medium">Фильтр по тегам:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {allTags.map(tag => {
          const isSelected = selectedTags.includes(tag.id);
          return (
            <button
              key={tag.id}
              onClick={() => onTagToggle(tag.id)}
              className={`flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                isSelected 
                  ? 'text-white' 
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              }`}
              style={isSelected ? { backgroundColor: tag.color } : {}}
            >
              {tag.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RecipeTagFilter;
