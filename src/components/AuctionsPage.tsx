import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DataTable, Column, CustomAction } from './DataTable'
import { toast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { Calendar, DollarSign, Users } from 'lucide-react'
import {
  useAuctionHeaders,
  useNextAuctionHeaderId,
  useCreateAuctionHeader,
  useUpdateAuctionHeader,
  useDeleteAuctionHeader,
  useAuctionDetails,
} from '@/hooks/useAuctions'
import { AuctionHeader } from '@/api/types'

interface AuctionsPageProps {
  viewAuctionId?: string | null
  onNavigate?: (page: string, auctionId?: string) => void
}

const AuctionsPage: React.FC<AuctionsPageProps> = ({ onNavigate }) => {
  // Dialog states
  const [isHeaderDialogOpen, setIsHeaderDialogOpen] = useState(false)
  const [editingHeader, setEditingHeader] = useState<AuctionHeader | null>(null)
  const [headerFormData, setHeaderFormData] = useState<Partial<AuctionHeader>>({})

  // Fetch data
  const { data: headersData } = useAuctionHeaders()
  const { data: detailsData } = useAuctionDetails({})
  const { data: nextId } = useNextAuctionHeaderId()

  // Mutations for headers
  const createHeaderMutation = useCreateAuctionHeader()
  const updateHeaderMutation = useUpdateAuctionHeader()
  const deleteHeaderMutation = useDeleteAuctionHeader()

  const auctions = headersData?.auctionHeaders || []
  const auctionDetails = detailsData?.auctionDetails || []

  const headerColumns: Column<AuctionHeader>[] = [
    { key: 'name', label: 'Auction Name' },
    { key: 'numberOfPeople', label: 'Participants' },
    {
      key: 'date',
      label: 'Date',
      render: value => format(new Date(value), 'MMM dd, yyyy'),
    },
    {
      key: 'exchangeRate',
      label: 'Exchange Rate (¥→$)',
      render: value => Number(value).toFixed(3),
    },
    {
      key: 'isClosed',
      label: 'Status',
      render: value => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            value ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {value ? 'Closed' : 'Open'}
        </span>
      ),
    },
  ]

  // Header CRUD operations
  const handleAddHeader = () => {
    setEditingHeader(null)
    const today = new Date().toISOString().split('T')[0]
    const defaultName = `Predeterminado - ${nextId || format(new Date(), 'hh:mm a')}`
    setHeaderFormData({ date: today, name: defaultName })
    setIsHeaderDialogOpen(true)
  }

  const handleEditHeader = (header: AuctionHeader) => {
    setEditingHeader(header)
    setHeaderFormData({
      ...header,
      date: header.date ? header.date.split('T')[0] : '',
    })
    setIsHeaderDialogOpen(true)
  }

  const handleDeleteHeader = async (header: AuctionHeader) => {
    if (window.confirm(`Are you sure you want to delete "${header.name}"?`)) {
      try {
        await deleteHeaderMutation.mutateAsync(header.id)
        toast({
          title: 'Auction deleted',
          description: `${header.name} has been successfully deleted.`,
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete auction.',
          variant: 'destructive',
        })
      }
    }
  }

  const handleSaveHeader = async () => {
    if (!headerFormData.name || !headerFormData.date) {
      toast({
        title: 'Validation Error',
        description: 'Name and date are required fields.',
        variant: 'destructive',
      })
      return
    }

    const header = {
      name: headerFormData.name || '',
      numberOfPeople: headerFormData.numberOfPeople || 0,
      date: headerFormData.date || '',
      exchangeRate: headerFormData.exchangeRate || 0.14,
    }

    try {
      if (editingHeader) {
        await updateHeaderMutation.mutateAsync({ id: editingHeader.id, ...header })
      } else {
        await createHeaderMutation.mutateAsync(header)
      }

      toast({
        title: `Auction ${editingHeader ? 'updated' : 'added'}`,
        description: `${header.name} has been successfully ${editingHeader ? 'updated' : 'added'}.`,
      })

      setIsHeaderDialogOpen(false)
      setHeaderFormData({})
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${editingHeader ? 'update' : 'create'} auction.`,
        variant: 'destructive',
      })
    }
  }

  const getHeaderCustomActions = (): CustomAction<AuctionHeader>[] => [
    {
      label: 'View Details',
      onClick: auction => {
        if (onNavigate) {
          onNavigate('auction-details', auction.id)
        }
      },
      variant: 'default',
      className: 'h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white',
    },
  ]

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-4xl font-bold text-gray-900'>Auction Tracker</h1>
          <p className='text-lg text-gray-600 mt-2'>Manage auction events and track detailed bidding information</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card className='shadow-sm'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-base font-semibold'>Total Auctions</CardTitle>
            <Calendar className='h-6 w-6 text-muted-foreground' />
          </CardHeader>
          <CardContent className='pt-4'>
            <div className='text-3xl font-bold'>{auctions.length}</div>
            <p className='text-sm text-muted-foreground mt-1'>Active auction events</p>
          </CardContent>
        </Card>

        <Card className='shadow-sm'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-base font-semibold'>Total Participants</CardTitle>
            <Users className='h-6 w-6 text-muted-foreground' />
          </CardHeader>
          <CardContent className='pt-4'>
            <div className='text-3xl font-bold'>{auctions.reduce((sum, a) => sum + (a.numberOfPeople || 0), 0)}</div>
            <p className='text-sm text-muted-foreground mt-1'>Across all auctions</p>
          </CardContent>
        </Card>

        <Card className='shadow-sm'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-base font-semibold'>Total Revenue</CardTitle>
            <DollarSign className='h-6 w-6 text-muted-foreground' />
          </CardHeader>
          <CardContent className='pt-4'>
            <div className='text-3xl font-bold'>
              ${auctionDetails.reduce((sum, d) => sum + (Number(d.priceSold) || 0), 0).toFixed(2)}
            </div>
            <p className='text-sm text-muted-foreground mt-1'>Total sales value</p>
          </CardContent>
        </Card>
      </div>

      {/* Auction Management Table */}
      <DataTable
        title='Auction Events'
        data={auctions}
        columns={headerColumns}
        onAdd={handleAddHeader}
        onEdit={handleEditHeader}
        onDelete={handleDeleteHeader}
        customActions={getHeaderCustomActions}
        searchPlaceholder='Search auctions...'
      />

      {/* Header Dialog */}
      <Dialog open={isHeaderDialogOpen} onOpenChange={setIsHeaderDialogOpen}>
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle className='text-2xl'>{editingHeader ? 'Edit Auction' : 'Add New Auction'}</DialogTitle>
          </DialogHeader>

          <div className='grid gap-6 py-6'>
            <div className='space-y-2'>
              <Label htmlFor='auction-name' className='text-base font-medium'>
                Auction Name *
              </Label>
              <Input
                id='auction-name'
                value={headerFormData.name || ''}
                onChange={e => setHeaderFormData({ ...headerFormData, name: e.target.value })}
                placeholder='Enter auction name'
                className='h-12 text-base'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='participants' className='text-base font-medium'>
                  Number of Participants
                </Label>
                <Input
                  id='participants'
                  type='number'
                  value={headerFormData.numberOfPeople || ''}
                  onChange={e =>
                    setHeaderFormData({
                      ...headerFormData,
                      numberOfPeople: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder='0'
                  className='h-12 text-base'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='exchange-rate' className='text-base font-medium'>
                  Exchange Rate (¥ → $)
                </Label>
                <Input
                  id='exchange-rate'
                  type='number'
                  step='0.001'
                  value={headerFormData.exchangeRate || ''}
                  onChange={e =>
                    setHeaderFormData({
                      ...headerFormData,
                      exchangeRate: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder='0.140'
                  className='h-12 text-base'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='auction-date' className='text-base font-medium'>
                Auction Date *
              </Label>
              <Input
                id='auction-date'
                type='date'
                value={headerFormData.date || ''}
                onChange={e => setHeaderFormData({ ...headerFormData, date: e.target.value })}
                className='h-12 text-base'
              />
            </div>
          </div>

          <div className='flex justify-end space-x-4 pt-4'>
            <Button variant='outline' onClick={() => setIsHeaderDialogOpen(false)} className='h-12 px-6 text-base'>
              Cancel
            </Button>
            <Button
              disabled={createHeaderMutation.isPending || updateHeaderMutation.isPending}
              onClick={handleSaveHeader}
              className='h-12 px-6 text-base font-semibold'
            >
              {editingHeader ? 'Update' : 'Add'} Auction
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AuctionsPage
