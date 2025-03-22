
import React, { useEffect } from 'react';
import { useStore } from '@/store/recipeStore';
import { Company } from '@/store/types/company';

interface CompanyDataProviderProps {
  children: React.ReactNode;
}

/**
 * Компонент для предоставления данных компании при генерации документов
 * Если данные компании отсутствуют, использует значения по умолчанию
 */
const CompanyDataProvider: React.FC<CompanyDataProviderProps> = ({ children }) => {
  const { company, updateCompany } = useStore();

  // При первой загрузке, если нет данных компании, заполняем значения по умолчанию
  useEffect(() => {
    if (!company) {
      const defaultCompany: Omit<Company, 'id'> = {
        name: "Ваша компания",
        tin: "1234567890",
        legalAddress: "г. Москва, ул. Примерная, д. 1",
        physicalAddress: "г. Москва, ул. Примерная, д. 1",
        contactPerson: "Иванов И.И.",
        phone: "+7 (495) 123-45-67",
        email: "info@yourcompany.ru",
        bankDetails: "Р/с 40702810000000000000, АО 'Банк', БИК 044525000, К/с 30101810000000000000"
      };
      
      updateCompany(defaultCompany);
    }
  }, [company, updateCompany]);

  return <>{children}</>;
};

export default CompanyDataProvider;
