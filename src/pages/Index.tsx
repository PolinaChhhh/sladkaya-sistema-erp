
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassMorphicCard from '@/components/ui/GlassMorphicCard';
import { ChefHat, Box, TrendingUp, Truck, Bot, FileText, Building2 } from 'lucide-react';
import { useStore } from '@/store/recipeStore';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import CompanyForm from '@/features/company/CompanyForm';
import { useCompanyDialog } from '@/features/company/useCompanyDialog';

const Index = () => {
  const navigate = useNavigate();
  const { ingredients, recipes, productions, shippings, receipts, company } = useStore();
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState(false);
  const { formData, setFormData, handleSave } = useCompanyDialog();
  
  const stats = [
    {
      title: 'Рецепты',
      value: recipes.length,
      icon: <ChefHat className="h-5 w-5 text-confection-500" />,
      path: '/recipes',
      bgColor: 'bg-gradient-to-br from-confection-50 to-confection-100',
    },
    {
      title: 'Ингредиенты',
      value: ingredients.length,
      icon: <Box className="h-5 w-5 text-cream-500" />,
      path: '/ingredients',
      bgColor: 'bg-gradient-to-br from-cream-50 to-cream-100',
    },
    {
      title: 'Производство',
      value: productions.length,
      icon: <TrendingUp className="h-5 w-5 text-mint-500" />,
      path: '/production',
      bgColor: 'bg-gradient-to-br from-mint-50 to-mint-100',
    },
    {
      title: 'Отгрузки',
      value: shippings.length,
      icon: <Truck className="h-5 w-5 text-blue-500" />,
      path: '/shipping',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
    },
    {
      title: 'Поступления',
      value: receipts.length,
      icon: <FileText className="h-5 w-5 text-purple-500" />,
      path: '/receipts',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-10 text-center relative">
        <div className="flex items-center justify-center gap-4 mb-2">
          <h1 className="text-4xl font-bold text-gray-900">Сладкая Система</h1>
          <Button 
            onClick={() => setIsCompanyDialogOpen(true)}
            className="bg-confection-600 hover:bg-confection-700 text-white flex items-center gap-2"
          >
            <Building2 className="h-5 w-5" />
            {company ? 'Данные компании' : 'Добавить компанию'}
          </Button>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Система управления кондитерским производством
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        {stats.map((stat, index) => (
          <GlassMorphicCard 
            key={index}
            className={`${stat.bgColor} hover:shadow-lg`}
            onClick={() => navigate(stat.path)}
          >
            <div className="flex flex-col items-center">
              <div className="mb-3 p-2 rounded-full bg-white/70 shadow-sm">
                {stat.icon}
              </div>
              <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          </GlassMorphicCard>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassMorphicCard className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 rounded-full bg-confection-100">
              <ChefHat className="h-5 w-5 text-confection-600" />
            </div>
            <h2 className="text-xl font-semibold">Последние рецепты</h2>
          </div>
          {recipes.length > 0 ? (
            <div className="space-y-3">
              {recipes.slice(0, 3).map((recipe) => (
                <div key={recipe.id} className="p-3 bg-white rounded-lg shadow-sm flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{recipe.name}</h3>
                    <p className="text-sm text-gray-500">{recipe.outputUnit}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Нет созданных рецептов</p>
          )}
        </GlassMorphicCard>

        <GlassMorphicCard className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 rounded-full bg-blue-100">
              <Bot className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold">AI Ассистент</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Задавайте вопросы по вашему бизнесу, например, "Как изменилась себестоимость продукта за последние 3 месяца?"
          </p>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <p className="text-gray-500 text-sm italic">
              AI ассистент будет доступен в следующей версии
            </p>
          </div>
        </GlassMorphicCard>
      </div>
      
      {/* Company Dialog with Form for editing */}
      {isCompanyDialogOpen && (
        <Dialog open={isCompanyDialogOpen} onOpenChange={setIsCompanyDialogOpen}>
          <CompanyForm 
            formData={formData}
            setFormData={setFormData}
            onCancel={() => setIsCompanyDialogOpen(false)}
            onSubmit={() => {
              handleSave();
              setIsCompanyDialogOpen(false);
            }}
          />
        </Dialog>
      )}
    </div>
  );
};

export default Index;
