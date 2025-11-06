import {
  createAuctionHouse,
  deleteAuctionHouse,
  fetchAuctionHouses,
  GetAuctionHousesParams,
  updateAuctionHouse,
} from '@/api/auctionHouses'
import { QueryKeys } from '@/lib/queryKeys'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const useAuctionHouses = (params: GetAuctionHousesParams = {}) => {
  return useQuery({
    queryKey: [QueryKeys.AuctionHouses, params],
    queryFn: () => fetchAuctionHouses(params),
  })
}

export const useCreateAuctionHouse = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createAuctionHouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.AuctionHouses] })
    },
  })
}

export const useUpdateAuctionHouse = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateAuctionHouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.AuctionHouses] })
    },
  })
}

export const useDeleteAuctionHouse = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteAuctionHouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.AuctionHouses] })
    },
  })
}
