import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AuctionDetail } from '@/api/types'

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

export const AuctionSummary: React.FC<AuctionSummaryProps> = ({ details, auctionName, exchangeRate }) => {
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
    acc[productName].totalWeight += Number(detail.weight) || 0
    acc[productName].totalHighestBid += Number(detail.highestBidRmb) || 0
    acc[productName].totalPriceSold += Number(detail.priceSold) || 0

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
  }

  if (grandTotals.totalWeight > 0) {
    grandTotals.avgPricePerKg = grandTotals.totalPriceSold / grandTotals.totalWeight
  }

  return (
    <div className='space-y-6'>
      <Card className='shadow-sm'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-gray-900'>Auction Summary - {auctionName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-8'>
            {/* Resumen por producto */}
            {productGroupsArray.map((group, index) => (
              <div key={index} className='border rounded-lg overflow-hidden'>
                <div className='bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b'>
                  <h3 className='text-lg font-semibold text-gray-900'>{group.productName}</h3>
                </div>

                {/* Tabla de detalles del producto */}
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                          Bag #
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                          Lot
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                          Weight (kg)
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                          Pieces
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                          Winner 1
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                          Winner 2
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
                          <td className='px-4 py-3 text-sm text-gray-900'>{detail.bagNumber || '-'}</td>
                          <td className='px-4 py-3 text-sm text-gray-900'>{detail.lot || '-'}</td>
                          <td className='px-4 py-3 text-sm text-gray-900'>{Number(detail.weight).toFixed(2)}</td>
                          <td className='px-4 py-3 text-sm text-gray-900'>{detail.numberOfPieces || '-'}</td>
                          <td className='px-4 py-3 text-sm text-gray-900'>{detail.winner1Name || '-'}</td>
                          <td className='px-4 py-3 text-sm text-gray-900'>{detail.winner2Name || '-'}</td>
                          <td className='px-4 py-3 text-sm text-gray-900 text-right'>
                            ¥{Number(detail.highestBidRmb || 0).toLocaleString()}
                          </td>
                          <td className='px-4 py-3 text-sm text-gray-900 text-right'>
                            ${Number(detail.pricePerKg || 0).toFixed(2)}
                          </td>
                          <td className='px-4 py-3 text-sm text-gray-900 text-right font-medium'>
                            ${Number(detail.priceSold || 0).toFixed(2)}
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
                      {/* Totales por producto */}
                      <tr className='bg-blue-50 font-semibold'>
                        <td colSpan={2} className='px-4 py-3 text-sm text-gray-900'>
                          Product Total
                        </td>
                        <td className='px-4 py-3 text-sm text-gray-900'>{group.totalWeight.toFixed(2)} kg</td>
                        <td className='px-4 py-3 text-sm text-gray-900'>
                          {group.details.reduce((sum, d) => sum + (Number(d.numberOfPieces) || 0), 0)}
                        </td>
                        <td colSpan={2}></td>
                        <td className='px-4 py-3 text-sm text-gray-900 text-right'>
                          ¥{group.totalHighestBid.toLocaleString()}
                        </td>
                        <td className='px-4 py-3 text-sm text-gray-900 text-right'>-</td>
                        <td className='px-4 py-3 text-sm text-gray-900 text-right'>
                          ${group.totalPriceSold.toFixed(2)}
                        </td>
                        <td></td>
                      </tr>
                      <tr className='bg-blue-100 font-semibold'>
                        <td colSpan={7} className='px-4 py-3 text-sm text-gray-900'>
                          Average Price per KG (Total Price Sold / Total Weight)
                        </td>
                        <td className='px-4 py-3 text-sm text-gray-900 text-right'>
                          ${group.avgPricePerKg.toFixed(2)}/kg
                        </td>
                        <td className='px-4 py-3 text-sm text-gray-900 text-right'></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            {/* Totales Generales */}
            <Card className='bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200'>
              <CardHeader>
                <CardTitle className='text-xl font-bold text-gray-900'>Grand Totals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
                  <div>
                    <p className='text-sm text-gray-600 font-medium'>Total Weight</p>
                    <p className='text-2xl font-bold text-gray-900'>{grandTotals.totalWeight.toFixed(2)} kg</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600 font-medium'>Total Highest Bid</p>
                    <p className='text-2xl font-bold text-gray-900'>¥{grandTotals.totalHighestBid.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600 font-medium'>Total Price Sold</p>
                    <p className='text-2xl font-bold text-green-700'>${grandTotals.totalPriceSold.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600 font-medium'>Average Price per KG</p>
                    <p className='text-2xl font-bold text-blue-700'>${grandTotals.avgPricePerKg.toFixed(2)}/kg</p>
                  </div>
                </div>

                {/* Información adicional */}
                <div className='mt-6 pt-6 border-t border-green-200'>
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-4 text-sm'>
                    <div>
                      <p className='text-gray-600'>Total Products</p>
                      <p className='text-lg font-semibold text-gray-900'>{productGroupsArray.length}</p>
                    </div>
                    <div>
                      <p className='text-gray-600'>Total Items</p>
                      <p className='text-lg font-semibold text-gray-900'>{details.length}</p>
                    </div>
                    <div>
                      <p className='text-gray-600'>Exchange Rate</p>
                      <p className='text-lg font-semibold text-gray-900'>¥1 = ${exchangeRate}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
