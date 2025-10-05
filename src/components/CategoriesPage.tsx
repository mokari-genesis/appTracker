import React, { useState } from 'react'
import { DataTable, Column } from './DataTable'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useCategories'
import { Category } from '@/api/types'

const CategoriesPage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState<Partial<Category>>({})

  const { data } = useCategories()
  const createCategoryMutation = useCreateCategory()
  const updateCategoryMutation = useUpdateCategory()
  const deleteCategoryMutation = useDeleteCategory()

  const columns: Column<Category>[] = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    {
      key: 'createdAt',
      label: 'Created',
      render: value => format(new Date(value), 'MMM dd, yyyy'),
    },
  ]

  const handleAdd = () => {
    setEditingCategory(null)
    setFormData({})
    setIsDialogOpen(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData(category)
    setIsDialogOpen(true)
  }

  const handleDelete = async (category: Category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        await deleteCategoryMutation.mutateAsync(category.id)
        toast({
          title: 'Category deleted',
          description: `${category.name} has been successfully deleted.`,
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete category.',
          variant: 'destructive',
        })
      }
    }
  }

  const handleSave = async () => {
    if (!formData.name) {
      toast({
        title: 'Validation Error',
        description: 'Category name is required.',
        variant: 'destructive',
      })
      return
    }

    const category = {
      name: formData.name || '',
      description: formData.description || '',
    }

    try {
      if (editingCategory) {
        await updateCategoryMutation.mutateAsync({ id: editingCategory.id, ...category })
      } else {
        await createCategoryMutation.mutateAsync(category)
      }

      toast({
        title: `Category ${editingCategory ? 'updated' : 'added'}`,
        description: `${category.name} has been successfully ${editingCategory ? 'updated' : 'added'}.`,
      })

      setIsDialogOpen(false)
      setFormData({})
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${editingCategory ? 'update' : 'create'} category.`,
        variant: 'destructive',
      })
    }
  }

  return (
    <>
      <DataTable
        title='Categories'
        data={data?.categories || []}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder='Search categories...'
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='sm:max-w-[400px]'>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Category Name *</Label>
              <Input
                id='name'
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder='Enter category name'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder='Enter category description'
                rows={3}
              />
            </div>
          </div>

          <div className='flex justify-end space-x-2'>
            <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
              onClick={handleSave}
            >
              {editingCategory ? 'Update' : 'Add'} Category
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CategoriesPage
