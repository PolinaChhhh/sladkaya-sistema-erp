
import React, { useState } from 'react';
import { 
  TrendingUp, 
  Plus, 
  Calendar, 
  DollarSign, 
  ChefHat,
  Search,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import GlassMorphicCard from '@/components/ui/GlassMorphicCard';
import { useStore, Recipe, Ingredient } from '@/store/recipeStore';
import { toast } from 'sonner';
import { format } from 'date-fns';

const Production = () => {
  const { recipes, ingredients, productions, addProduction, updateRecipe } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState<{
    recipeId: string;
    quantity: number;
    date: string;
  }>({
    recipeId: recipes.length > 0 ? recipes[0].id : '',
    quantity: 1,
    date: format(new Date(), 'yyyy-MM-dd'),
  });
  
  const filteredProductions = productions.filter(production => {
    const recipe = recipes.find(r => r.id === production.recipeId);
    return recipe?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Sort productions by date (newest first)
  const sortedProductions = [...filteredProductions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  const calculateCost = (recipeId: string, quantity: number): number => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return 0;
    
    const recipeItems = recipe.items;
    let totalCost = 0;
    
    recipeItems.forEach(item => {
      const ingredient = ingredients.find(i => i.id === item.ingredientId);
      if (ingredient) {
        totalCost += (ingredient.cost * item.amount);
      }
    });
    
    // Calculate cost per output unit of recipe
    const costPerUnit = totalCost / recipe.output;
    
    // Calculate total cost for the production
    return costPerUnit * quantity;
  };
  
  const handleCreateProduction = () => {
    if (!formData.recipeId) {
      toast.error('Выберите рецепт');
      return;
    }
    
    if (formData.quantity <= 0) {
      toast.error('Количество должно быть больше 0');
      return;
    }
    
    const cost = calculateCost(formData.recipeId, formData.quantity);
    
    addProduction({
      recipeId: formData.recipeId,
      quantity: formData.quantity,
      date: formData.date,
      cost,
    });
    
    // Update the lastProduced date on the recipe
    updateRecipe(formData.recipeId, {
      lastProduced: formData.date,
    });
    
    toast.success('Запись о производстве добавлена');
    setIsCreateDialogOpen(false);
  };
  
  const getRecipeName = (recipeId: string): string => {
    const recipe = recipes.find(r => r.id === recipeId);
    return recipe ? recipe.name : 'Неизвестный рецепт';
  };
  
  const getRecipeOutput = (recipeId: string): string => {
    const recipe = recipes.find(r => r.id === recipeId);
    return recipe ? recipe.outputUnit : '';
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
          <div className="p-2 bg-mint-100 rounded-full mr-3">
            <TrendingUp className="h-5 w-5 text-mint-700" />
          </div>
          <h1 className="text-2xl font-semibold">Производство</h1>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-mint-600 hover:bg-mint-700">
          <Plus className="h-4 w-4 mr-2" /> Добавить производство
        </Button>
      </div>
      
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          placeholder="Поиск по рецептам..." 
          className="pl-10" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {sortedProductions.length > 0 ? (
        <div className="grid gap-4">
          {sortedProductions.map((production) => (
            <GlassMorphicCard 
              key={production.id}
              className="bg-gradient-to-br from-mint-50 to-mint-100 border border-mint-200"
            >
              <div className="flex flex-wrap md:flex-nowrap justify-between items-start gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{getRecipeName(production.recipeId)}</h3>
                  <div className="flex items-center mt-1 text-gray-600">
                    <Calendar className="h-4 w-4 mr-1.5" />
                    <span className="text-sm">{formatDate(production.date)}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white/70 px-4 py-2 rounded-lg border border-mint-200">
                    <div className="flex items-center">
                      <ChefHat className="h-4 w-4 text-gray-500 mr-1.5" />
                      <span className="text-sm text-gray-500">Количество</span>
                    </div>
                    <p className="font-medium mt-1">
                      {production.quantity} {getRecipeOutput(production.recipeId)}
                    </p>
                  </div>
                  
                  <div className="bg-white/70 px-4 py-2 rounded-lg border border-mint-200">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-gray-500 mr-1.5" />
                      <span className="text-sm text-gray-500">Себестоимость</span>
                    </div>
                    <p className="font-medium mt-1">
                      {production.cost.toFixed(2)} ₽
                    </p>
                  </div>
                  
                  <div className="bg-white/70 px-4 py-2 rounded-lg border border-mint-200">
                    <div className="flex items-center">
                      <Info className="h-4 w-4 text-gray-500 mr-1.5" />
                      <span className="text-sm text-gray-500">Цена за единицу</span>
                    </div>
                    <p className="font-medium mt-1">
                      {(production.cost / production.quantity).toFixed(2)} ₽/{getRecipeOutput(production.recipeId)}
                    </p>
                  </div>
                </div>
              </div>
            </GlassMorphicCard>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-1">Нет данных о производстве</h3>
          <p className="text-gray-500">Добавьте первую запись о производстве, нажав кнопку выше</p>
        </div>
      )}
      
      {/* Create Production Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Добавить производство</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="recipe">Рецепт</Label>
              <Select 
                value={formData.recipeId}
                onValueChange={(value) => setFormData({ ...formData, recipeId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите рецепт" />
                </SelectTrigger>
                <SelectContent>
                  {recipes.map((recipe) => (
                    <SelectItem key={recipe.id} value={recipe.id}>
                      {recipe.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="quantity">Количество</Label>
              <Input 
                id="quantity" 
                type="number"
                min="0.1"
                step="0.1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
              />
              {formData.recipeId && (
                <p className="text-xs text-gray-500">
                  Единица измерения: {getRecipeOutput(formData.recipeId)}
                </p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="date">Дата производства</Label>
              <Input 
                id="date" 
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            
            {formData.recipeId && (
              <div className="mt-2 p-3 bg-mint-50 rounded-md border border-mint-200">
                <div className="flex items-center text-sm font-medium text-mint-800 mb-1">
                  <Info className="h-4 w-4 mr-1.5" />
                  Расчет себестоимости
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Общая себестоимость: <span className="font-medium">{calculateCost(formData.recipeId, formData.quantity).toFixed(2)} ₽</span>
                </p>
                <p className="text-sm text-gray-600">
                  Себестоимость за единицу: <span className="font-medium">
                    {(calculateCost(formData.recipeId, formData.quantity) / formData.quantity).toFixed(2)} ₽/{getRecipeOutput(formData.recipeId)}
                  </span>
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Отмена
            </Button>
            <Button className="bg-mint-600 hover:bg-mint-700" onClick={handleCreateProduction}>
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Production;
