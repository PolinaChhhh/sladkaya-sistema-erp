
import React, { useState } from 'react'; 
import { useStore, ShippingDocument } from '@/store/recipeStore';
import { 
  Truck, 
  Plus, 
  Search, 
  Calendar, 
  ClipboardCheck,
  Trash2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import GlassMorphicCard from '@/components/ui/GlassMorphicCard';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ShipmentsList = () => {
  const { productions, shippings, recipes, buyers, addShipping, updateShippingStatus, deleteShipping } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<ShippingDocument | null>(null);
  
  const [formData, setFormData] = useState<{
    buyerId: string;
    date: string;
    items: {
      productionBatchId: string;
      quantity: number;
      price: number;
    }[];
  }>({
    buyerId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    items: [],
  });
  
  const filteredShippings = shippings.filter(shipping => {
    const buyer = buyers.find(b => b.id === shipping.buyerId);
    const customerName = buyer ? buyer.name : shipping.customer;
    return customerName.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Sort shipping documents by date (newest first)
  const sortedShippings = [...filteredShippings].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  const initCreateForm = () => {
    setFormData({
      buyerId: buyers.length > 0 ? buyers[0].id : '',
      date: format(new Date(), 'yyyy-MM-dd'),
      items: [],
    });
    setIsCreateDialogOpen(true);
  };
  
  const initDeleteConfirm = (shipping: ShippingDocument) => {
    setSelectedShipping(shipping);
    setIsDeleteConfirmOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (selectedShipping) {
      deleteShipping(selectedShipping.id);
      toast.success('Отгрузка удалена');
      setIsDeleteConfirmOpen(false);
    }
  };
  
  const handleCreateShipping = () => {
    if (formData.buyerId.trim() === '') {
      toast.error('Выберите клиента');
      return;
    }
    
    if (formData.items.length === 0) {
      toast.error('Добавьте товары для отгрузки');
      return;
    }
    
    // Find the selected buyer
    const selectedBuyer = buyers.find(b => b.id === formData.buyerId);
    
    addShipping({
      buyerId: formData.buyerId,
      customer: selectedBuyer ? selectedBuyer.name : 'Неизвестный клиент', // For backward compatibility
      date: formData.date,
      items: formData.items,
      status: 'draft',
    });
    
    toast.success('Отгрузка создана');
    setIsCreateDialogOpen(false);
  };
  
  const addShippingItem = () => {
    if (productions.length === 0) {
      toast.error('Нет доступных партий продукции');
      return;
    }
    
    const availableProductions = productions.filter(p => {
      // Filter out productions that have already been fully shipped
      const alreadyShippedQuantity = shippings.reduce((total, shipping) => {
        return total + shipping.items
          .filter(item => item.productionBatchId === p.id)
          .reduce((sum, item) => sum + item.quantity, 0);
      }, 0);
      
      return p.quantity > alreadyShippedQuantity;
    });
    
    if (availableProductions.length === 0) {
      toast.error('Нет доступных партий продукции для отгрузки');
      return;
    }
    
    const firstBatch = availableProductions[0];
    
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { 
        productionBatchId: firstBatch.id, 
        quantity: 1, 
        price: firstBatch.cost * 1.3 // Default 30% markup
      }],
    }));
  };
  
  const updateShippingItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    
    if (field === 'productionBatchId' && value !== newItems[index].productionBatchId) {
      // When changing batch, update the price based on the new batch's cost
      const batch = productions.find(p => p.id === value);
      if (batch) {
        newItems[index] = { 
          ...newItems[index], 
          [field]: value,
          price: batch.cost * 1.3 // Default 30% markup when changing batch
        };
      } else {
        newItems[index] = { ...newItems[index], [field]: value };
      }
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    
    setFormData({ ...formData, items: newItems });
  };
  
  const removeShippingItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };
  
  const getProductName = (productionBatchId: string): string => {
    const production = productions.find(p => p.id === productionBatchId);
    if (!production) return 'Неизвестный продукт';
    
    const recipe = recipes.find(r => r.id === production.recipeId);
    return recipe ? recipe.name : 'Неизвестный рецепт';
  };
  
  const getProductUnit = (productionBatchId: string): string => {
    const production = productions.find(p => p.id === productionBatchId);
    if (!production) return '';
    
    const recipe = recipes.find(r => r.id === production.recipeId);
    return recipe ? recipe.outputUnit : '';
  };
  
  const calculateTotalAmount = (items: ShippingDocument['items']): number => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };
  
  const handleStatusUpdate = (shippingId: string, newStatus: ShippingDocument['status']) => {
    updateShippingStatus(shippingId, newStatus);
    toast.success(`Статус отгрузки обновлен: ${getStatusText(newStatus)}`);
  };
  
  const getStatusText = (status: ShippingDocument['status']): string => {
    switch (status) {
      case 'draft': return 'Черновик';
      case 'shipped': return 'Отгружено';
      case 'delivered': return 'Доставлено';
      default: return 'Неизвестно';
    }
  };
  
  const getStatusColor = (status: ShippingDocument['status']): string => {
    switch (status) {
      case 'draft': return 'bg-gray-200 text-gray-800';
      case 'shipped': return 'bg-blue-200 text-blue-800';
      case 'delivered': return 'bg-green-200 text-green-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };
  
  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch {
      return 'Неизвестная дата';
    }
  };

  const getBuyerName = (shipping: ShippingDocument): string => {
    if (shipping.buyerId) {
      const buyer = buyers.find(b => b.id === shipping.buyerId);
      return buyer ? buyer.name : shipping.customer;
    }
    return shipping.customer;
  };

  // Check if we have buyers data to enable the create button
  const canCreateShipment = buyers.length > 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Поиск по клиентам..." 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          onClick={initCreateForm} 
          className="bg-blue-600 hover:bg-blue-700"
          disabled={!canCreateShipment}
        >
          <Plus className="h-4 w-4 mr-2" /> Создать отгрузку
        </Button>
      </div>
      
      {sortedShippings.length > 0 ? (
        <div className="grid gap-4">
          {sortedShippings.map((shipping) => (
            <GlassMorphicCard 
              key={shipping.id}
              className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"
            >
              <div className="flex flex-col space-y-4">
                <div className="flex flex-wrap justify-between items-start gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{getBuyerName(shipping)}</h3>
                      <Badge className={`${getStatusColor(shipping.status)}`}>
                        {getStatusText(shipping.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center mt-1 text-gray-600">
                      <Calendar className="h-4 w-4 mr-1.5" />
                      <span className="text-sm">{formatDate(shipping.date)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {shipping.status === 'draft' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleStatusUpdate(shipping.id, 'shipped')}
                        >
                          <Truck className="h-4 w-4 mr-1.5" />
                          Отгружено
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-500 border-red-200 hover:bg-red-50"
                          onClick={() => initDeleteConfirm(shipping)}
                        >
                          <Trash2 className="h-4 w-4 mr-1.5" />
                          Удалить
                        </Button>
                      </>
                    )}
                    
                    {shipping.status === 'shipped' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleStatusUpdate(shipping.id, 'delivered')}
                      >
                        <ClipboardCheck className="h-4 w-4 mr-1.5" />
                        Доставлено
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="bg-white/70 rounded-lg border border-blue-200 overflow-hidden">
                  <div className="grid grid-cols-4 gap-2 p-3 bg-blue-50 text-sm font-medium text-gray-600">
                    <div>Товар</div>
                    <div className="text-center">Количество</div>
                    <div className="text-center">Цена</div>
                    <div className="text-right">Сумма</div>
                  </div>
                  
                  {shipping.items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-4 gap-2 p-3 text-sm border-t border-blue-100">
                      <div>{getProductName(item.productionBatchId)}</div>
                      <div className="text-center">{item.quantity} {getProductUnit(item.productionBatchId)}</div>
                      <div className="text-center">{item.price.toFixed(2)} ₽</div>
                      <div className="text-right font-medium">{(item.quantity * item.price).toFixed(2)} ₽</div>
                    </div>
                  ))}
                  
                  <div className="grid grid-cols-4 gap-2 p-3 bg-blue-50 border-t border-blue-100">
                    <div className="col-span-3 text-right font-medium">Итого:</div>
                    <div className="text-right font-bold">{calculateTotalAmount(shipping.items).toFixed(2)} ₽</div>
                  </div>
                </div>
              </div>
            </GlassMorphicCard>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Truck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-1">Нет данных об отгрузках</h3>
          <p className="text-gray-500">Создайте первую отгрузку, нажав кнопку выше</p>
        </div>
      )}
      
      {/* Create Shipping Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
                  onClick={addShippingItem}
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
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleCreateShipping}>Создать отгрузку</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Удаление отгрузки</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p>Вы уверены, что хотите удалить эту отгрузку? Это действие нельзя отменить.</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Отмена</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Удалить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShipmentsList;
