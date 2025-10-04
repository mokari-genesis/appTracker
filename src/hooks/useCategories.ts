import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createCategory, deleteCategory, fetchCategories, GetCategoriesParams, updateCategory } from '@/api/categories'
import { QueryKeys } from '@/lib/queryKeys'

export const useCategories = (params: GetCategoriesParams = {}) => {
  return useQuery({
    queryKey: [QueryKeys.Categories, params],
    queryFn: () => fetchCategories(params),
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Categories] })
    },
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Categories] })
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Categories] })
    },
  })
}
