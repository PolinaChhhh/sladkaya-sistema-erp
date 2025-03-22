
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useTemplatesList } from './hooks/useTemplatesList';
import { TemplateCard, TemplateDialog, EmptyTemplatesList } from './components';

const DocumentTemplatesList = () => {
  const {
    templates,
    isUploadDialogOpen,
    setIsUploadDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    formData,
    setFormData,
    templateFile,
    setTemplateFile,
    handleUploadClick,
    handleEditTemplate,
    handleDeleteTemplate,
    handleSaveTemplate
  } = useTemplatesList();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Шаблоны документов</h2>
        <Button onClick={handleUploadClick}>
          <Upload className="h-4 w-4 mr-2" />
          Загрузить шаблон
        </Button>
      </div>
      
      {templates.length === 0 ? (
        <EmptyTemplatesList onUploadClick={handleUploadClick} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard 
              key={template.id} 
              template={template} 
              onEdit={handleEditTemplate} 
              onDelete={handleDeleteTemplate} 
            />
          ))}
        </div>
      )}
      
      {/* Upload Template Dialog */}
      <TemplateDialog
        isOpen={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        formData={formData}
        setFormData={setFormData}
        templateFile={templateFile}
        setTemplateFile={setTemplateFile}
        onSave={handleSaveTemplate}
        isEdit={false}
      />
      
      {/* Edit Template Dialog */}
      <TemplateDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={formData}
        setFormData={setFormData}
        templateFile={templateFile}
        setTemplateFile={setTemplateFile}
        onSave={handleSaveTemplate}
        isEdit={true}
      />
    </div>
  );
};

export default DocumentTemplatesList;
