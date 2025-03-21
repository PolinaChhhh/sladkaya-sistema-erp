
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RecipeCategory } from '@/store/types';

interface RecipeBasicFieldsProps {
  name: string;
  description: string;
  category: RecipeCategory;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCategoryChange: (value: RecipeCategory) => void;
}

const RecipeBasicFields: React.FC<RecipeBasicFieldsProps> = ({
  name,
  description,
  category,
  onNameChange,
  onDescriptionChange,
  onCategoryChange,
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
        <Label htmlFor="category">Категория</Label>
        <Select 
          value={category} 
          onValueChange={(value) => onCategoryChange(value as RecipeCategory)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите категорию" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semi-finished">Полуфабрикат</SelectItem>
            <SelectItem value="finished">Готовый продукт</SelectItem>
          </SelectContent>
        </Select>
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
