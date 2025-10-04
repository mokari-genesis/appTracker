import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DataTable, Column } from './DataTable';
import { toast } from '@/hooks/use-toast';
import {
  AuctionHeader,
  AuctionDetail,
  mockAuctionHeaders,
  mockAuctionDetails,
} from '@/data/mockData';
import { format } from 'date-fns';
import { Calendar, DollarSign, Users } from 'lucide-react';

const AuctionsPage: React.FC = () => {
  const [auctions, setAuctions] = useState<AuctionHeader[]>(mockAuctionHeaders);
  const [auctionDetails, setAuctionDetails] = useState<AuctionDetail[]>(mockAuctionDetails);
  const [selectedAuctionId, setSelectedAuctionId] = useState<string | null>(null);
  
  // Dialog states
  const [isHeaderDialogOpen, setIsHeaderDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [editingHeader, setEditingHeader] = useState<AuctionHeader | null>(null);
  const [editingDetail, setEditingDetail] = useState<AuctionDetail | null>(null);
  const [headerFormData, setHeaderFormData] = useState<Partial<AuctionHeader>>({});
  const [detailFormData, setDetailFormData] = useState<Partial<AuctionDetail>>({});

  const headerColumns: Column<AuctionHeader>[] = [
    { key: 'name', label: 'Auction Name' },
    { key: 'numberOfPeople', label: 'Participants' },
    {
      key: 'date',
      label: 'Date',
      render: (value) => format(new Date(value), 'MMM dd, yyyy'),
    },
    {
      key: 'exchangeRate',
      label: 'Exchange Rate (¥→$)',
      render: (value) => Number(value).toFixed(3),
    },
  ];

  const detailColumns: Column<AuctionDetail>[] = [
    { key: 'type', label: 'Type' },
    { key: 'weight', label: 'Weight (kg)' },
    { key: 'bagNumber', label: 'Bag #' },
    { key: 'numberOfPieces', label: 'Pieces' },
    { key: 'winner1', label: 'Winner 1' },
    { key: 'lot', label: 'Lot' },
    {
      key: 'highestBidRMB',
      label: 'Highest Bid (¥)',
      render: (value) => `¥${Number(value).toLocaleString()}`,
    },
    {
      key: 'priceSoldUSD',
      label: 'Price Sold ($)',
      render: (value) => `$${Number(value).toFixed(2)}`,
    },
  ];

  // Header CRUD operations
  const handleAddHeader = () => {
    setEditingHeader(null);
    setHeaderFormData({});
    setIsHeaderDialogOpen(true);
  };

  const handleEditHeader = (header: AuctionHeader) => {
    setEditingHeader(header);
    setHeaderFormData(header);
    setIsHeaderDialogOpen(true);
  };

  const handleDeleteHeader = (header: AuctionHeader) => {
    if (window.confirm(`Are you sure you want to delete "${header.name}"?`)) {
      setAuctions(auctions.filter((a) => a.id !== header.id));
      setAuctionDetails(auctionDetails.filter((d) => d.auctionId !== header.id));
      toast({
        title: 'Auction deleted',
        description: `${header.name} has been successfully deleted.`,
      });
    }
  };

  const handleSaveHeader = () => {
    if (!headerFormData.name || !headerFormData.date) {
      toast({
        title: 'Validation Error',
        description: 'Name and date are required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (editingHeader) {
      setAuctions(
        auctions.map((a) =>
          a.id === editingHeader.id ? { ...editingHeader, ...headerFormData } : a
        )
      );
      toast({
        title: 'Auction updated',
        description: `${headerFormData.name} has been successfully updated.`,
      });
    } else {
      const newHeader: AuctionHeader = {
        id: Date.now().toString(),
        name: headerFormData.name || '',
        numberOfPeople: headerFormData.numberOfPeople || 0,
        date: headerFormData.date || '',
        exchangeRate: headerFormData.exchangeRate || 0.14,
        createdAt: new Date().toISOString(),
      };
      setAuctions([...auctions, newHeader]);
      toast({
        title: 'Auction added',
        description: `${newHeader.name} has been successfully added.`,
      });
    }

    setIsHeaderDialogOpen(false);
    setHeaderFormData({});
  };

  // Detail CRUD operations
  const handleAddDetail = () => {
    if (!selectedAuctionId) {
      toast({
        title: 'No auction selected',
        description: 'Please select an auction to add details to.',
        variant: 'destructive',
      });
      return;
    }
    setEditingDetail(null);
    setDetailFormData({ auctionId: selectedAuctionId });
    setIsDetailDialogOpen(true);
  };

  const handleEditDetail = (detail: AuctionDetail) => {
    setEditingDetail(detail);
    setDetailFormData(detail);
    setIsDetailDialogOpen(true);
  };

  const handleDeleteDetail = (detail: AuctionDetail) => {
    if (window.confirm('Are you sure you want to delete this auction detail?')) {
      setAuctionDetails(auctionDetails.filter((d) => d.id !== detail.id));
      toast({
        title: 'Detail deleted',
        description: 'Auction detail has been successfully deleted.',
      });
    }
  };

  const handleSaveDetail = () => {
    if (!detailFormData.type || !detailFormData.weight) {
      toast({
        title: 'Validation Error',
        description: 'Type and weight are required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (editingDetail) {
      setAuctionDetails(
        auctionDetails.map((d) =>
          d.id === editingDetail.id ? { ...editingDetail, ...detailFormData } : d
        )
      );
      toast({
        title: 'Detail updated',
        description: 'Auction detail has been successfully updated.',
      });
    } else {
      const newDetail: AuctionDetail = {
        id: Date.now().toString(),
        auctionId: detailFormData.auctionId || selectedAuctionId || '',
        type: detailFormData.type || '',
        weight: detailFormData.weight || 0,
        bagNumber: detailFormData.bagNumber || '',
        numberOfPieces: detailFormData.numberOfPieces || 0,
        winner1: detailFormData.winner1 || '',
        winner2: detailFormData.winner2 || '',
        lot: detailFormData.lot || '',
        date: detailFormData.date || new Date().toISOString().split('T')[0],
        highestBidRMB: detailFormData.highestBidRMB || 0,
        pricePerKgUSD: detailFormData.pricePerKgUSD || 0,
        priceSoldUSD: detailFormData.priceSoldUSD || 0,
      };
      setAuctionDetails([...auctionDetails, newDetail]);
      toast({
        title: 'Detail added',
        description: 'Auction detail has been successfully added.',
      });
    }

    setIsDetailDialogOpen(false);
    setDetailFormData({});
  };

  const selectedAuction = auctions.find((a) => a.id === selectedAuctionId);
  const filteredDetails = auctionDetails.filter((d) => d.auctionId === selectedAuctionId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Auction Tracker</h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage auction events and track detailed bidding information
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="auctions">Auction Management</TabsTrigger>
          <TabsTrigger value="details">Auction Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold">Total Auctions</CardTitle>
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold">{auctions.length}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Active auction events
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold">Total Participants</CardTitle>
                <Users className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold">
                  {auctions.reduce((sum, a) => sum + a.numberOfPeople, 0)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Across all auctions
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold">Total Revenue</CardTitle>
                <DollarSign className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold">
                  ${auctionDetails.reduce((sum, d) => sum + d.priceSoldUSD, 0).toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Total sales value
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="auctions">
          <DataTable
            title="Auction Events"
            data={auctions}
            columns={headerColumns}
            onAdd={handleAddHeader}
            onEdit={handleEditHeader}
            onDelete={handleDeleteHeader}
            searchPlaceholder="Search auctions..."
          />
        </TabsContent>

        <TabsContent value="details">
          <div className="space-y-6">
            <div className="flex items-center space-x-6">
              <Label htmlFor="auction-select" className="text-base font-medium">Select Auction:</Label>
              <select
                id="auction-select"
                value={selectedAuctionId || ''}
                onChange={(e) => setSelectedAuctionId(e.target.value || null)}
                className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-base min-w-[300px]"
              >
                <option value="">Choose an auction...</option>
                {auctions.map((auction) => (
                  <option key={auction.id} value={auction.id}>
                    {auction.name} - {format(new Date(auction.date), 'MMM dd, yyyy')}
                  </option>
                ))}
              </select>
            </div>

            {selectedAuction && (
              <Card className="bg-blue-50 border-blue-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-base text-blue-600 font-medium">Auction Name</p>
                      <p className="text-lg font-semibold text-blue-900">{selectedAuction.name}</p>
                    </div>
                    <div>
                      <p className="text-base text-blue-600 font-medium">Participants</p>
                      <p className="text-lg font-semibold text-blue-900">{selectedAuction.numberOfPeople}</p>
                    </div>
                    <div>
                      <p className="text-base text-blue-600 font-medium">Date</p>
                      <p className="text-lg font-semibold text-blue-900">
                        {format(new Date(selectedAuction.date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-base text-blue-600 font-medium">Exchange Rate</p>
                      <p className="text-lg font-semibold text-blue-900">¥1 = ${selectedAuction.exchangeRate}</p>
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
                onAdd={handleAddDetail}
                onEdit={handleEditDetail}
                onDelete={handleDeleteDetail}
                searchPlaceholder="Search auction details..."
              />
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Header Dialog */}
      <Dialog open={isHeaderDialogOpen} onOpenChange={setIsHeaderDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingHeader ? 'Edit Auction' : 'Add New Auction'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="auction-name" className="text-base font-medium">Auction Name *</Label>
              <Input
                id="auction-name"
                value={headerFormData.name || ''}
                onChange={(e) =>
                  setHeaderFormData({ ...headerFormData, name: e.target.value })
                }
                placeholder="Enter auction name"
                className="h-12 text-base"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="participants" className="text-base font-medium">Number of Participants</Label>
                <Input
                  id="participants"
                  type="number"
                  value={headerFormData.numberOfPeople || ''}
                  onChange={(e) =>
                    setHeaderFormData({
                      ...headerFormData,
                      numberOfPeople: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exchange-rate" className="text-base font-medium">Exchange Rate (¥ → $)</Label>
                <Input
                  id="exchange-rate"
                  type="number"
                  step="0.001"
                  value={headerFormData.exchangeRate || ''}
                  onChange={(e) =>
                    setHeaderFormData({
                      ...headerFormData,
                      exchangeRate: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.140"
                  className="h-12 text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="auction-date" className="text-base font-medium">Auction Date *</Label>
              <Input
                id="auction-date"
                type="date"
                value={headerFormData.date || ''}
                onChange={(e) =>
                  setHeaderFormData({ ...headerFormData, date: e.target.value })
                }
                className="h-12 text-base"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline" onClick={() => setIsHeaderDialogOpen(false)} className="h-12 px-6 text-base">
              Cancel
            </Button>
            <Button onClick={handleSaveHeader} className="h-12 px-6 text-base font-semibold">
              {editingHeader ? 'Update' : 'Add'} Auction
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingDetail ? 'Edit Auction Detail' : 'Add Auction Detail'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-6 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="detail-type" className="text-base font-medium">Type *</Label>
                <Input
                  id="detail-type"
                  value={detailFormData.type || ''}
                  onChange={(e) =>
                    setDetailFormData({ ...detailFormData, type: e.target.value })
                  }
                  placeholder="e.g., Green Tea, Ceramics"
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="detail-weight" className="text-base font-medium">Weight (kg) *</Label>
                <Input
                  id="detail-weight"
                  type="number"
                  step="0.1"
                  value={detailFormData.weight || ''}
                  onChange={(e) =>
                    setDetailFormData({
                      ...detailFormData,
                      weight: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.0"
                  className="h-12 text-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bag-number" className="text-base font-medium">Bag Number</Label>
                <Input
                  id="bag-number"
                  value={detailFormData.bagNumber || ''}
                  onChange={(e) =>
                    setDetailFormData({ ...detailFormData, bagNumber: e.target.value })
                  }
                  placeholder="GT-001"
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pieces" className="text-base font-medium">Number of Pieces</Label>
                <Input
                  id="pieces"
                  type="number"
                  value={detailFormData.numberOfPieces || ''}
                  onChange={(e) =>
                    setDetailFormData({
                      ...detailFormData,
                      numberOfPieces: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lot" className="text-base font-medium">Lot</Label>
                <Input
                  id="lot"
                  value={detailFormData.lot || ''}
                  onChange={(e) =>
                    setDetailFormData({ ...detailFormData, lot: e.target.value })
                  }
                  placeholder="A-001"
                  className="h-12 text-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="winner1" className="text-base font-medium">Winner 1</Label>
                <Input
                  id="winner1"
                  value={detailFormData.winner1 || ''}
                  onChange={(e) =>
                    setDetailFormData({ ...detailFormData, winner1: e.target.value })
                  }
                  placeholder="Winner name"
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="winner2" className="text-base font-medium">Winner 2 (Optional)</Label>
                <Input
                  id="winner2"
                  value={detailFormData.winner2 || ''}
                  onChange={(e) =>
                    setDetailFormData({ ...detailFormData, winner2: e.target.value })
                  }
                  placeholder="Winner name"
                  className="h-12 text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="detail-date" className="text-base font-medium">Date</Label>
              <Input
                id="detail-date"
                type="date"
                value={detailFormData.date || ''}
                onChange={(e) =>
                  setDetailFormData({ ...detailFormData, date: e.target.value })
                }
                className="h-12 text-base"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="highest-bid" className="text-base font-medium">Highest Bid (¥)</Label>
                <Input
                  id="highest-bid"
                  type="number"
                  value={detailFormData.highestBidRMB || ''}
                  onChange={(e) =>
                    setDetailFormData({
                      ...detailFormData,
                      highestBidRMB: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price-per-kg" className="text-base font-medium">Price per KG ($)</Label>
                <Input
                  id="price-per-kg"
                  type="number"
                  step="0.01"
                  value={detailFormData.pricePerKgUSD || ''}
                  onChange={(e) =>
                    setDetailFormData({
                      ...detailFormData,
                      pricePerKgUSD: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.00"
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price-sold" className="text-base font-medium">Price Sold ($)</Label>
                <Input
                  id="price-sold"
                  type="number"
                  step="0.01"
                  value={detailFormData.priceSoldUSD || ''}
                  onChange={(e) =>
                    setDetailFormData({
                      ...detailFormData,
                      priceSoldUSD: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.00"
                  className="h-12 text-base"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)} className="h-12 px-6 text-base">
              Cancel
            </Button>
            <Button onClick={handleSaveDetail} className="h-12 px-6 text-base font-semibold">
              {editingDetail ? 'Update' : 'Add'} Detail
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuctionsPage;