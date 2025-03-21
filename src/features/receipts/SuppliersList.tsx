
import React, { useState } from 'react';
import { useStore, Supplier } from '@/store/recipeStore';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { PlusCircle, Trash2, Edit } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import SupplierForm from './SupplierForm';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import EmptyState from './EmptyState';

const SuppliersList = () => {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<{
    name: string;
    contactPerson: string;
    phone: string;
    email: string;
    address: string;
  }>({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
  });
  
  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (supplier.contactPerson && supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const initCreateForm = () => {
    setFormData({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
    });
    setIsCreateDialogOpen(true);
  };
  
  const initEditForm = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setFormData({
      name: supplier.name,
      contactPerson: supplier.contactPerson || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
    });
    setIsEditDialogOpen(true);
  };
  
  const handleCreateSupplier = () => {
    addSupplier({
      name: formData.name,
      contactPerson: formData.contactPerson || undefined,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      address: formData.address || undefined,
    });
    setIsCreateDialogOpen(false);
  };
  
  const handleUpdateSupplier = () => {
    if (!selectedSupplier) return;
    
    updateSupplier(selectedSupplier.id, {
      name: formData.name,
      contactPerson: formData.contactPerson || undefined,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      address: formData.address || undefined,
    });
    setIsEditDialogOpen(false);
  };
  
  const initDeleteSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteSupplier = () => {
    if (!selectedSupplier) return;
    deleteSupplier(selectedSupplier.id);
    setIsDeleteDialogOpen(false);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Поиск поставщиков..."
            className="w-full px-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={initCreateForm} className="bg-cream-600 hover:bg-cream-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          Добавить поставщика
        </Button>
      </div>
      
      {filteredSuppliers.length > 0 ? (
        <div className="glass rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Контактное лицо</TableHead>
                <TableHead>Телефон</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.contactPerson || "-"}</TableCell>
                  <TableCell>{supplier.phone || "-"}</TableCell>
                  <TableCell>{supplier.email || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => initEditForm(supplier)}>
                        <Edit className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => initDeleteSupplier(supplier)}>
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
          title="Нет поставщиков"
          description="Добавьте поставщиков, чтобы отслеживать поступления ингредиентов"
          buttonText="Добавить поставщика"
          onAction={initCreateForm}
        />
      )}
      
      {/* Create Supplier Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <SupplierForm 
          title="Добавить поставщика"
          formData={formData}
          setFormData={setFormData}
          onCancel={() => setIsCreateDialogOpen(false)}
          onSubmit={handleCreateSupplier}
          submitLabel="Добавить"
        />
      </Dialog>
      
      {/* Edit Supplier Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <SupplierForm 
          title="Редактировать поставщика"
          formData={formData}
          setFormData={setFormData}
          onCancel={() => setIsEditDialogOpen(false)}
          onSubmit={handleUpdateSupplier}
          submitLabel="Сохранить"
        />
      </Dialog>
      
      {/* Delete Supplier Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DeleteConfirmDialog
          title="Удалить поставщика"
          description={`Вы уверены, что хотите удалить поставщика "${selectedSupplier?.name}"?`}
          onCancel={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteSupplier}
        />
      </Dialog>
    </div>
  );
};

export default SuppliersList;
