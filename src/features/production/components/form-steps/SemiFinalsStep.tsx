
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

interface SemiFinal {
  id: string;
  name: string;
  required: boolean;
  amount: number;
}

interface SemiFinalsStepProps {
  requiredSemiFinals: SemiFinal[];
  selectedSemiFinals: string[];
  onSemiFinalToggle: (semiFinalId: string) => void;
}

const SemiFinalsStep: React.FC<SemiFinalsStepProps> = ({
  requiredSemiFinals,
  selectedSemiFinals,
  onSemiFinalToggle
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Требуемые полуфабрикаты</h3>
      
      {requiredSemiFinals.length > 0 ? (
        <div className="space-y-2 border rounded-md p-3">
          {requiredSemiFinals.map((semiFinal) => (
            <div key={semiFinal.id} className="flex items-center space-x-2">
              <Checkbox
                id={`semi-final-${semiFinal.id}`}
                checked={selectedSemiFinals?.includes(semiFinal.id) ?? true}
                onCheckedChange={() => onSemiFinalToggle(semiFinal.id)}
              />
              <Label htmlFor={`semi-final-${semiFinal.id}`} className="text-sm font-normal">
                {semiFinal.name} (требуется {semiFinal.amount.toFixed(2)})
              </Label>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center p-3 text-sm text-amber-600 bg-amber-50 rounded-md">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span>У данного продукта нет полуфабрикатов</span>
        </div>
      )}
      
      <div className="pt-2">
        <p className="text-xs text-gray-500">
          Выбранные полуфабрикаты будут произведены автоматически перед основным продуктом
        </p>
      </div>
    </div>
  );
};

export default SemiFinalsStep;
