const jwt = require('jsonwebtoken')

const METABASE_SITE_URL = process.env.METABASE_SITE_URL
const METABASE_SECRET_KEY = process.env.METABASE_SECRET_KEY

const getMetabaseDashboardUrl = async () => {
  const payload = {
    resource: { dashboard: 8 },
    params: {},
    exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
  }

  const token = jwt.sign(payload, METABASE_SECRET_KEY)
  const iframeUrl = `${METABASE_SITE_URL}/embed/dashboard/${token}#bordered=true&titled=true`

  return {
    url: iframeUrl,
    expiresIn: 600, // 10 minutes in seconds
  }
}

module.exports = {
  getMetabaseDashboardUrl,
}
