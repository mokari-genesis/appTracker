import React, { useState } from 'react'
import { DataTable, Column } from './DataTable'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from '@/hooks/useClients'
import { Client } from '@/api/types'

const ClientsPage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState<Partial<Client>>({})

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0)
  const pageLimit = 100

  const { data } = useClients({ page: currentPage, limit: pageLimit })
  const createClientMutation = useCreateClient()
  const updateClientMutation = useUpdateClient()
  const deleteClientMutation = useDeleteClient()

  const clients = data?.clients || []
  const hasNextPage = data?.hasNextPage || false

  const columns: Column<Client>[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'company', label: 'Company' },
    {
      key: 'createdAt',
      label: 'Created',
      render: value => format(new Date(value), 'MMM dd, yyyy'),
    },
  ]

  const handleAdd = () => {
    setEditingClient(null)
    setFormData({})
    setIsDialogOpen(true)
  }

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setFormData(client)
    setIsDialogOpen(true)
  }

  const handleDelete = async (client: Client) => {
    if (window.confirm(`Are you sure you want to delete ${client.name}?`)) {
      try {
        await deleteClientMutation.mutateAsync(client.id)
        toast({
          title: 'Client deleted',
          description: `${client.name} has been successfully deleted.`,
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete client.',
          variant: 'destructive',
        })
      }
    }
  }

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      toast({
        title: 'Validation Error',
        description: 'Name and email are required fields.',
        variant: 'destructive',
      })
      return
    }

    const client = {
      name: formData.name || '',
      email: formData.email || '',
      phone: formData.phone || '',
      company: formData.company || '',
      address: formData.address || '',
    }

    try {
      if (editingClient) {
        await updateClientMutation.mutateAsync({ id: editingClient.id, ...client })
      } else {
        await createClientMutation.mutateAsync(client)
      }

      toast({
        title: `Client ${editingClient ? 'updated' : 'added'}`,
        description: `${client.name} has been successfully ${editingClient ? 'updated' : 'added'}.`,
      })

      setIsDialogOpen(false)
      setFormData({})
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${editingClient ? 'update' : 'create'} client.`,
        variant: 'destructive',
      })
    }
  }

  return (
    <>
      <div className='space-y-4'>
        <DataTable
          title='Clients'
          data={clients}
          columns={columns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder='Search clients...'
        />

        {/* Pagination Controls */}
        <div className='flex items-center justify-between px-2'>
          <div className='text-sm text-muted-foreground'>
            Page {currentPage + 1} • Showing {clients.length} clients
          </div>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className='h-4 w-4 mr-1' />
              Previous
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!hasNextPage}
            >
              Next
              <ChevronRight className='h-4 w-4 ml-1' />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>{editingClient ? 'Edit Client' : 'Add New Client'}</DialogTitle>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Name *</Label>
                <Input
                  id='name'
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder='Enter client name'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email *</Label>
                <Input
                  id='email'
                  type='email'
                  value={formData.email || ''}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder='Enter email address'
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='phone'>Phone</Label>
                <Input
                  id='phone'
                  value={formData.phone || ''}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder='Enter phone number'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='company'>Company</Label>
                <Input
                  id='company'
                  value={formData.company || ''}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  placeholder='Enter company name'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='address'>Address</Label>
              <Textarea
                id='address'
                value={formData.address || ''}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                placeholder='Enter full address'
                rows={3}
              />
            </div>
          </div>

          <div className='flex justify-end space-x-2'>
            <Button
              variant='outline'
              onClick={() => setIsDialogOpen(false)}
              className='border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors'
            >
              Cancel
            </Button>
            <Button
              className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200'
              disabled={createClientMutation.isPending || updateClientMutation.isPending}
              onClick={handleSave}
            >
              {editingClient ? 'Update' : 'Add'} Client
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ClientsPage
