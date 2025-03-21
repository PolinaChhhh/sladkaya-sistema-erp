
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RecipeTag } from '@/store/types';
import RecipeTagManager from './RecipeTagManager';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, ImageIcon } from 'lucide-react';

interface RecipeBasicFieldsProps {
  name: string;
  description: string;
  tags: RecipeTag[];
  imageUrl?: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTagsChange: (tags: RecipeTag[]) => void;
  onImageChange: (imageUrl: string) => void;
}

const RecipeBasicFields: React.FC<RecipeBasicFieldsProps> = ({
  name,
  description,
  tags,
  imageUrl,
  onNameChange,
  onDescriptionChange,
  onTagsChange,
  onImageChange,
}) => {
  const [isImageLoading, setIsImageLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsImageLoading(true);
    
    // Read the file and convert to data URL
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      onImageChange(result);
      setIsImageLoading(false);
    };
    reader.onerror = () => {
      setIsImageLoading(false);
    };
    reader.readAsDataURL(file);
  };

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
        <Label htmlFor="image">Фото рецепта</Label>
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-2 border-cream-100">
            {imageUrl ? (
              <AvatarImage src={imageUrl} alt={name} />
            ) : (
              <AvatarFallback className="bg-cream-50 text-confection-400">
                <ImageIcon className="h-8 w-8" />
              </AvatarFallback>
            )}
          </Avatar>
          
          <div>
            <Input 
              id="image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mb-1"
              disabled={isImageLoading}
              onClick={() => document.getElementById('image')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isImageLoading ? 'Загрузка...' : 'Загрузить фото'}
            </Button>
            <p className="text-xs text-muted-foreground">
              Рекомендуемый размер: 800x600
            </p>
          </div>
        </div>
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
