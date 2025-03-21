
import React, { useState } from 'react';
import { 
  Truck,
  Users
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ShipmentsList from '@/features/shipping/ShipmentsList';
import BuyersList from '@/features/shipping/BuyersList';

const Shipping = () => {
  const [activeTab, setActiveTab] = useState<'shipments' | 'buyers'>('shipments');
  
  return (
    <div className="container py-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Отгрузки и клиенты</h1>
      
      <Tabs defaultValue="shipments" value={activeTab} onValueChange={(val) => setActiveTab(val as 'shipments' | 'buyers')}>
        <TabsList className="mb-6">
          <TabsTrigger value="shipments">
            <Truck className="mr-2 h-4 w-4" />
            Отгрузки
          </TabsTrigger>
          <TabsTrigger value="buyers">
            <Users className="mr-2 h-4 w-4" />
            Клиенты
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="shipments">
          <ShipmentsList />
        </TabsContent>
        
        <TabsContent value="buyers">
          <BuyersList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Shipping;
