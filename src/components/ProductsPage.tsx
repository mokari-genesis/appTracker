import React, { useState } from 'react'
import { DataTable, Column } from './DataTable'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { Product } from '@/api/types'

const ProductsPage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<Partial<Product>>({})

  const { data } = useProducts()
  const { data: categoriesData } = useCategories()
  const createProductMutation = useCreateProduct()
  const updateProductMutation = useUpdateProduct()
  const deleteProductMutation = useDeleteProduct()

  const categories = categoriesData?.categories || []

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Unknown'
  }

  const columns: Column<Product>[] = [
    { key: 'name', label: 'Name' },
    { key: 'sku', label: 'SKU' },
    {
      key: 'categoryId',
      label: 'Category',
      render: value => getCategoryName(value),
    },
    {
      key: 'basePrice',
      label: 'Base Price',
      render: value => `$${Number(value).toFixed(2)}`,
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: value => format(new Date(value), 'MMM dd, yyyy'),
    },
  ]

  const handleAdd = () => {
    setEditingProduct(null)
    setFormData({})
    setIsDialogOpen(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData(product)
    setIsDialogOpen(true)
  }

  const handleDelete = async (product: Product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await deleteProductMutation.mutateAsync(product.id)
        toast({
          title: 'Product deleted',
          description: `${product.name} has been successfully deleted.`,
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete product.',
          variant: 'destructive',
        })
      }
    }
  }

  const handleSave = async () => {
    if (!formData.name || !formData.categoryId || !formData.sku) {
      toast({
        title: 'Validation Error',
        description: 'Name, category, and SKU are required fields.',
        variant: 'destructive',
      })
      return
    }

    const product = {
      name: formData.name || '',
      description: formData.description || '',
      categoryId: formData.categoryId || '',
      sku: formData.sku || '',
      basePrice: formData.basePrice || 0,
    }

    try {
      if (editingProduct) {
        await updateProductMutation.mutateAsync({ id: editingProduct.id, ...product })
      } else {
        await createProductMutation.mutateAsync(product)
      }

      toast({
        title: `Product ${editingProduct ? 'updated' : 'added'}`,
        description: `${product.name} has been successfully ${editingProduct ? 'updated' : 'added'}.`,
      })

      setIsDialogOpen(false)
      setFormData({})
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${editingProduct ? 'update' : 'create'} product.`,
        variant: 'destructive',
      })
    }
  }

  return (
    <>
      <DataTable
        title='Products'
        data={data?.products || []}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder='Search products...'
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Product Name *</Label>
                <Input
                  id='name'
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder='Enter product name'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='sku'>SKU *</Label>
                <Input
                  id='sku'
                  value={formData.sku || ''}
                  onChange={e => setFormData({ ...formData, sku: e.target.value })}
                  placeholder='Enter SKU'
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='category'>Category *</Label>
                <Select
                  value={formData.categoryId || ''}
                  onValueChange={value => setFormData({ ...formData, categoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='basePrice'>Base Price ($)</Label>
                <Input
                  id='basePrice'
                  type='number'
                  step='0.01'
                  value={formData.basePrice || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      basePrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder='0.00'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder='Enter product description'
                rows={3}
              />
            </div>
          </div>

          <div className='flex justify-end space-x-2'>
            <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button disabled={createProductMutation.isPending || updateProductMutation.isPending} onClick={handleSave}>
              {editingProduct ? 'Update' : 'Add'} Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ProductsPage
