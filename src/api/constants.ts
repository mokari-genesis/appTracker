export type LambdaResponse<T> = {
  data: T
  msg?: string
  message?: string
  status: string
  count?: number
  pageIndex?: number
  pageSize?: number
}

export type MutationResponse = {
  affectedRows: number
  insertId: number
  changedRows: number
}
