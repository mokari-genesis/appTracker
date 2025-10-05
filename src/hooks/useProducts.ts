import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createProduct, deleteProduct, fetchProducts, GetProductsParams, updateProduct } from '@/api/products'
import { QueryKeys } from '@/lib/queryKeys'

export const useProducts = (params: GetProductsParams = {}) => {
  return useQuery({
    queryKey: [QueryKeys.Products, params],
    queryFn: () => fetchProducts(params),
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Products] })
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Products] })
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Products] })
    },
  })
}
