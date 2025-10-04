import React, { useState } from 'react';
import { DataTable, Column } from './DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Category, mockCategories } from '@/data/mockData';
import { format } from 'date-fns';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({});

  const columns: Column<Category>[] = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value) => format(new Date(value), 'MMM dd, yyyy'),
    },
  ];

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData(category);
    setIsDialogOpen(true);
  };

  const handleDelete = (category: Category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      setCategories(categories.filter((c) => c.id !== category.id));
      toast({
        title: 'Category deleted',
        description: `${category.name} has been successfully deleted.`,
      });
    }
  };

  const handleSave = () => {
    if (!formData.name) {
      toast({
        title: 'Validation Error',
        description: 'Category name is required.',
        variant: 'destructive',
      });
      return;
    }

    if (editingCategory) {
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id ? { ...editingCategory, ...formData } : c
        )
      );
      toast({
        title: 'Category updated',
        description: `${formData.name} has been successfully updated.`,
      });
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: formData.name || '',
        description: formData.description || '',
        createdAt: new Date().toISOString(),
      };
      setCategories([...categories, newCategory]);
      toast({
        title: 'Category added',
        description: `${newCategory.name} has been successfully added.`,
      });
    }

    setIsDialogOpen(false);
    setFormData({});
  };

  return (
    <>
      <DataTable
        title="Categories"
        data={categories}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search categories..."
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter category name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter category description"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingCategory ? 'Update' : 'Add'} Category
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoriesPage;