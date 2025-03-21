
import React, { useState } from 'react'; 
import { useStore, ShippingDocument } from '@/store/recipeStore';
import { 
  Truck, 
  Plus, 
  Search, 
  Calendar, 
  ClipboardCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import GlassMorphicCard from '@/components/ui/GlassMorphicCard';
import { toast } from 'sonner';
import { format } from 'date-fns';

const ShipmentsList = () => {
  const { productions, shippings, recipes, addShipping, updateShippingStatus, buyers } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<ShippingDocument | null>(null);
  
  const [formData, setFormData] = useState<{
    customer: string;
    date: string;
    items: {
      productionBatchId: string;
      quantity: number;
      price: number;
    }[];
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
        <Button onClick={initCreateForm} className="bg-blue-600 hover:bg-blue-700">
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
      
      {/* Create Shipping Dialog forms and other dialogs would go here */}
      
    </div>
  );
};

export default ShipmentsList;
