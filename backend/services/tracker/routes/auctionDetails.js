const auctionDetails = require('../auctionDetails')

const auctionDetailsRoute = [
  {
    path: 'auction-details',
    method: 'GET',
    handler: auctionDetails.getAuctionDetails,
    public: false,
  },
  {
    path: 'auction-details',
    method: 'POST',
    handler: auctionDetails.addAuctionDetail,
    public: false,
  },
  {
    path: 'auction-details',
    method: 'PUT',
    handler: auctionDetails.updateAuctionDetail,
    public: false,
  },
  {
    path: 'auction-details',
    method: 'DELETE',
    handler: auctionDetails.deleteAuctionDetail,
    public: false,
  },
  {
    path: 'auction-details/toggle-sold',
    method: 'PUT',
    handler: auctionDetails.toggleAuctionDetailSold,
    public: false,
  },
]

module.exports = auctionDetailsRoute
