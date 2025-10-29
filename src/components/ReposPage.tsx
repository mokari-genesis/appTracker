import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, AlertCircle } from 'lucide-react'
import { fetchMetabaseDashboardUrl } from '@/api/metabase'

const ReposPage: React.FC = () => {
  const [iframeUrl, setIframeUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await fetchMetabaseDashboardUrl()
        setIframeUrl(data.url)
        setIsLoading(false)

        // Refresh token before it expires (refresh 1 minute before expiration)
        const refreshTime = (data.expiresIn - 60) * 1000
        const timeoutId = setTimeout(() => {
          loadDashboard()
        }, refreshTime)

        return () => clearTimeout(timeoutId)
      } catch (err) {
        console.error('Error loading Metabase dashboard:', err)
        setError('Failed to load dashboard. Please try again later.')
        setIsLoading(false)
      }
    }

    loadDashboard()
  }, [])

  return (
    <div className='space-y-6 h-full'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-4xl font-bold text-gray-900'>Reports & Analytics</h1>
          <p className='text-lg text-gray-600 mt-2'>View comprehensive auction analytics and reports</p>
        </div>
      </div>

      <Card className='shadow-sm flex flex-col flex-1'>
        <CardContent className='h-full'>
          {isLoading ? (
            <div className='flex items-center justify-center h-[600px]'>
              <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
            </div>
          ) : error ? (
            <div className='flex flex-col items-center justify-center h-[600px] text-center'>
              <AlertCircle className='h-12 w-12 text-red-500 mb-4' />
              <p className='text-lg text-gray-700'>{error}</p>
            </div>
          ) : (
            <div className='w-full h-full' style={{ height: '800px' }}>
              <iframe
                src={iframeUrl}
                frameBorder={0}
                width='100%'
                height='100%'
                allowTransparency
                className='rounded-lg'
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ReposPage
