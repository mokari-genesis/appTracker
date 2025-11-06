const auctionHouses = require('../auctionHouses')

const auctionHousesRoute = [
  {
    path: 'auction-houses',
    method: 'GET',
    handler: auctionHouses.getAuctionHouses,
    public: false,
  },
  {
    path: 'auction-houses',
    method: 'POST',
    handler: auctionHouses.addAuctionHouse,
    public: false,
  },
  {
    path: 'auction-houses',
    method: 'PUT',
    handler: auctionHouses.updateAuctionHouse,
    public: false,
  },
  {
    path: 'auction-houses',
    method: 'DELETE',
    handler: auctionHouses.deleteAuctionHouse,
    public: false,
  },
]

module.exports = auctionHousesRoute
