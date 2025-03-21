
import React, { useState } from 'react';
import { useStore, Receipt } from '@/store/recipeStore';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { PlusCircle, Trash2, Edit, FileText } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { format } from 'date-fns';
import ReceiptForm from './ReceiptForm';
import ReceiptDetails from './ReceiptDetails';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import EmptyState from './EmptyState';

const ReceiptsList = () => {
  const { receipts, suppliers, addReceipt, updateReceipt, deleteReceipt } = useStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const getSupplierName = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : 'Неизвестный поставщик';
  };
  
  const filteredReceipts = receipts.filter(receipt => {
    const supplierName = getSupplierName(receipt.supplierId);
    return supplierName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           (receipt.referenceNumber && receipt.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()));
  });
  
  const sortedReceipts = [...filteredReceipts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch (e) {
      return 'Неизвестная дата';
    }
  };
  
  const initCreateForm = () => {
    setIsCreateDialogOpen(true);
  };
  
  const initEditForm = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setIsEditDialogOpen(true);
  };
  
  const initViewDetails = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setIsViewDialogOpen(true);
  };
  
  const initDeleteReceipt = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteReceipt = () => {
    if (!selectedReceipt) return;
    deleteReceipt(selectedReceipt.id);
    setIsDeleteDialogOpen(false);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Поиск поступлений..."
            className="w-full px-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={initCreateForm} className="bg-cream-600 hover:bg-cream-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          Добавить поступление
        </Button>
      </div>
      
      {sortedReceipts.length > 0 ? (
        <div className="glass rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Поставщик</TableHead>
                <TableHead>Номер накладной</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedReceipts.map((receipt) => (
                <TableRow key={receipt.id}>
                  <TableCell>{formatDate(receipt.date)}</TableCell>
                  <TableCell className="font-medium">{getSupplierName(receipt.supplierId)}</TableCell>
                  <TableCell>{receipt.referenceNumber || "-"}</TableCell>
                  <TableCell>{receipt.totalAmount.toFixed(2)} ₽</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => initViewDetails(receipt)}>
                        <FileText className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => initEditForm(receipt)}>
                        <Edit className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => initDeleteReceipt(receipt)}>
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
        <EmptyState
          title="Нет поступлений"
          description="Добавьте поступления, чтобы отслеживать закупки ингредиентов"
          buttonText="Добавить поступление"
          onAction={initCreateForm}
        />
      )}
      
      {/* Create Receipt Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <ReceiptForm 
          isCreateMode={true}
          receipt={null}
          onCancel={() => setIsCreateDialogOpen(false)}
        />
      </Dialog>
      
      {/* Edit Receipt Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        {selectedReceipt && (
          <ReceiptForm 
            isCreateMode={false}
            receipt={selectedReceipt}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        )}
      </Dialog>
      
      {/* View Receipt Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        {selectedReceipt && (
          <ReceiptDetails 
            receipt={selectedReceipt}
            onClose={() => setIsViewDialogOpen(false)}
          />
        )}
      </Dialog>
      
      {/* Delete Receipt Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DeleteConfirmDialog
          title="Удалить поступление"
          description={`Вы уверены, что хотите удалить поступление от "${selectedReceipt ? formatDate(selectedReceipt.date) : ''}"?`}
          onCancel={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteReceipt}
        />
      </Dialog>
    </div>
  );
};

export default ReceiptsList;
