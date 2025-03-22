
import React, { useState } from 'react';
import { useStore } from '@/store/recipeStore';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ReceiptsList from '@/features/receipts/ReceiptsList';
import SuppliersList from '@/features/receipts/SuppliersList';
import { Package, Users } from 'lucide-react';

const Receipts = () => {
  const [activeTab, setActiveTab] = useState<'receipts' | 'suppliers'>('receipts');
  
  return (
    <div className="container py-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Поступления и поставщики</h1>
      
      <div className="animate-fade-in">
        <Tabs defaultValue="receipts" value={activeTab} onValueChange={(val) => setActiveTab(val as 'receipts' | 'suppliers')}>
          <TabsList className="mb-6">
            <TabsTrigger value="receipts">
              <Package className="mr-2 h-4 w-4" />
              Поступления
            </TabsTrigger>
            <TabsTrigger value="suppliers">
              <Users className="mr-2 h-4 w-4" />
              Поставщики
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="receipts">
            <ReceiptsList />
          </TabsContent>
          
          <TabsContent value="suppliers">
            <SuppliersList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Receipts;
