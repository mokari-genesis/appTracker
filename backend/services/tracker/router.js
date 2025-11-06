const trackerRoutes = require('./routes')

module.exports.router = () => {
  const routes = [
    {
      proxy: 'tracker',
      routes: [
        ...trackerRoutes.clientsRoute,
        ...trackerRoutes.categoriesRoute,
        ...trackerRoutes.productsRoute,
        ...trackerRoutes.auctionHeadersRoute,
        ...trackerRoutes.auctionDetailsRoute,
        ...trackerRoutes.auctionHousesRoute,
        ...trackerRoutes.metabaseRoute,
      ],
    },
  ]

  return routes
}
