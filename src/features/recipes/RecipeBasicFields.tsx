
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RecipeTag } from '@/store/types';
import RecipeTagManager from './RecipeTagManager';

interface RecipeBasicFieldsProps {
  name: string;
  description: string;
  tags: RecipeTag[];
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTagsChange: (tags: RecipeTag[]) => void;
}

const RecipeBasicFields: React.FC<RecipeBasicFieldsProps> = ({
  name,
  description,
  tags,
  onNameChange,
  onDescriptionChange,
  onTagsChange,
}) => {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="name">Название</Label>
        <Input 
          id="name" 
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Введите название рецепта"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="description">Описание</Label>
        <Textarea 
          id="description" 
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Описание рецепта (опционально)"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="tags">Теги</Label>
        <RecipeTagManager 
          tags={tags}
          onUpdateTags={onTagsChange}
        />
      </div>
    </>
  );
};

export default RecipeBasicFields;
