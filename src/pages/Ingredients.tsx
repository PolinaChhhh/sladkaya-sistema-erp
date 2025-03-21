
import React, { useState } from 'react';
import { 
  Box, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Info, 
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useStore, Ingredient } from '@/store/recipeStore';
import { toast } from 'sonner';
import { format } from 'date-fns';

const Ingredients = () => {
  const { ingredients, addIngredient, updateIngredient, deleteIngredient } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'ingredient' | 'semifinal'>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  
  const [formData, setFormData] = useState<{
    name: string;
    unit: string;
    cost: number;
    quantity: number;
    isSemiFinal: boolean;
  }>({
    name: '',
    unit: 'кг',
    cost: 0,
    quantity: 0,
    isSemiFinal: false,
  });
  
  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'all') {
      return matchesSearch;
    } else if (filterType === 'ingredient') {
      return matchesSearch && !ingredient.isSemiFinal;
    } else {
      return matchesSearch && ingredient.isSemiFinal;
    }
  });
  
  const initCreateForm = () => {
    setFormData({
      name: '',
      unit: 'кг',
      cost: 0,
      quantity: 0,
      isSemiFinal: false,
    });
    setIsCreateDialogOpen(true);
  };
  
  const initEditForm = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setFormData({
      name: ingredient.name,
      unit: ingredient.unit,
      cost: ingredient.cost,
      quantity: ingredient.quantity,
      isSemiFinal: ingredient.isSemiFinal,
    });
    setIsEditDialogOpen(true);
  };
  
  const initDeleteConfirm = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setIsDeleteConfirmOpen(true);
  };
  
  const handleCreateIngredient = () => {
    if (formData.name.trim() === '') {
      toast.error('Введите название ингредиента');
      return;
    }
    
    addIngredient({
      name: formData.name,
      unit: formData.unit,
      cost: formData.cost,
      quantity: formData.quantity,
      lastPurchaseDate: new Date().toISOString(),
      isSemiFinal: formData.isSemiFinal,
    });
    
    toast.success('Ингредиент успешно создан');
    setIsCreateDialogOpen(false);
  };
  
  const handleUpdateIngredient = () => {
    if (!selectedIngredient) return;
    
    if (formData.name.trim() === '') {
      toast.error('Введите название ингредиента');
      return;
    }
    
    updateIngredient(selectedIngredient.id, {
      name: formData.name,
      unit: formData.unit,
      cost: formData.cost,
      quantity: formData.quantity,
      isSemiFinal: formData.isSemiFinal,
    });
    
    toast.success('Ингредиент успешно обновлен');
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteIngredient = () => {
    if (!selectedIngredient) return;
    
    deleteIngredient(selectedIngredient.id);
    toast.success('Ингредиент успешно удален');
    setIsDeleteConfirmOpen(false);
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch (e) {
      return 'Не указано';
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="p-2 bg-cream-100 rounded-full mr-3">
            <Box className="h-5 w-5 text-cream-700" />
          </div>
          <h1 className="text-2xl font-semibold">Ингредиенты</h1>
        </div>
        <Button onClick={initCreateForm} className="bg-cream-600 hover:bg-cream-700">
          <Plus className="h-4 w-4 mr-2" /> Добавить ингредиент
        </Button>
      </div>
      
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Поиск ингредиентов..." 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Тип ингредиента" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы</SelectItem>
            <SelectItem value="ingredient">Ингредиенты</SelectItem>
            <SelectItem value="semifinal">Полуфабрикаты</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {filteredIngredients.length > 0 ? (
        <div className="glass rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Стоимость</TableHead>
                <TableHead>Количество</TableHead>
                <TableHead>Последняя закупка</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIngredients.map((ingredient) => (
                <TableRow key={ingredient.id}>
                  <TableCell className="font-medium">{ingredient.name}</TableCell>
                  <TableCell>
                    {ingredient.isSemiFinal ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-mint-100 text-mint-800">
                        Полуфабрикат
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-cream-100 text-cream-800">
                        Ингредиент
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{ingredient.cost.toFixed(2)} ₽/{ingredient.unit}</TableCell>
                  <TableCell>{ingredient.quantity} {ingredient.unit}</TableCell>
                  <TableCell>{formatDate(ingredient.lastPurchaseDate)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => initEditForm(ingredient)}>
                        <Edit className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => initDeleteConfirm(ingredient)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12">
          <Box className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-1">Нет ингредиентов</h3>
          <p className="text-gray-500">Добавьте свой первый ингредиент, нажав кнопку выше</p>
        </div>
      )}
      
      {/* Create Ingredient Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Добавить ингредиент</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Название</Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Введите название ингредиента"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="type-switch"
                checked={formData.isSemiFinal}
                onCheckedChange={(checked) => setFormData({ ...formData, isSemiFinal: checked })}
              />
              <Label htmlFor="type-switch">Полуфабрикат</Label>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cost">Стоимость (₽)</Label>
                <Input 
                  id="cost" 
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit">Единица измерения</Label>
                <Select 
                  value={formData.unit}
                  onValueChange={(value) => setFormData({ ...formData, unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите единицу" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="кг">кг</SelectItem>
                    <SelectItem value="л">л</SelectItem>
                    <SelectItem value="шт">шт</SelectItem>
                    <SelectItem value="г">г</SelectItem>
                    <SelectItem value="мл">мл</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="quantity">Начальный остаток</Label>
              <Input 
                id="quantity" 
                type="number"
                min="0"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Отмена
            </Button>
            <Button className="bg-cream-600 hover:bg-cream-700" onClick={handleCreateIngredient}>
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Ingredient Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Редактировать ингредиент</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Название</Label>
              <Input 
                id="edit-name" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="edit-type-switch"
                checked={formData.isSemiFinal}
                onCheckedChange={(checked) => setFormData({ ...formData, isSemiFinal: checked })}
              />
              <Label htmlFor="edit-type-switch">Полуфабрикат</Label>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-cost">Стоимость (₽)</Label>
                <Input 
                  id="edit-cost" 
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-unit">Единица измерения</Label>
                <Select 
                  value={formData.unit}
                  onValueChange={(value) => setFormData({ ...formData, unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите единицу" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="кг">кг</SelectItem>
                    <SelectItem value="л">л</SelectItem>
                    <SelectItem value="шт">шт</SelectItem>
                    <SelectItem value="г">г</SelectItem>
                    <SelectItem value="мл">мл</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-quantity">Текущий остаток</Label>
              <Input 
                id="edit-quantity" 
                type="number"
                min="0"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button className="bg-cream-600 hover:bg-cream-700" onClick={handleUpdateIngredient}>
              Сохранить изменения
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Удалить ингредиент</DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <p className="text-gray-700">
              Вы уверены, что хотите удалить ингредиент "{selectedIngredient?.name}"? Это действие нельзя отменить.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDeleteIngredient}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Ingredients;
