
import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Plus, 
  Search, 
  Package, 
  Calendar, 
  User, 
  DollarSign, 
  ClipboardCheck,
  X,
  Edit,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import GlassMorphicCard from '@/components/ui/GlassMorphicCard';
import { useStore, ProductionBatch, ShippingDocument } from '@/store/recipeStore';
import { toast } from 'sonner';
import { format } from 'date-fns';

type ShippingItemForm = {
  productionBatchId: string;
  quantity: number;
  price: number;
};

const Shipping = () => {
  const { productions, shippings, recipes, addShipping, updateShippingStatus } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<ShippingDocument | null>(null);
  
  const [formData, setFormData] = useState<{
    customer: string;
    date: string;
    items: ShippingItemForm[];
  }>({
    customer: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    items: [],
  });
  
  const filteredShippings = shippings.filter(shipping => 
    shipping.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort shipping documents by date (newest first)
  const sortedShippings = [...filteredShippings].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  const initCreateForm = () => {
    setFormData({
      customer: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      items: [],
    });
    setIsCreateDialogOpen(true);
  };
  
  const initDeleteConfirm = (shipping: ShippingDocument) => {
    setSelectedShipping(shipping);
    setIsDeleteConfirmOpen(true);
  };
  
  const handleCreateShipping = () => {
    if (formData.customer.trim() === '') {
      toast.error('Введите название клиента');
      return;
    }
    
    if (formData.items.length === 0) {
      toast.error('Добавьте товары для отгрузки');
      return;
    }
    
    addShipping({
      customer: formData.customer,
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
    
    const firstBatch = productions[0];
    
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { 
        productionBatchId: firstBatch.id, 
        quantity: 1, 
        price: firstBatch.cost * 1.3 // Default 30% markup
      }],
    }));
  };
  
  const updateShippingItem = (index: number, field: keyof ShippingItemForm, value: any) => {
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

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-full mr-3">
            <Truck className="h-5 w-5 text-blue-700" />
          </div>
          <h1 className="text-2xl font-semibold">Отгрузки</h1>
        </div>
        <Button onClick={initCreateForm} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" /> Создать отгрузку
        </Button>
      </div>
      
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          placeholder="Поиск по клиентам..." 
          className="pl-10" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
                      <h3 className="font-semibold text-lg">{shipping.customer}</h3>
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Создать отгрузку</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="customer">Клиент</Label>
              <Input 
                id="customer" 
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                placeholder="Введите название клиента"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="date">Дата отгрузки</Label>
              <Input 
                id="date" 
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            
            <div className="space-y-3 mt-2">
              <div className="flex justify-between items-center">
                <Label>Товары</Label>
                <Button type="button" variant="outline" size="sm" onClick={addShippingItem}>
                  <Plus className="h-3 w-3 mr-1" /> Добавить товар
                </Button>
              </div>
              
              {formData.items.length > 0 ? (
                <div className="space-y-3 mt-3">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex flex-col gap-3 bg-gray-50 p-3 rounded-md">
                      <div className="flex justify-between">
                        <Label className="text-sm">Продукт</Label>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeShippingItem(index)}
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                      
                      <Select 
                        value={item.productionBatchId}
                        onValueChange={(value) => updateShippingItem(index, 'productionBatchId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите продукт" />
                        </SelectTrigger>
                        <SelectContent>
                          {productions.map((production) => (
                            <SelectItem key={production.id} value={production.id}>
                              {getProductName(production.id)} - {formatDate(production.date)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-1">
                          <Label htmlFor={`quantity-${index}`} className="text-xs">Количество</Label>
                          <div className="flex items-center gap-2">
                            <Input 
                              id={`quantity-${index}`}
                              type="number"
                              min="0.1"
                              step="0.1"
                              value={item.quantity}
                              onChange={(e) => updateShippingItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                            />
                            <span className="text-sm text-gray-500 min-w-[30px]">
                              {getProductUnit(item.productionBatchId)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid gap-1">
                          <Label htmlFor={`price-${index}`} className="text-xs">Цена за ед.</Label>
                          <div className="flex items-center gap-2">
                            <Input 
                              id={`price-${index}`}
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={item.price}
                              onChange={(e) => updateShippingItem(index, 'price', parseFloat(e.target.value) || 0)}
                            />
                            <span className="text-sm text-gray-500 min-w-[15px]">₽</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-2 rounded-md text-sm text-right">
                        Сумма: <span className="font-medium">{(item.quantity * item.price).toFixed(2)} ₽</span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-between p-3 bg-blue-100 rounded-md">
                    <span className="font-medium">Итого:</span>
                    <span className="font-bold">
                      {formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)} ₽
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 py-2">Нет добавленных товаров</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Отмена
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateShipping}>
              Создать отгрузку
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Удалить отгрузку</DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <p className="text-gray-700">
              Вы уверены, что хотите удалить отгрузку для клиента "{selectedShipping?.customer}"? 
              Это действие нельзя отменить.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={() => {
              // Implement delete shipping when needed
              setIsDeleteConfirmOpen(false);
            }}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Shipping;
