import React, { useState, useEffect, useRef } from 'react'
import { Label } from '@/components/ui/label'
import { useAuctionHouses } from '@/hooks/useAuctionHouses'
import { AuctionHouse } from '@/api/types'
import { ChevronDown } from 'lucide-react'

interface AuctionHouseAutocompleteProps {
  value: string | null | undefined
  onChange: (auctionHouseId: string | undefined) => void
  label?: string
  placeholder?: string
  required?: boolean
}

export const AuctionHouseAutocomplete: React.FC<AuctionHouseAutocompleteProps> = ({
  value,
  onChange,
  label = 'Auction Name',
  placeholder = 'Select auction name...',
  required = false,
}) => {
  const [selectedName, setSelectedName] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data } = useAuctionHouses()
  const auctionHouses = data?.auctionHouses || []

  // Find selected auction house when value changes
  useEffect(() => {
    if (value) {
      const auctionHouse = auctionHouses.find(ah => ah.id === value)
      if (auctionHouse) {
        setSelectedName(auctionHouse.name)
      }
    } else {
      setSelectedName('')
    }
  }, [value, auctionHouses])

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

  const handleSelect = (auctionHouse: AuctionHouse) => {
    setSelectedName(auctionHouse.name)
    setShowDropdown(false)
    onChange(auctionHouse.id)
  }

  return (
    <div className='space-y-2' ref={dropdownRef}>
      <Label className='text-md' htmlFor='auction-house-autocomplete'>
        {label} {required && '*'}
      </Label>
      <div className='relative'>
        <button
          type='button'
          id='auction-house-autocomplete'
          onClick={() => setShowDropdown(!showDropdown)}
          className='w-full h-12 px-3 text-base text-left bg-white border border-gray-300 rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between'
        >
          <span className={selectedName ? 'text-gray-900' : 'text-gray-400'}>{selectedName || placeholder}</span>
          <ChevronDown className='h-4 w-4 text-gray-400' />
        </button>

        {showDropdown && auctionHouses.length > 0 && (
          <div className='absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto'>
            {auctionHouses.map(auctionHouse => (
              <div
                key={auctionHouse.id}
                onClick={() => handleSelect(auctionHouse)}
                className='px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0'
              >
                <div className='flex items-center justify-between'>
                  <div className='font-medium text-gray-900'>{auctionHouse.name}</div>
                  <div className='text-sm text-gray-600 font-semibold'>
                    {(auctionHouse.commissionRate * 100).toFixed(0)}% commission
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
