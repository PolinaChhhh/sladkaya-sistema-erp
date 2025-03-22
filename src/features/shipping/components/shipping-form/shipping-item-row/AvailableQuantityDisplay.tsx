
import React from 'react';

interface AvailableQuantityDisplayProps {
  availableQuantity: number;
  productUnit: string;
}

const AvailableQuantityDisplay: React.FC<AvailableQuantityDisplayProps> = ({
  availableQuantity,
  productUnit
}) => {
  return (
    <div className="col-span-1 text-center">
      <span className={`font-medium whitespace-nowrap ${availableQuantity === 0 ? "text-red-500" : ""}`}>
        {availableQuantity} {productUnit}
      </span>
    </div>
  );
};

export default AvailableQuantityDisplay;
