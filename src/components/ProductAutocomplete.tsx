import React, { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useProducts } from '@/hooks/useProducts'
import { Product } from '@/api/types'

interface ProductAutocompleteProps {
  value: string | null
  onChange: (productId: string | null, productName: string) => void
  label?: string
  placeholder?: string
  required?: boolean
}

export const ProductAutocomplete: React.FC<ProductAutocompleteProps> = ({
  value,
  onChange,
  label = 'Product',
  placeholder = 'Search product...',
  required = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data } = useProducts()
  const products = data?.products || []

  // Filter products based on search term
  const filteredProducts = products.filter(
    product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Find selected product when value changes
  useEffect(() => {
    if (value) {
      const product = products.find(p => p.id === value)
      if (product) {
        setSearchTerm(product.name)
      }
    } else {
      setSearchTerm('')
    }
  }, [value, products])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (product: Product) => {
    setSearchTerm(product.name)
    setShowDropdown(false)
    onChange(product.id, product.name)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchTerm(newValue)
    setShowDropdown(true)

    if (!newValue) {
      onChange(null, '')
    }
  }

  const handleClear = () => {
    setSearchTerm('')
    setShowDropdown(false)
    onChange(null, '')
  }

  return (
    <div className='space-y-2' ref={dropdownRef}>
      <Label htmlFor='product-autocomplete'>
        {label} {required && '*'}
      </Label>
      <div className='relative'>
        <Input
          id='product-autocomplete'
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className='h-12 text-base pr-8'
          autoComplete='off'
        />
        {searchTerm && (
          <button
            type='button'
            onClick={handleClear}
            className='absolute bg-transparent right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
          >
            ✕
          </button>
        )}

        {showDropdown && filteredProducts.length > 0 && (
          <div className='absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto'>
            {filteredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => handleSelect(product)}
                className='px-4 py-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0'
              >
                <div className='font-medium'>{product.name}</div>
                <div className='text-sm text-gray-500'>SKU: {product.sku}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
