import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient, deleteClient, fetchClients, GetClientsParams, updateClient } from '@/api/clients'
import { QueryKeys } from '@/lib/queryKeys'

export const useClients = (params: GetClientsParams = {}) => {
  return useQuery({
    queryKey: [QueryKeys.Clients, params],
    queryFn: () => fetchClients(params),
  })
}

export const useCreateClient = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Clients] })
    },
  })
}

export const useUpdateClient = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Clients] })
    },
  })
}

export const useDeleteClient = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Clients] })
    },
  })
}
