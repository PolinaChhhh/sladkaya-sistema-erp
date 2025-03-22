
import React, { useState } from 'react';
import { 
  Truck,
  Users,
  FileText
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ShipmentsList from '@/features/shipping/ShipmentsList';
import BuyersList from '@/features/shipping/BuyersList';

const Shipping = () => {
  const [activeTab, setActiveTab] = useState<'shipments' | 'buyers' | 'documents'>('shipments');
  
  return (
    <div className="container py-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Отгрузки и клиенты</h1>
      
      <Tabs defaultValue="shipments" value={activeTab} onValueChange={(val) => setActiveTab(val as 'shipments' | 'buyers' | 'documents')}>
        <TabsList className="mb-6">
          <TabsTrigger value="shipments">
            <Truck className="mr-2 h-4 w-4" />
            Отгрузки
          </TabsTrigger>
          <TabsTrigger value="buyers">
            <Users className="mr-2 h-4 w-4" />
            Клиенты
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="mr-2 h-4 w-4" />
            Документы
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="shipments">
          <ShipmentsList />
        </TabsContent>
        
        <TabsContent value="buyers">
          <BuyersList />
        </TabsContent>
        
        <TabsContent value="documents">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Официальные документы</h2>
            
            <p className="text-gray-600 mb-6">
              Система позволяет создавать следующие официальные документы для отгрузок:
            </p>
            
            <div className="grid gap-4">
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">ТОРГ-12 (Товарная накладная)</h3>
                <p className="text-sm text-gray-500">
                  Официальная товарная накладная для оформления продажи товаров.
                </p>
              </div>
              
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">УПД (Универсальный передаточный документ)</h3>
                <p className="text-sm text-gray-500">
                  Объединенный документ, заменяющий счет-фактуру и накладную.
                </p>
              </div>
              
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">ТТН (Товарно-транспортная накладная)</h3>
                <p className="text-sm text-gray-500">
                  Документ для оформления перевозки товаров через транспортную компанию.
                </p>
              </div>
              
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">ТН (Товарная накладная)</h3>
                <p className="text-sm text-gray-500">
                  Упрощенная форма товарной накладной.
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-md text-blue-800 text-sm">
              <p>
                <strong>Примечание:</strong> Для создания документа перейдите на вкладку "Отгрузки", 
                выберите отгрузку и нажмите кнопку "Создать документ".
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Shipping;
