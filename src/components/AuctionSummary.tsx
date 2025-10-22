import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { AuctionDetail } from '@/api/types'
import { formatMoney, formatYuan } from '@/lib/number'
import { Info } from 'lucide-react'
import { formatDateLocal } from '@/lib/dates'

interface AuctionSummaryProps {
  details: AuctionDetail[]
  auctionName: string
  exchangeRate: number
}

interface ProductGroup {
  productName: string
  details: AuctionDetail[]
  totalWeight: number
  totalHighestBid: number
  totalPriceSold: number
  avgPricePerKg: number
}

export const AuctionSummary: React.FC<AuctionSummaryProps> = ({ details, exchangeRate }) => {
  const productGroups = details.reduce((acc, detail) => {
    const productName = detail.productName || 'Unknown Product'

    if (!acc[productName]) {
      acc[productName] = {
        productName,
        details: [],
        totalWeight: 0,
        totalHighestBid: 0,
        totalPriceSold: 0,
        avgPricePerKg: 0,
      }
    }

    acc[productName].details.push(detail)
    
    // Only include sold items in totals
    if (detail.isSold) {
      acc[productName].totalWeight += Number(detail.weight) || 0
      acc[productName].totalHighestBid += Number(detail.highestBidRmb) || 0
      acc[productName].totalPriceSold += Number(detail.priceSold) || 0
    }

    return acc
  }, {} as Record<string, ProductGroup>)

  // Calculate average price per kg for each product
  Object.values(productGroups).forEach(group => {
    if (group.totalWeight > 0) {
      group.avgPricePerKg = group.totalPriceSold / group.totalWeight
    }
  })

  const productGroupsArray = Object.values(productGroups)

  // Calculate grand totals
  const grandTotals = {
    totalWeight: productGroupsArray.reduce((sum, group) => sum + group.totalWeight, 0),
    totalHighestBid: productGroupsArray.reduce((sum, group) => sum + group.totalHighestBid, 0),
    totalPriceSold: productGroupsArray.reduce((sum, group) => sum + group.totalPriceSold, 0),
    avgPricePerKg: 0,
    commission: 0,
  }

  if (grandTotals.totalWeight > 0) {
    grandTotals.avgPricePerKg = grandTotals.totalPriceSold / grandTotals.totalWeight
  }

  // Calculate commission: 2% of total RMB converted to USD
  grandTotals.commission = (grandTotals.totalHighestBid * 0.02) / (exchangeRate || 7.14)

  return (
    <TooltipProvider>
      <div className='space-y-6'>
        <Card className='shadow-sm'>
          <CardHeader>
            <CardTitle className='text-2xl font-bold text-gray-900'>Auction Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-8'>
              {/* Grand Totals */}
              <div className='bg-gradient-to-br from-green-200 via-green-200 to-teal-200 rounded-xl p-6 border border-emerald-200'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-bold text-gray-900'>📊 Grand Totals</h3>
                  <p className='text-xs font-semibold text-gray-700 bg-white/60 px-3 py-1 rounded-full'>Only sold items included</p>
                </div>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                  <div className='bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-sm border border-green-100'>
                    <p className='text-xs font-bold text-gray-600 uppercase tracking-wide'>Total in USD</p>
                    <p className='text-xl font-bold text-green-700 mt-1'>{formatMoney(grandTotals.totalPriceSold, 0)}</p>
                  </div>
                  <div className='bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-sm border border-blue-100'>
                    <p className='text-xs font-bold text-gray-600 uppercase tracking-wide'>Total in RMB</p>
                    <p className='text-xl font-bold text-blue-700 mt-1'>{formatYuan(grandTotals.totalHighestBid, 0)}</p>
                  </div>
                  <div className='bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-sm border border-purple-100'>
                    <p className='text-xs font-bold text-gray-600 uppercase tracking-wide'>Commission (2%)</p>
                    <p className='text-xl font-bold text-purple-700 mt-1'>{formatMoney(grandTotals.commission, 2)}</p>
                  </div>
                  <div className='bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-sm border border-indigo-100'>
                    <div className='flex items-center gap-1'>
                      <p className='text-xs font-bold text-gray-600 uppercase tracking-wide'>
                        {grandTotals.totalWeight.toFixed(2)} kg
                      </p>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className='h-3.5 w-3.5 text-gray-500 cursor-help' />
                        </TooltipTrigger>
                        <TooltipContent className='max-w-xs'>
                          <p className='font-semibold mb-1'>Average Price per KG</p>
                          <p>Total USD ÷ Total Weight</p>
                          <p className='text-xs mt-1 opacity-90'>
                            {formatMoney(grandTotals.totalPriceSold, 0)} ÷ {grandTotals.totalWeight.toFixed(2)} kg
                          </p>
                          <p className='text-xs mt-2 pt-2 border-t border-gray-300 italic'>
                            * Only sold items included in totals
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className='text-xl font-bold text-indigo-700 mt-1'>
                      {formatMoney(grandTotals.avgPricePerKg, 0)}/kg
                    </p>
                  </div>
                </div>
              </div>

            {/* Resumen por producto */}
            {productGroupsArray.map((group, index) => (
              <div key={index} className='border rounded-lg overflow-hidden'>
                <div className='bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b'>
                  <h3 className='text-lg font-semibold text-gray-900'>Grade: {group.productName}</h3>
                </div>

                {/* Tabla de detalles del producto */}
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                          Date
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                          Weight (kg)
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                          Bag #
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                          # of Pieces
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                          Winner 1
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                          Winner 2
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                          Lot
                        </th>
                        <th className='px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider'>
                          Highest Bid (¥)
                        </th>
                        <th className='px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider'>
                          Price per KG ($)
                        </th>
                        <th className='px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider'>
                          Price Sold ($)
                        </th>
                        <th className='px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider'>
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {group.details.map((detail, detailIndex) => (
                        <tr key={detailIndex} className='hover:bg-gray-50'>
                          <td className='px-4 py-3 text-sm text-gray-900'>
                            {formatDateLocal(detail.date)}
                          </td>
                          <td className='px-4 py-3 text-sm text-gray-900'>{Number(detail.weight).toFixed(2)}</td>
                          <td className='px-4 py-3 text-sm text-gray-900'>{detail.bagNumber || '-'}</td>
                          <td className='px-4 py-3 text-sm text-gray-900'>{detail.numberOfPieces || '-'}</td>
                          <td className='px-4 py-3 text-sm text-gray-900'>{detail.winner1Name || '-'}</td>
                          <td className='px-4 py-3 text-sm text-gray-900'>{detail.winner2Name || '-'}</td>
                          <td className='px-4 py-3 text-sm text-gray-900'>{detail.lot || '-'}</td>
                          <td className='px-4 py-3 text-sm text-gray-900 text-right'>
                            {formatYuan(Number(detail.highestBidRmb || 0))}
                          </td>
                          <td className='px-4 py-3 text-sm text-gray-900 text-right'>
                            {formatMoney(Number(detail.pricePerKg || 0))}
                          </td>
                          <td className='px-4 py-3 text-sm text-gray-900 text-right font-medium'>
                            {formatMoney(Number(detail.priceSold || 0))}
                          </td>
                          <td className='px-4 py-3 text-sm text-center'>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                detail.isSold ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {detail.isSold ? 'Sold' : 'Not Sold'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Product Totals Summary */}
                <div className='bg-gradient-to-r from-slate-50 to-gray-50 px-4 py-4 border-t-2 border-gray-200'>
                  <p className='text-xs font-semibold text-gray-600 mb-3 flex items-center gap-1'>
                    <span className='inline-block w-2 h-2 bg-green-500 rounded-full'></span>
                    Product Totals (Only sold items)
                  </p>
                  <div className='grid grid-cols-3 gap-4'>
                    <div className='bg-white rounded-lg px-4 py-3 shadow-sm border border-green-100'>
                      <p className='text-xs font-bold text-gray-600 uppercase tracking-wide'>Total in USD</p>
                      <p className='text-lg font-bold text-green-700 mt-1'>{formatMoney(group.totalPriceSold, 0)}</p>
                    </div>
                    <div className='bg-white rounded-lg px-4 py-3 shadow-sm border border-blue-100'>
                      <p className='text-xs font-bold text-gray-600 uppercase tracking-wide'>Total in RMB</p>
                      <p className='text-lg font-bold text-blue-700 mt-1'>{formatYuan(group.totalHighestBid, 0)}</p>
                    </div>
                    <div className='bg-white rounded-lg px-4 py-3 shadow-sm border border-indigo-100'>
                      <div className='flex items-center gap-1'>
                        <p className='text-xs font-bold text-gray-600 uppercase tracking-wide'>
                          {group.totalWeight.toFixed(2)} kg
                        </p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className='h-3.5 w-3.5 text-gray-500 cursor-help' />
                          </TooltipTrigger>
                          <TooltipContent className='max-w-xs'>
                            <p className='font-semibold mb-1'>Average Price per KG</p>
                            <p>Total USD ÷ Total Weight</p>
                            <p className='text-xs mt-1 opacity-90'>
                              {formatMoney(group.totalPriceSold, 0)} ÷ {group.totalWeight.toFixed(2)} kg
                            </p>
                            <p className='text-xs mt-2 pt-2 border-t border-gray-300 italic'>
                              * Only sold items included in totals
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className='text-lg font-bold text-indigo-700 mt-1'>{formatMoney(group.avgPricePerKg, 0)}/kg</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    </TooltipProvider>
  )
}
