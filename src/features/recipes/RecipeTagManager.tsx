
import React, { useState } from 'react';
import { Plus, X, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RecipeTag } from '@/store/types';

// Predefined tag colors
const TAG_COLORS = [
  '#8E9196', // Neutral Gray
  '#9b87f5', // Primary Purple
  '#F97316', // Bright Orange
  '#0EA5E9', // Ocean Blue
  '#10B981', // Green
  '#F43F5E', // Pink
  '#8B5CF6', // Vivid Purple
  '#D946EF', // Magenta Pink
];

interface RecipeTagManagerProps {
  tags: RecipeTag[];
  onUpdateTags: (tags: RecipeTag[]) => void;
}

const RecipeTagManager: React.FC<RecipeTagManagerProps> = ({ tags, onUpdateTags }) => {
  const [newTagName, setNewTagName] = useState('');

  const handleAddTag = () => {
    if (newTagName.trim() === '') return;
    
    // Check if tag already exists
    if (tags.some(tag => tag.name.toLowerCase() === newTagName.toLowerCase())) {
      setNewTagName('');
      return;
    }
    
    // Use a random color from the predefined colors
    const color = TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
    
    const newTag: RecipeTag = {
      id: crypto.randomUUID(),
      name: newTagName.trim(),
      color,
    };
    
    onUpdateTags([...tags, newTag]);
    setNewTagName('');
  };

  const handleRemoveTag = (tagId: string) => {
    onUpdateTags(tags.filter(tag => tag.id !== tagId));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-grow relative">
          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Добавить тег..."
            className="pl-10"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
          />
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          onClick={handleAddTag}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <div 
              key={tag.id} 
              className="flex items-center rounded-full px-2 py-1 text-xs font-medium text-white"
              style={{ backgroundColor: tag.color }}
            >
              <span>{tag.name}</span>
              <button 
                type="button" 
                className="ml-1.5 hover:bg-white/20 rounded-full p-0.5"
                onClick={() => handleRemoveTag(tag.id)}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeTagManager;
