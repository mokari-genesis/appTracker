import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DataTable, Column, CustomAction } from './DataTable'
import { toast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { Calendar, DollarSign, Users, CheckCircle, XCircle } from 'lucide-react'
import {
  useAuctionHeaders,
  useCreateAuctionHeader,
  useUpdateAuctionHeader,
  useCloseAuctionHeader,
  useDeleteAuctionHeader,
  useAuctionDetails,
  useCreateAuctionDetail,
  useUpdateAuctionDetail,
  useDeleteAuctionDetail,
  useToggleAuctionDetailSold,
} from '@/hooks/useAuctions'
import { AuctionHeader, AuctionDetail } from '@/api/types'
import { ProductAutocomplete } from './ProductAutocomplete'
import { ClientAutocomplete } from './ClientAutocomplete'

const AuctionsPage: React.FC = () => {
  const [selectedAuctionId, setSelectedAuctionId] = useState<string | null>(null)

  // Dialog states
  const [isHeaderDialogOpen, setIsHeaderDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [editingHeader, setEditingHeader] = useState<AuctionHeader | null>(null)
  const [editingDetail, setEditingDetail] = useState<AuctionDetail | null>(null)
  const [headerFormData, setHeaderFormData] = useState<Partial<AuctionHeader>>({})
  const [detailFormData, setDetailFormData] = useState<Partial<AuctionDetail>>({})

  // Fetch data
  const { data: headersData } = useAuctionHeaders()
  const { data: detailsData } = useAuctionDetails(selectedAuctionId ? { auctionId: parseInt(selectedAuctionId) } : {})

  // Mutations for headers
  const createHeaderMutation = useCreateAuctionHeader()
  const updateHeaderMutation = useUpdateAuctionHeader()
  const closeHeaderMutation = useCloseAuctionHeader()
  const deleteHeaderMutation = useDeleteAuctionHeader()

  // Mutations for details
  const createDetailMutation = useCreateAuctionDetail()
  const updateDetailMutation = useUpdateAuctionDetail()
  const deleteDetailMutation = useDeleteAuctionDetail()
  const toggleSoldMutation = useToggleAuctionDetailSold()

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

  const detailColumns: Column<AuctionDetail>[] = [
    {
      key: 'productName',
      label: 'Product',
      render: value => value || '-',
    },
    { key: 'weight', label: 'Weight (kg)' },
    { key: 'bagNumber', label: 'Bag #' },
    { key: 'numberOfPieces', label: 'Pieces' },
    {
      key: 'winner1Name',
      label: 'Winner 1',
      render: value => value || '-',
    },
    {
      key: 'winner2Name',
      label: 'Winner 2',
      render: value => value || '-',
    },
    { key: 'lot', label: 'Lot' },
    {
      key: 'highestBidRmb',
      label: 'Highest Bid (¥)',
      render: value => `¥${Number(value).toLocaleString()}`,
    },
    {
      key: 'priceSold',
      label: 'Price Sold ($)',
      render: value => `$${Number(value).toFixed(2)}`,
    },
  ]

  // Header CRUD operations
  const handleAddHeader = () => {
    setEditingHeader(null)
    setHeaderFormData({ date: new Date().toISOString().split('T')[0] })
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

  // Detail CRUD operations
  const handleAddDetail = () => {
    if (!selectedAuctionId) {
      toast({
        title: 'No auction selected',
        description: 'Please select an auction to add details to.',
        variant: 'destructive',
      })
      return
    }

    const auction = auctions.find(a => a.id === selectedAuctionId)
    if (auction?.isClosed) {
      toast({
        title: 'Auction is closed',
        description: 'Cannot add details to a closed auction.',
        variant: 'destructive',
      })
      return
    }

    setEditingDetail(null)
    setDetailFormData({ auctionId: selectedAuctionId })
    setIsDetailDialogOpen(true)
  }

  const handleEditDetail = (detail: AuctionDetail) => {
    const auction = auctions.find(a => a.id === selectedAuctionId)
    if (auction?.isClosed) {
      toast({
        title: 'Auction is closed',
        description: 'Cannot edit details of a closed auction.',
        variant: 'destructive',
      })
      return
    }

    setEditingDetail(detail)
    setDetailFormData({
      ...detail,
      date: detail.date ? detail.date.split('T')[0] : '',
    })
    setIsDetailDialogOpen(true)
  }

  const handleDeleteDetail = async (detail: AuctionDetail) => {
    const auction = auctions.find(a => a.id === selectedAuctionId)
    if (auction?.isClosed) {
      toast({
        title: 'Auction is closed',
        description: 'Cannot delete details of a closed auction.',
        variant: 'destructive',
      })
      return
    }

    if (window.confirm('Are you sure you want to delete this auction detail?')) {
      try {
        await deleteDetailMutation.mutateAsync(detail.id)
        toast({
          title: 'Detail deleted',
          description: 'Auction detail has been successfully deleted.',
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete auction detail.',
          variant: 'destructive',
        })
      }
    }
  }

  const handleSaveDetail = async () => {
    if (!detailFormData.productId || !detailFormData.weight) {
      toast({
        title: 'Validation Error',
        description: 'Product and weight are required fields.',
        variant: 'destructive',
      })
      return
    }

    const detail = {
      auctionId: detailFormData.auctionId || selectedAuctionId || '',
      productId: detailFormData.productId || null,
      weight: detailFormData.weight || 0,
      bagNumber: detailFormData.bagNumber || '',
      numberOfPieces: detailFormData.numberOfPieces || 0,
      winner1ClientId: detailFormData.winner1ClientId || null,
      winner2ClientId: detailFormData.winner2ClientId || null,
      lot: detailFormData.lot || '',
      date: detailFormData.date || new Date().toISOString().split('T')[0],
      highestBidRmb: detailFormData.highestBidRmb || null,
      pricePerKg: detailFormData.pricePerKg || null,
      priceSold: detailFormData.priceSold || null,
    }

    try {
      if (editingDetail) {
        await updateDetailMutation.mutateAsync({ id: editingDetail.id, ...detail })
      } else {
        await createDetailMutation.mutateAsync(detail)
      }

      toast({
        title: `Detail ${editingDetail ? 'updated' : 'added'}`,
        description: `Auction detail has been successfully ${editingDetail ? 'updated' : 'added'}.`,
      })

      setIsDetailDialogOpen(false)
      setDetailFormData({})
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${editingDetail ? 'update' : 'create'} auction detail.`,
        variant: 'destructive',
      })
    }
  }

  const handleCloseAuction = async (header: AuctionHeader) => {
    if (window.confirm(`Are you sure you want to close "${header.name}"? This action cannot be undone.`)) {
      try {
        await closeHeaderMutation.mutateAsync(header.id)
        toast({
          title: 'Auction closed',
          description: `${header.name} has been successfully closed.`,
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to close auction.',
          variant: 'destructive',
        })
      }
    }
  }

  const handleToggleSold = async (detail: AuctionDetail) => {
    const auction = auctions.find(a => a.id === selectedAuctionId)
    if (auction?.isClosed) {
      toast({
        title: 'Auction is closed',
        description: 'Cannot modify details of a closed auction.',
        variant: 'destructive',
      })
      return
    }

    try {
      await toggleSoldMutation.mutateAsync({
        id: detail.id,
        isSold: !detail.isSold,
      })
      toast({
        title: detail.isSold ? 'Marked as not sold' : 'Marked as sold',
        description: `Auction detail has been successfully updated.`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update auction detail.',
        variant: 'destructive',
      })
    }
  }

  const selectedAuction = selectedAuctionId ? auctions.find(a => Number(a.id) === Number(selectedAuctionId)) : null
  const filteredDetails = selectedAuctionId ? auctionDetails : []

  const getDetailCustomActions = (detail: AuctionDetail): CustomAction<AuctionDetail>[] => [
    {
      label: detail.isSold ? 'Mark Unsold' : 'Mark Sold',
      icon: detail.isSold ? <XCircle className='h-3 w-3 mr-1' /> : <CheckCircle className='h-3 w-3 mr-1' />,
      onClick: handleToggleSold,
      variant: 'outline',
      className: detail.isSold
        ? 'h-8 px-3 bg-white border-orange-300 text-orange-700 hover:bg-orange-50 hover:text-orange-800 transition-colors'
        : 'h-8 px-3 bg-white border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800 transition-colors',
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

      <Tabs defaultValue='overview' className='space-y-6'>
        <TabsList className='grid w-full grid-cols-3 h-12'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='auctions'>Auction Management</TabsTrigger>
          <TabsTrigger value='details'>Auction Details</TabsTrigger>
        </TabsList>

        <TabsContent value='overview'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
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
                <div className='text-3xl font-bold'>
                  {auctions.reduce((sum, a) => sum + (a.numberOfPeople || 0), 0)}
                </div>
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
        </TabsContent>

        <TabsContent value='auctions'>
          <DataTable
            title='Auction Events'
            data={auctions}
            columns={headerColumns}
            onAdd={handleAddHeader}
            onEdit={handleEditHeader}
            onDelete={handleDeleteHeader}
            searchPlaceholder='Search auctions...'
          />
        </TabsContent>

        <TabsContent value='details'>
          <div className='space-y-6'>
            <div className='flex items-center space-x-6'>
              <Label htmlFor='auction-select' className='text-base font-medium'>
                Select Auction:
              </Label>
              <select
                id='auction-select'
                value={selectedAuctionId || ''}
                onChange={e => setSelectedAuctionId(e.target.value || null)}
                className='border border-gray-300 rounded-lg px-4 py-3 bg-white text-base min-w-[300px]'
              >
                <option value=''>Choose an auction...</option>
                {auctions.map(auction => (
                  <option key={auction.id} value={auction.id}>
                    {auction.name} - {format(new Date(auction.date), 'MMM dd, yyyy')}
                  </option>
                ))}
              </select>
            </div>

            {selectedAuction && (
              <Card className='bg-blue-50 border-blue-200 shadow-sm'>
                <CardContent className='p-6'>
                  <div className='flex justify-between items-center'>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 flex-1'>
                      <div>
                        <p className='text-base text-blue-600 font-medium'>Auction Name</p>
                        <p className='text-lg font-semibold text-blue-900'>{selectedAuction.name}</p>
                      </div>
                      <div>
                        <p className='text-base text-blue-600 font-medium'>Participants</p>
                        <p className='text-lg font-semibold text-blue-900'>{selectedAuction.numberOfPeople}</p>
                      </div>
                      <div>
                        <p className='text-base text-blue-600 font-medium'>Date</p>
                        <p className='text-lg font-semibold text-blue-900'>
                          {format(new Date(selectedAuction.date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div>
                        <p className='text-base text-blue-600 font-medium'>Exchange Rate</p>
                        <p className='text-lg font-semibold text-blue-900'>¥1 = ${selectedAuction.exchangeRate}</p>
                      </div>
                    </div>
                    <div className='ml-4'>
                      {selectedAuction.isClosed ? (
                        <div className='text-center'>
                          <span className='inline-block px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium'>
                            Closed
                          </span>
                          {selectedAuction.closedAt && (
                            <p className='text-xs text-gray-600 mt-1'>
                              {format(new Date(selectedAuction.closedAt), 'MMM dd, yyyy HH:mm')}
                            </p>
                          )}
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleCloseAuction(selectedAuction)}
                          disabled={closeHeaderMutation.isPending}
                          className='bg-orange-600 hover:bg-orange-700'
                        >
                          Close Auction
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedAuctionId && (
              <DataTable
                title={`Auction Details - ${selectedAuction?.name || 'Selected Auction'}`}
                data={filteredDetails}
                columns={detailColumns}
                onAdd={
                  selectedAuction?.isClosed
                    ? () => toast({ title: 'Auction is closed', variant: 'destructive' })
                    : handleAddDetail
                }
                onEdit={
                  selectedAuction?.isClosed
                    ? () => toast({ title: 'Auction is closed', variant: 'destructive' })
                    : handleEditDetail
                }
                onDelete={
                  selectedAuction?.isClosed
                    ? () => toast({ title: 'Auction is closed', variant: 'destructive' })
                    : handleDeleteDetail
                }
                customActions={selectedAuction?.isClosed ? undefined : getDetailCustomActions}
                searchPlaceholder='Search auction details...'
              />
            )}
          </div>
        </TabsContent>
      </Tabs>

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

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className='sm:max-w-[700px]'>
          <DialogHeader>
            <DialogTitle className='text-2xl'>
              {editingDetail ? 'Edit Auction Detail' : 'Add Auction Detail'}
            </DialogTitle>
          </DialogHeader>

          <div className='grid gap-6 py-6 max-h-[60vh] overflow-y-auto'>
            <div className='grid grid-cols-2 gap-4'>
              <ProductAutocomplete
                value={detailFormData.productId || null}
                onChange={productId => setDetailFormData({ ...detailFormData, productId })}
                label='Product'
                placeholder='Search product...'
                required
              />
              <div className='space-y-2'>
                <Label htmlFor='detail-weight' className='text-base font-medium'>
                  Weight (kg) *
                </Label>
                <Input
                  id='detail-weight'
                  type='number'
                  step='0.1'
                  value={detailFormData.weight || ''}
                  onChange={e =>
                    setDetailFormData({
                      ...detailFormData,
                      weight: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder='0.0'
                  className='h-12 text-base'
                />
              </div>
            </div>

            <div className='grid grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='bag-number' className='text-base font-medium'>
                  Bag Number
                </Label>
                <Input
                  id='bag-number'
                  value={detailFormData.bagNumber || ''}
                  onChange={e => setDetailFormData({ ...detailFormData, bagNumber: e.target.value })}
                  placeholder='GT-001'
                  className='h-12 text-base'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='pieces' className='text-base font-medium'>
                  Number of Pieces
                </Label>
                <Input
                  id='pieces'
                  type='number'
                  value={detailFormData.numberOfPieces || ''}
                  onChange={e =>
                    setDetailFormData({
                      ...detailFormData,
                      numberOfPieces: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder='0'
                  className='h-12 text-base'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='lot' className='text-base font-medium'>
                  Lot
                </Label>
                <Input
                  id='lot'
                  value={detailFormData.lot || ''}
                  onChange={e => setDetailFormData({ ...detailFormData, lot: e.target.value })}
                  placeholder='A-001'
                  className='h-12 text-base'
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <ClientAutocomplete
                value={detailFormData.winner1ClientId || null}
                onChange={clientId => setDetailFormData({ ...detailFormData, winner1ClientId: clientId })}
                label='Winner 1'
                placeholder='Search winner...'
              />
              <ClientAutocomplete
                value={detailFormData.winner2ClientId || null}
                onChange={clientId => setDetailFormData({ ...detailFormData, winner2ClientId: clientId })}
                label='Winner 2 (Optional)'
                placeholder='Search winner...'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='detail-date' className='text-base font-medium'>
                Date
              </Label>
              <Input
                id='detail-date'
                type='date'
                value={detailFormData.date || ''}
                onChange={e => setDetailFormData({ ...detailFormData, date: e.target.value })}
                className='h-12 text-base'
              />
            </div>

            <div className='grid grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='highest-bid' className='text-base font-medium'>
                  Highest Bid (¥)
                </Label>
                <Input
                  id='highest-bid'
                  type='number'
                  value={detailFormData.highestBidRmb || ''}
                  onChange={e =>
                    setDetailFormData({
                      ...detailFormData,
                      highestBidRmb: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder='0'
                  className='h-12 text-base'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='price-per-kg' className='text-base font-medium'>
                  Price per KG ($)
                </Label>
                <Input
                  id='price-per-kg'
                  type='number'
                  step='0.01'
                  value={detailFormData.pricePerKg || ''}
                  onChange={e =>
                    setDetailFormData({
                      ...detailFormData,
                      pricePerKg: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder='0.00'
                  className='h-12 text-base'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='price-sold' className='text-base font-medium'>
                  Price Sold ($)
                </Label>
                <Input
                  id='price-sold'
                  type='number'
                  step='0.01'
                  value={detailFormData.priceSold || ''}
                  onChange={e =>
                    setDetailFormData({
                      ...detailFormData,
                      priceSold: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder='0.00'
                  className='h-12 text-base'
                />
              </div>
            </div>
          </div>

          <div className='flex justify-end space-x-4 pt-4'>
            <Button variant='outline' onClick={() => setIsDetailDialogOpen(false)} className='h-12 px-6 text-base'>
              Cancel
            </Button>
            <Button
              disabled={createDetailMutation.isPending || updateDetailMutation.isPending}
              onClick={handleSaveDetail}
              className='h-12 px-6 text-base font-semibold'
            >
              {editingDetail ? 'Update' : 'Add'} Detail
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AuctionsPage
