const auctionHeaders = require('../auctionHeaders')

const auctionHeadersRoute = [
  {
    path: 'auction-headers',
    method: 'GET',
    handler: auctionHeaders.getAuctionHeaders,
    public: false,
  },
  {
    path: 'auction-headers',
    method: 'POST',
    handler: auctionHeaders.addAuctionHeader,
    public: false,
  },
  {
    path: 'auction-headers',
    method: 'PUT',
    handler: auctionHeaders.updateAuctionHeader,
    public: false,
  },
  {
    path: 'auction-headers/close',
    method: 'PUT',
    handler: auctionHeaders.closeAuctionHeader,
    public: false,
  },
  {
    path: 'auction-headers',
    method: 'DELETE',
    handler: auctionHeaders.deleteAuctionHeader,
    public: false,
  },
]

module.exports = auctionHeadersRoute
