import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DataTable, Column, CustomAction } from './DataTable'
import { AuctionSummary } from './AuctionSummary'
import { toast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import {
  useAuctionHeaders,
  useAuctionDetails,
  useCreateAuctionDetail,
  useUpdateAuctionDetail,
  useDeleteAuctionDetail,
  useToggleAuctionDetailSold,
  useCloseAuctionHeader,
  useReopenAuctionHeader,
} from '@/hooks/useAuctions'
import { AuctionDetail } from '@/api/types'
import { ProductAutocomplete } from './ProductAutocomplete'
import { ClientAutocomplete } from './ClientAutocomplete'

interface AuctionDetailsViewProps {
  auctionId: string
  onBack?: () => void
}

const AuctionDetailsView: React.FC<AuctionDetailsViewProps> = ({ auctionId, onBack }) => {
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [editingDetail, setEditingDetail] = useState<AuctionDetail | null>(null)
  const [detailFormData, setDetailFormData] = useState<Partial<AuctionDetail>>({})

  // Fetch data
  const { data: headersData } = useAuctionHeaders()
  const { data: detailsData } = useAuctionDetails({ auctionId: parseInt(auctionId) })

  // Mutations
  const createDetailMutation = useCreateAuctionDetail()
  const updateDetailMutation = useUpdateAuctionDetail()
  const deleteDetailMutation = useDeleteAuctionDetail()
  const toggleSoldMutation = useToggleAuctionDetailSold()
  const closeHeaderMutation = useCloseAuctionHeader()
  const reopenHeaderMutation = useReopenAuctionHeader()

  const auctions = headersData?.auctionHeaders || []
  const auctionDetails = detailsData?.auctionDetails || []

  const selectedAuction = auctions.find(a => a.id === auctionId)

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

  // Calculate Price Sold and Price per KG based on form data
  const calculatePrices = () => {
    const highestBid = detailFormData.highestBidRmb || 0
    const weight = detailFormData.weight || 0
    const exchangeRate = selectedAuction?.exchangeRate || 0.14

    const priceSold = highestBid * exchangeRate
    const pricePerKg = weight > 0 ? priceSold / weight : 0

    return { priceSold, pricePerKg }
  }

  const calculatedPrices = calculatePrices()

  const handleAddDetail = () => {
    if (!selectedAuction) return

    if (selectedAuction.isClosed) {
      toast({
        title: 'Auction is closed',
        description: 'Cannot add details to a closed auction.',
        variant: 'destructive',
      })
      return
    }

    setEditingDetail(null)
    setDetailFormData({ auctionId })
    setIsDetailDialogOpen(true)
  }

  const handleEditDetail = (detail: AuctionDetail) => {
    if (selectedAuction?.isClosed) {
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
    if (selectedAuction?.isClosed) {
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

    // Calculate prices based on current form data
    const prices = calculatePrices()

    const detail = {
      auctionId: detailFormData.auctionId || auctionId,
      productId: detailFormData.productId || null,
      weight: detailFormData.weight || 0,
      bagNumber: detailFormData.bagNumber || '',
      numberOfPieces: detailFormData.numberOfPieces || 0,
      winner1ClientId: detailFormData.winner1ClientId || null,
      winner2ClientId: detailFormData.winner2ClientId || null,
      lot: detailFormData.lot || '',
      date: detailFormData.date || new Date().toISOString().split('T')[0],
      highestBidRmb: detailFormData.highestBidRmb || null,
      pricePerKg: prices.pricePerKg || null,
      priceSold: prices.priceSold || null,
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

  const handleToggleSold = async (detail: AuctionDetail) => {
    if (selectedAuction?.isClosed) {
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

  const handleCloseAuction = async () => {
    if (!selectedAuction) return

    if (window.confirm(`Are you sure you want to close "${selectedAuction.name}"?`)) {
      try {
        await closeHeaderMutation.mutateAsync(selectedAuction.id)
        toast({
          title: 'Auction closed',
          description: `${selectedAuction.name} has been successfully closed.`,
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

  const handleReopenAuction = async () => {
    if (!selectedAuction) return

    if (window.confirm(`Are you sure you want to reopen "${selectedAuction.name}"?`)) {
      try {
        await reopenHeaderMutation.mutateAsync(selectedAuction.id)
        toast({
          title: 'Auction reopened',
          description: `${selectedAuction.name} has been successfully reopened.`,
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to reopen auction.',
          variant: 'destructive',
        })
      }
    }
  }

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

  if (!selectedAuction) {
    return (
      <div className='space-y-6'>
        <div className='text-center py-12'>
          <p className='text-lg text-gray-600'>Auction not found</p>
          {onBack && (
            <Button onClick={onBack} className='mt-4'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Auctions
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <div className='flex items-center gap-4'>
            {onBack && (
              <Button onClick={onBack} variant='outline' size='sm' className='h-10 rounded-full'>
                <ArrowLeft className='h-4 w-4' />
              </Button>
            )}
            <div>
              <h1 className='text-4xl font-bold text-gray-900'>Auction Details</h1>
              <p className='text-lg text-gray-600 mt-2'>{selectedAuction.name}</p>
            </div>
          </div>
        </div>
      </div>

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
                  <Button
                    onClick={handleReopenAuction}
                    disabled={reopenHeaderMutation.isPending}
                    variant='outline'
                    className='mt-2 w-full'
                  >
                    Reopen Auction
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleCloseAuction}
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

      {selectedAuction.isClosed ? (
        <AuctionSummary
          details={auctionDetails}
          auctionName={selectedAuction.name}
          exchangeRate={selectedAuction.exchangeRate || 0}
        />
      ) : (
        <DataTable
          title={`Auction Details - ${selectedAuction.name}`}
          data={auctionDetails}
          columns={detailColumns}
          onAdd={handleAddDetail}
          onEdit={handleEditDetail}
          onDelete={handleDeleteDetail}
          customActions={getDetailCustomActions}
          searchPlaceholder='Search auction details...'
        />
      )}

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
                <Label htmlFor='price-sold' className='text-base font-medium'>
                  Price Sold ($) <span className='text-xs text-gray-500'>(Calculated)</span>
                </Label>
                <Input
                  id='price-sold'
                  type='number'
                  step='0.01'
                  value={calculatedPrices.priceSold.toFixed(2)}
                  readOnly
                  disabled
                  placeholder='0.00'
                  className='h-12 text-base bg-gray-100 cursor-not-allowed'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='price-per-kg' className='text-base font-medium'>
                  Price per KG ($) <span className='text-xs text-gray-500'>(Calculated)</span>
                </Label>
                <Input
                  id='price-per-kg'
                  type='number'
                  step='0.01'
                  value={calculatedPrices.pricePerKg.toFixed(2)}
                  readOnly
                  disabled
                  placeholder='0.00'
                  className='h-12 text-base bg-gray-100 cursor-not-allowed'
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

export default AuctionDetailsView
