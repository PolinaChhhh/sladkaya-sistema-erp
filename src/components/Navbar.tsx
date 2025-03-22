
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BarChart3, Building2 } from 'lucide-react';
import { useStore } from '@/store/recipeStore';
import { Dialog } from '@/components/ui/dialog';
import CompanyDialog from '@/features/company/CompanyDialog';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState(false);
  const location = useLocation();
  const { company } = useStore();

  const navigation = [
    { name: 'Главная', path: '/' },
    { name: 'Рецепты', path: '/recipes' },
    { name: 'Ингредиенты', path: '/ingredients' },
    { name: 'Производство', path: '/production' },
    { name: 'Отгрузки', path: '/shipping' },
    { name: 'Поступления', path: '/receipts' },
    { name: 'Отчёты', path: '/reports', icon: <BarChart3 className="h-4 w-4 mr-1.5" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-gray-200">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <span className="text-confection-600 font-bold text-2xl">Сладкая Система</span>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center ${
                  isActive(item.path)
                    ? 'bg-confection-100 text-confection-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            
            {/* Company button */}
            <button
              onClick={() => setIsCompanyDialogOpen(true)}
              className="px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center text-gray-700 hover:bg-gray-100"
            >
              <Building2 className="h-4 w-4 mr-1.5" />
              {company ? 'Наша компания' : 'Добавить компанию'}
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden animate-slide-in">
            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                    isActive(item.path)
                      ? 'bg-confection-100 text-confection-800'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
              
              {/* Company button for mobile */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsCompanyDialogOpen(true);
                }}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium flex items-center text-gray-700 hover:bg-gray-100"
              >
                <Building2 className="h-4 w-4 mr-1.5" />
                {company ? 'Наша компания' : 'Добавить компанию'}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Company Dialog */}
      <CompanyDialog 
        isOpen={isCompanyDialogOpen} 
        setIsOpen={setIsCompanyDialogOpen} 
      />
    </nav>
  );
};

export default Navbar;
