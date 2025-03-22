
import React from 'react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface QuantityInputProps {
  quantity: number;
  availableQuantity: number;
  productName: string;
  productUnit: string;
  onChange: (newQuantity: number) => void;
}

const QuantityInput: React.FC<QuantityInputProps> = ({
  quantity,
  availableQuantity,
  productName,
  productUnit,
  onChange
}) => {
  const handleQuantityChange = (newQuantity: number) => {
    // Ensure we get a valid number
    const parsedQuantity = newQuantity < 0 ? 0 : newQuantity;
    
    // Make sure we don't exceed available stock
    const validQuantity = Math.min(parsedQuantity, availableQuantity);
    
    if (validQuantity !== parsedQuantity && parsedQuantity > 0) {
      console.log(`Limiting quantity to available stock: ${validQuantity} (requested: ${parsedQuantity})`);
      toast.warning(`Only ${availableQuantity} ${productUnit} of "${productName}" available`);
    }
    
    onChange(validQuantity);
  };

  return (
    <div className="col-span-1">
      <Input
        type="number"
        min="1"
        max={availableQuantity}
        value={quantity}
        onChange={(e) => handleQuantityChange(Number(e.target.value))}
        className="text-center"
        disabled={availableQuantity === 0}
      />
      {quantity > availableQuantity && (
        <p className="text-xs text-red-500 mt-1">
          Exceeds available quantity
        </p>
      )}
      {availableQuantity === 0 && (
        <p className="text-xs text-amber-500 mt-1">
          Not in stock
        </p>
      )}
    </div>
  );
};

export default QuantityInput;
