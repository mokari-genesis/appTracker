import {
  createAuctionDetail,
  createAuctionHeader,
  deleteAuctionDetail,
  deleteAuctionHeader,
  closeAuctionHeader,
  reopenAuctionHeader,
  fetchAuctionDetails,
  fetchAuctionHeaders,
  GetAuctionDetailsParams,
  GetAuctionHeadersParams,
  updateAuctionDetail,
  updateAuctionHeader,
  toggleAuctionDetailSold,
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

export const useCloseAuctionHeader = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: closeAuctionHeader,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.AuctionHeaders] })
    },
  })
}

export const useReopenAuctionHeader = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: reopenAuctionHeader,
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
      queryClient.invalidateQueries({ queryKey: [QueryKeys.AuctionDetails] })
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

export const useToggleAuctionDetailSold = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isSold }: { id: string; isSold: boolean }) => toggleAuctionDetailSold(id, isSold),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.AuctionDetails] })
    },
  })
}
