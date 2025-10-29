const metabase = require('../metabase')

const metabaseRoute = [
  {
    path: 'metabase/dashboard-url',
    method: 'GET',
    handler: metabase.getMetabaseDashboardUrl,
    public: false,
  },
]

module.exports = metabaseRoute
