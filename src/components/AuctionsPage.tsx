import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DataTable, Column, CustomAction } from './DataTable'
import { toast } from '@/hooks/use-toast'
import { Calendar, DollarSign, Users, Coins, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  useAuctionHeaders,
  useCreateAuctionHeader,
  useUpdateAuctionHeader,
  useDeleteAuctionHeader,
  useAuctionDetails,
  useAuctionMetrics,
} from '@/hooks/useAuctions'
import { AuctionHeader } from '@/api/types'
import { formatMoney, formatYuan } from '@/lib/number'
import { formatDateLocal, toInputDateFormat, getTodayDateString } from '@/lib/dates'
import { AuctionHouseAutocomplete } from './AuctionHouseAutocomplete'

interface AuctionsPageProps {
  viewAuctionId?: string | null
  onNavigate?: (page: string, auctionId?: string) => void
}

const AuctionsPage: React.FC<AuctionsPageProps> = ({ onNavigate }) => {
  // Dialog states
  const [isHeaderDialogOpen, setIsHeaderDialogOpen] = useState(false)
  const [editingHeader, setEditingHeader] = useState<AuctionHeader | null>(null)
  const [headerFormData, setHeaderFormData] = useState<Partial<AuctionHeader>>({})

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0)
  const pageLimit = 100

  // Fetch data
  const { data: headersData } = useAuctionHeaders({ page: currentPage, limit: pageLimit })
  const { data: detailsData } = useAuctionDetails({})
  const { data: metricsData } = useAuctionMetrics()

  // Mutations for headers
  const createHeaderMutation = useCreateAuctionHeader()
  const updateHeaderMutation = useUpdateAuctionHeader()
  const deleteHeaderMutation = useDeleteAuctionHeader()

  const auctions = headersData?.auctionHeaders || []
  const auctionDetails = detailsData?.auctionDetails || []
  const hasNextPage = headersData?.hasNextPage || false
  const metrics = metricsData || {
    totalAuctions: 0,
    totalParticipants: 0,
    totalRevenueUsd: 0,
    totalRmb: 0,
    totalCommissionRmb: 0,
    totalCommissionUsd: 0,
  }

  const headerColumns: Column<AuctionHeader>[] = [
    { key: 'auctionHouseName', label: 'Auction Name' },
    { key: 'numberOfPeople', label: 'Participants' },
    {
      key: 'date',
      label: 'Date',
      render: value => formatDateLocal(value),
    },
    {
      key: 'exchangeRate',
      label: 'Exchange Rate ($→¥)',
      render: value => Number(value).toFixed(2),
    },
    {
      key: 'id',
      label: 'Total USD',
      render: (_value, row) => {
        const auctionId = row.id
        const total = auctionDetails
          .filter(d => d.auctionId === auctionId && d.isSold)
          .reduce((sum, d) => sum + (Number(d.priceSold) || 0), 0)
        return formatMoney(total, 0)
      },
    },
    {
      key: 'id',
      label: 'Total RMB',
      render: (_value, row) => {
        const auctionId = row.id
        const total = auctionDetails
          .filter(d => d.auctionId === auctionId && d.isSold)
          .reduce((sum, d) => sum + (Number(d.highestBidRmb) || 0), 0)
        return formatYuan(total, 0)
      },
    },
    {
      key: 'id',
      label: 'Commission',
      render: (_value, row) => {
        const auctionId = row.id
        const exchangeRate = row.exchangeRate || 7.14
        const commissionRate = row.commissionRate || 0.02
        const totalRmb = auctionDetails
          .filter(d => d.auctionId === auctionId && d.isSold)
          .reduce((sum, d) => sum + (Number(d.highestBidRmb) || 0), 0)
        const commission = (totalRmb * commissionRate) / exchangeRate
        return formatMoney(commission, 2)
      },
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
    setHeaderFormData({ date: getTodayDateString() })
    setIsHeaderDialogOpen(true)
  }

  const handleEditHeader = (header: AuctionHeader) => {
    setEditingHeader(header)
    setHeaderFormData({
      ...header,
      date: toInputDateFormat(header.date),
    })
    setIsHeaderDialogOpen(true)
  }

  const handleDeleteHeader = async (header: AuctionHeader) => {
    if (window.confirm(`Are you sure you want to delete "${header.auctionHouseName}"?`)) {
      try {
        await deleteHeaderMutation.mutateAsync(header.id)
        toast({
          title: 'Auction deleted',
          description: `${header.auctionHouseName} has been successfully deleted.`,
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
    if (!headerFormData.auctionHouseId || !headerFormData.date) {
      toast({
        title: 'Validation Error',
        description: 'Name and date are required fields.',
        variant: 'destructive',
      })
      return
    }

    const header = {
      auctionHouseId: headerFormData.auctionHouseId || '',
      numberOfPeople: headerFormData.numberOfPeople || 0,
      date: headerFormData.date || '',
      exchangeRate: headerFormData.exchangeRate || 7.14,
    }

    try {
      if (editingHeader) {
        await updateHeaderMutation.mutateAsync({ id: editingHeader.id, ...header })
      } else {
        await createHeaderMutation.mutateAsync(header)
      }

      toast({
        title: `Auction ${editingHeader ? 'updated' : 'added'}`,
        description: `Auction has been successfully ${editingHeader ? 'updated' : 'added'}.`,
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
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        <Card className='shadow-sm'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-base font-semibold'>Total Auctions</CardTitle>
            <Calendar className='h-6 w-6 text-muted-foreground' />
          </CardHeader>
          <CardContent className='pt-4'>
            <div className='text-xl lg:text-2xl font-bold'>{metrics.totalAuctions}</div>
            <p className='text-sm text-muted-foreground mt-1'>Active auction events</p>
          </CardContent>
        </Card>

        <Card className='shadow-sm'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-base font-semibold'>Total Participants</CardTitle>
            <Users className='h-6 w-6 text-muted-foreground' />
          </CardHeader>
          <CardContent className='pt-4'>
            <div className='text-xl lg:text-2xl font-bold'>{metrics.totalParticipants}</div>
            <p className='text-sm text-muted-foreground mt-1'>Across all auctions</p>
          </CardContent>
        </Card>

        <Card className='shadow-sm'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-base font-semibold'>Total Revenue (USD)</CardTitle>
            <DollarSign className='h-6 w-6 text-muted-foreground' />
          </CardHeader>
          <CardContent className='pt-4'>
            <div className='text-xl lg:text-2xl font-bold'>{formatMoney(metrics.totalRevenueUsd, 0)}</div>
            <p className='text-sm text-muted-foreground mt-1'>Total sales value</p>
          </CardContent>
        </Card>

        <Card className='shadow-sm'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-base font-semibold'>Total RMB</CardTitle>
            <Coins className='h-6 w-6 text-muted-foreground' />
          </CardHeader>
          <CardContent className='pt-4'>
            <div className='text-xl lg:text-2xl font-bold'>{formatYuan(metrics.totalRmb, 0)}</div>
            <p className='text-sm text-muted-foreground mt-1'>Total highest bids</p>
          </CardContent>
        </Card>

        <Card className='shadow-sm border-purple-200 bg-purple-50/30'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-base font-semibold text-purple-900'>Total Commission</CardTitle>
            <DollarSign className='h-6 w-6 text-purple-600' />
          </CardHeader>
          <CardContent className='pt-4'>
            <div className='text-xl lg:text-2xl font-bold text-purple-700'>
              {formatMoney(metrics.totalCommissionUsd, 0)}
            </div>
            <div className='text-base font-semibold text-purple-600 mt-2'>
              {formatYuan(metrics.totalCommissionRmb, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Auction Management Table */}
      <div className='space-y-4'>
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

        {/* Pagination Controls */}
        <div className='flex items-center justify-between px-2'>
          <div className='text-sm text-muted-foreground'>
            Page {currentPage + 1} • Showing {auctions.length} auctions
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

      {/* Header Dialog */}
      <Dialog open={isHeaderDialogOpen} onOpenChange={setIsHeaderDialogOpen}>
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle className='text-2xl'>{editingHeader ? 'Edit Auction' : 'Add New Auction'}</DialogTitle>
          </DialogHeader>

          <div className='grid gap-6 py-6'>
            <AuctionHouseAutocomplete
              value={headerFormData.auctionHouseId || null}
              onChange={auctionHouseId => setHeaderFormData({ ...headerFormData, auctionHouseId })}
              required
            />

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
                  Exchange Rate ($ → ¥)
                </Label>
                <Input
                  id='exchange-rate'
                  type='number'
                  step='0.01'
                  value={headerFormData.exchangeRate || ''}
                  onChange={e =>
                    setHeaderFormData({
                      ...headerFormData,
                      exchangeRate: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder='7.14'
                  className='h-12 text-base'
                />
                <Label htmlFor='exchange-rate' className='text-xs font-medium text-muted-foreground'>
                  If not specified, it will use 7.14 as default
                </Label>
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
