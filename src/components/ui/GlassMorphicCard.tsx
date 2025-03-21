
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassMorphicCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const GlassMorphicCard: React.FC<GlassMorphicCardProps> = ({ 
  children, 
  className,
  onClick 
}) => {
  return (
    <div 
      className={cn(
        "glass rounded-2xl p-6 transition-all hover:shadow-md animate-scale-in",
        onClick && "cursor-pointer hover:translate-y-[-2px]",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default GlassMorphicCard;
