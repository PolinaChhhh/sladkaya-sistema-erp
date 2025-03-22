
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RemoveButtonProps {
  onRemove: () => void;
}

const RemoveButton: React.FC<RemoveButtonProps> = ({
  onRemove
}) => {
  return (
    <div className="col-span-1 text-right">
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 text-red-500" 
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default RemoveButton;
