
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface RecipeBasicFieldsProps {
  name: string;
  description: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const RecipeBasicFields: React.FC<RecipeBasicFieldsProps> = ({
  name,
  description,
  onNameChange,
  onDescriptionChange,
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
    </>
  );
};

export default RecipeBasicFields;
