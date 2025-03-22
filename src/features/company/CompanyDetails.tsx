
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Company } from '@/store/types';
import { useStore } from '@/store/recipeStore';

interface CompanyDetailsProps {
  onClose: () => void;
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({ onClose }) => {
  const { company } = useStore();

  if (!company) {
    return (
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Данные компании</DialogTitle>
        </DialogHeader>
        <div className="py-6 text-center text-gray-500">
          Данные о компании не найдены. Пожалуйста, добавьте информацию о компании на главной странице.
        </div>
        <DialogFooter>
          <Button onClick={onClose}>
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Данные компании</DialogTitle>
      </DialogHeader>
      <div className="py-4 max-h-[70vh] overflow-y-auto">
        <Card className="border-0 shadow-none">
          <CardContent className="p-0 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
              {company.tin && <p className="text-sm text-gray-500">ИНН: {company.tin}</p>}
            </div>

            {(company.contactPerson || company.phone || company.email) && (
              <div className="space-y-1 mt-4">
                <h4 className="text-sm font-medium text-gray-700">Контактная информация</h4>
                {company.contactPerson && <p className="text-sm">{company.contactPerson}</p>}
                {company.phone && <p className="text-sm">Телефон: {company.phone}</p>}
                {company.email && <p className="text-sm">Email: {company.email}</p>}
              </div>
            )}

            {company.legalAddress && (
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-700">Юридический адрес</h4>
                <p className="text-sm">{company.legalAddress}</p>
              </div>
            )}

            {company.physicalAddress && (
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-700">Фактический адрес</h4>
                <p className="text-sm">{company.physicalAddress}</p>
              </div>
            )}

            {company.address && (
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-700">Адрес для корреспонденции</h4>
                <p className="text-sm">{company.address}</p>
              </div>
            )}

            {company.bankDetails && (
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-700">Банковские реквизиты</h4>
                <p className="text-sm whitespace-pre-line">{company.bankDetails}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <DialogFooter>
        <Button onClick={onClose}>
          Закрыть
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default CompanyDetails;
