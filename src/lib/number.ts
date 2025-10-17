const formatMoney = (amount: number, maximumFractionDigits: number = 2) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: maximumFractionDigits,
  }).format(amount)
}

const formatYuan = (amount: number, maximumFractionDigits: number = 2) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: maximumFractionDigits,
  }).format(amount)
}

export { formatMoney, formatYuan }
