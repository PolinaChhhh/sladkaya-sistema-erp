
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface RecipeImageProps {
  name: string;
  imageUrl?: string;
}

const RecipeImage: React.FC<RecipeImageProps> = ({ name, imageUrl }) => {
  // Placeholder image when no image is available
  const placeholderImage = 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d?auto=format&fit=crop&w=800&q=80';
  
  return (
    <div className="flex justify-center mb-6">
      <Avatar className="h-48 w-48 border-4 border-cream-100">
        <AvatarImage 
          src={imageUrl || placeholderImage} 
          alt={name} 
          className="object-cover"
        />
        <AvatarFallback className="text-3xl font-playfair text-confection-500">
          {name.substring(0, 2)}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default RecipeImage;
