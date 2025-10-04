import {
  createAuctionDetail,
  createAuctionHeader,
  deleteAuctionDetail,
  deleteAuctionHeader,
  fetchAuctionDetails,
  fetchAuctionHeaders,
  GetAuctionDetailsParams,
  GetAuctionHeadersParams,
  updateAuctionDetail,
  updateAuctionHeader,
} from '@/api/auctions'
import { QueryKeys } from '@/lib/queryKeys'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Auction Headers
export const useAuctionHeaders = (params: GetAuctionHeadersParams = {}) => {
  return useQuery({
    queryKey: [QueryKeys.AuctionHeaders, params],
    queryFn: () => fetchAuctionHeaders(params),
  })
}

export const useCreateAuctionHeader = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createAuctionHeader,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.AuctionHeaders] })
    },
  })
}

export const useUpdateAuctionHeader = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateAuctionHeader,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.AuctionHeaders] })
    },
  })
}

export const useDeleteAuctionHeader = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteAuctionHeader,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.AuctionHeaders] })
    },
  })
}

// Auction Details
export const useAuctionDetails = (params: GetAuctionDetailsParams = {}) => {
  return useQuery({
    queryKey: ['auctionDetails', params],
    queryFn: () => fetchAuctionDetails(params),
  })
}

export const useCreateAuctionDetail = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createAuctionDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.AuctionDetails] })
    },
  })
}

export const useUpdateAuctionDetail = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateAuctionDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.AuctionDetails] })
    },
  })
}

export const useDeleteAuctionDetail = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteAuctionDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.AuctionDetails] })
    },
  })
}
