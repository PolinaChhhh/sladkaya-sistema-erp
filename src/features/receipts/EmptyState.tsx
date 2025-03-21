
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  onAction: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  buttonText,
  onAction
}) => {
  return (
    <div className="text-center py-10 border border-dashed rounded-lg bg-gray-50">
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      <Button onClick={onAction} className="bg-purple-600 hover:bg-purple-700">
        <PlusCircle className="mr-2 h-4 w-4" />
        {buttonText}
      </Button>
    </div>
  );
};

export default EmptyState;
