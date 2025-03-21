
import React from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShippingDocument } from '@/store/recipeStore';
import { toast } from 'sonner';
import { useShippingForm } from '../hooks/useShippingForm';
import { getProductName } from '../utils/shippingUtils';
import { calculateTotalAmount } from '../hooks/useShipmentsList';

interface CreateShippingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    buyerId: string;
    date: string;
    items: {
      productionBatchId: string;
      quantity: number;
      price: number;
    }[];
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    buyerId: string;
    date: string;
    items: {
      productionBatchId: string;
      quantity: number;
      price: number;
    }[];
  }>>;
  buyers: any[];
  productions: any[];
  recipes: any[];
  shippings: ShippingDocument[];
  onSubmit: () => void;
}

const CreateShippingDialog: React.FC<CreateShippingDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  buyers,
  productions,
  recipes,
  shippings,
  onSubmit
}) => {
  const { addShippingItem, updateShippingItem, removeShippingItem } = useShippingForm(
    formData,
    setFormData,
    productions,
    shippings
  );

  const handleAddItem = () => {
    const result = addShippingItem();
    if (result.error) {
      toast.error(result.error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Создание отгрузки</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buyer">Клиент</Label>
              <Select 
                value={formData.buyerId} 
                onValueChange={(value) => setFormData({...formData, buyerId: value})}
              >
                <SelectTrigger id="buyer">
                  <SelectValue placeholder="Выберите клиента" />
                </SelectTrigger>
                <SelectContent>
                  {buyers.map((buyer) => (
                    <SelectItem key={buyer.id} value={buyer.id}>{buyer.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Дата</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Товары в отгрузке</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleAddItem}
              >
                <Plus className="h-4 w-4 mr-1.5" /> Добавить товар
              </Button>
            </div>
            
            {formData.items.length > 0 ? (
              <div className="bg-white/70 rounded-lg border overflow-hidden">
                <div className="grid grid-cols-12 gap-2 p-3 bg-blue-50 text-xs font-medium text-gray-600">
                  <div className="col-span-4">Товар</div>
                  <div className="col-span-2 text-center">Количество</div>
                  <div className="col-span-2 text-center">Цена</div>
                  <div className="col-span-3 text-right">Сумма</div>
                  <div className="col-span-1"></div>
                </div>
                
                {formData.items.map((item, idx) => {
                  const production = productions.find(p => p.id === item.productionBatchId);
                  const recipe = production ? recipes.find(r => r.id === production.recipeId) : null;
                  const amount = item.quantity * item.price;
                  
                  // Calculate available quantity
                  const alreadyShippedQuantity = shippings.reduce((total, shipping) => {
                    return total + shipping.items
                      .filter(shippingItem => shippingItem.productionBatchId === item.productionBatchId)
                      .reduce((sum, shippingItem) => sum + shippingItem.quantity, 0);
                  }, 0);
                  
                  const availableQuantity = production ? production.quantity - alreadyShippedQuantity : 0;
                  
                  return (
                    <div key={idx} className="grid grid-cols-12 gap-2 p-3 text-sm border-t border-gray-100 items-center">
                      <div className="col-span-4">
                        <Select 
                          value={item.productionBatchId} 
                          onValueChange={(value) => updateShippingItem(idx, 'productionBatchId', value)}
                        >
                          <SelectTrigger>
                            <SelectValue 
                              placeholder="Выберите товар" 
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {productions.map((prod) => {
                              const recipe = recipes.find(r => r.id === prod.recipeId);
                              
                              // Calculate already shipped quantity
                              const shippedQuantity = shippings.reduce((total, shipping) => {
                                return total + shipping.items
                                  .filter(item => item.productionBatchId === prod.id)
                                  .reduce((sum, item) => sum + item.quantity, 0);
                              }, 0);
                              
                              const available = prod.quantity - shippedQuantity;
                              
                              return (
                                <SelectItem 
                                  key={prod.id} 
                                  value={prod.id}
                                  disabled={available <= 0}
                                >
                                  {recipe?.name || 'Неизвестно'} ({available} {recipe?.outputUnit || 'шт'} доступно)
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="col-span-2">
                        <Input
                          type="number"
                          min="1"
                          max={availableQuantity}
                          value={item.quantity}
                          onChange={(e) => updateShippingItem(idx, 'quantity', Number(e.target.value))}
                          className="text-center"
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => updateShippingItem(idx, 'price', Number(e.target.value))}
                          className="text-center"
                        />
                      </div>
                      
                      <div className="col-span-3 text-right font-medium">
                        {amount.toFixed(2)} ₽
                      </div>
                      
                      <div className="col-span-1 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-red-500" 
                          onClick={() => removeShippingItem(idx)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
                
                <div className="grid grid-cols-12 gap-2 p-3 bg-blue-50 border-t text-sm">
                  <div className="col-span-8 text-right font-medium">Итого:</div>
                  <div className="col-span-3 text-right font-bold">
                    {calculateTotalAmount(formData.items).toFixed(2)} ₽
                  </div>
                  <div className="col-span-1"></div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed">
                <p className="text-gray-500">Добавьте товары для отгрузки</p>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
          <Button onClick={onSubmit}>Создать отгрузку</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateShippingDialog;
