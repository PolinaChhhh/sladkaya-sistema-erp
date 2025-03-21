
import React, { useState } from 'react';
import { 
  ChefHat, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Check, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore, Recipe, RecipeItem } from '@/store/recipeStore';
import { toast } from 'sonner';

const Recipes = () => {
  const { recipes, ingredients, addRecipe, updateRecipe, deleteRecipe } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    output: number;
    outputUnit: string;
    items: RecipeItem[];
  }>({
    name: '',
    description: '',
    output: 1,
    outputUnit: 'кг',
    items: [],
  });
  
  const filteredRecipes = recipes.filter(recipe => 
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const initCreateForm = () => {
    setFormData({
      name: '',
      description: '',
      output: 1,
      outputUnit: 'кг',
      items: [],
    });
    setIsCreateDialogOpen(true);
  };
  
  const initEditForm = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setFormData({
      name: recipe.name,
      description: recipe.description,
      output: recipe.output,
      outputUnit: recipe.outputUnit,
      items: [...recipe.items],
    });
    setIsEditDialogOpen(true);
  };
  
  const initDeleteConfirm = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsDeleteConfirmOpen(true);
  };
  
  const handleCreateRecipe = () => {
    if (formData.name.trim() === '') {
      toast.error('Введите название рецепта');
      return;
    }
    
    addRecipe({
      name: formData.name,
      description: formData.description,
      items: formData.items,
      output: formData.output,
      outputUnit: formData.outputUnit,
      lastProduced: null,
    });
    
    toast.success('Рецепт успешно создан');
    setIsCreateDialogOpen(false);
  };
  
  const handleUpdateRecipe = () => {
    if (!selectedRecipe) return;
    
    if (formData.name.trim() === '') {
      toast.error('Введите название рецепта');
      return;
    }
    
    updateRecipe(selectedRecipe.id, {
      name: formData.name,
      description: formData.description,
      items: formData.items,
      output: formData.output,
      outputUnit: formData.outputUnit,
    });
    
    toast.success('Рецепт успешно обновлен');
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteRecipe = () => {
    if (!selectedRecipe) return;
    
    deleteRecipe(selectedRecipe.id);
    toast.success('Рецепт успешно удален');
    setIsDeleteConfirmOpen(false);
  };
  
  const addRecipeItem = () => {
    if (ingredients.length === 0) {
      toast.error('Сначала добавьте ингредиенты');
      return;
    }
    
    const firstIngredient = ingredients[0];
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { ingredientId: firstIngredient.id, amount: 0 }],
    }));
  };
  
  const updateRecipeItem = (index: number, field: keyof RecipeItem, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };
  
  const removeRecipeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };
  
  const getIngredientName = (id: string) => {
    const ingredient = ingredients.find(i => i.id === id);
    return ingredient ? ingredient.name : 'Неизвестный ингредиент';
  };
  
  const getIngredientUnit = (id: string) => {
    const ingredient = ingredients.find(i => i.id === id);
    return ingredient ? ingredient.unit : '';
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="p-2 bg-confection-100 rounded-full mr-3">
            <ChefHat className="h-5 w-5 text-confection-700" />
          </div>
          <h1 className="text-2xl font-semibold">Рецепты</h1>
        </div>
        <Button onClick={initCreateForm} className="bg-confection-600 hover:bg-confection-700">
          <Plus className="h-4 w-4 mr-2" /> Создать рецепт
        </Button>
      </div>
      
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          placeholder="Поиск рецептов..." 
          className="pl-10" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filteredRecipes.length > 0 ? (
        <div className="grid gap-4">
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="glass p-5 rounded-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{recipe.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">Выход: {recipe.output} {recipe.outputUnit}</p>
                  {recipe.description && (
                    <p className="text-gray-700 mt-2 text-sm">{recipe.description}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => initEditForm(recipe)}>
                    <Edit className="h-4 w-4 text-gray-600" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => initDeleteConfirm(recipe)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
              
              {recipe.items.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Состав:</h4>
                  <div className="space-y-1">
                    {recipe.items.map((item, idx) => (
                      <div key={idx} className="text-sm flex justify-between">
                        <span>{getIngredientName(item.ingredientId)}</span>
                        <span>{item.amount} {getIngredientUnit(item.ingredientId)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ChefHat className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-1">Нет рецептов</h3>
          <p className="text-gray-500">Создайте свой первый рецепт, нажав кнопку выше</p>
        </div>
      )}
      
      {/* Create Recipe Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Создать новый рецепт</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Название</Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Введите название рецепта"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea 
                id="description" 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Описание рецепта (опционально)"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="output">Выход</Label>
                <Input 
                  id="output" 
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={formData.output}
                  onChange={(e) => setFormData({ ...formData, output: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="outputUnit">Единица измерения</Label>
                <Select 
                  value={formData.outputUnit}
                  onValueChange={(value) => setFormData({ ...formData, outputUnit: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите единицу" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="кг">кг</SelectItem>
                    <SelectItem value="л">л</SelectItem>
                    <SelectItem value="шт">шт</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-3 mt-2">
              <div className="flex justify-between items-center">
                <Label>Ингредиенты</Label>
                <Button type="button" variant="outline" size="sm" onClick={addRecipeItem}>
                  <Plus className="h-3 w-3 mr-1" /> Добавить
                </Button>
              </div>
              
              {formData.items.length > 0 ? (
                <div className="space-y-3 mt-3">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                      <Select 
                        value={item.ingredientId}
                        onValueChange={(value) => updateRecipeItem(index, 'ingredientId', value)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Выберите ингредиент" />
                        </SelectTrigger>
                        <SelectContent>
                          {ingredients.map((ingredient) => (
                            <SelectItem key={ingredient.id} value={ingredient.id}>
                              {ingredient.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="number"
                          min="0.01"
                          step="0.01"
                          className="w-24"
                          value={item.amount}
                          onChange={(e) => updateRecipeItem(index, 'amount', parseFloat(e.target.value) || 0)}
                        />
                        <span className="text-sm text-gray-500">
                          {getIngredientUnit(item.ingredientId)}
                        </span>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeRecipeItem(index)}
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 py-2">Нет добавленных ингредиентов</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Отмена
            </Button>
            <Button className="bg-confection-600 hover:bg-confection-700" onClick={handleCreateRecipe}>
              Создать рецепт
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Recipe Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Редактировать рецепт</DialogTitle>
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
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Описание</Label>
              <Textarea 
                id="edit-description" 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-output">Выход</Label>
                <Input 
                  id="edit-output" 
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={formData.output}
                  onChange={(e) => setFormData({ ...formData, output: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-outputUnit">Единица измерения</Label>
                <Select 
                  value={formData.outputUnit}
                  onValueChange={(value) => setFormData({ ...formData, outputUnit: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите единицу" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="кг">кг</SelectItem>
                    <SelectItem value="л">л</SelectItem>
                    <SelectItem value="шт">шт</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-3 mt-2">
              <div className="flex justify-between items-center">
                <Label>Ингредиенты</Label>
                <Button type="button" variant="outline" size="sm" onClick={addRecipeItem}>
                  <Plus className="h-3 w-3 mr-1" /> Добавить
                </Button>
              </div>
              
              {formData.items.length > 0 ? (
                <div className="space-y-3 mt-3">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                      <Select 
                        value={item.ingredientId}
                        onValueChange={(value) => updateRecipeItem(index, 'ingredientId', value)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Выберите ингредиент" />
                        </SelectTrigger>
                        <SelectContent>
                          {ingredients.map((ingredient) => (
                            <SelectItem key={ingredient.id} value={ingredient.id}>
                              {ingredient.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="number"
                          min="0.01"
                          step="0.01"
                          className="w-24"
                          value={item.amount}
                          onChange={(e) => updateRecipeItem(index, 'amount', parseFloat(e.target.value) || 0)}
                        />
                        <span className="text-sm text-gray-500">
                          {getIngredientUnit(item.ingredientId)}
                        </span>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeRecipeItem(index)}
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 py-2">Нет добавленных ингредиентов</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button className="bg-confection-600 hover:bg-confection-700" onClick={handleUpdateRecipe}>
              Сохранить изменения
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Удалить рецепт</DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <p className="text-gray-700">
              Вы уверены, что хотите удалить рецепт "{selectedRecipe?.name}"? Это действие нельзя отменить.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDeleteRecipe}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Recipes;
