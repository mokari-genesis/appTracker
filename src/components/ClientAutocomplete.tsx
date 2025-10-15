import React, { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useClients } from '@/hooks/useClients'
import { Client } from '@/api/types'

interface ClientAutocompleteProps {
  value: string | null
  onChange: (clientId: string | null, clientName: string) => void
  label?: string
  placeholder?: string
  required?: boolean
}

export const ClientAutocomplete: React.FC<ClientAutocompleteProps> = ({
  value,
  onChange,
  label = 'Client',
  placeholder = 'Search client...',
  required = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data } = useClients()
  const clients = data?.clients || []

  // Filter clients based on search term
  const filteredClients = clients.filter(
    client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Find selected client when value changes
  useEffect(() => {
    if (value) {
      const client = clients.find(c => c.id === value)
      if (client) {
        setSearchTerm(client.name)
      }
    } else {
      setSearchTerm('')
    }
  }, [value, clients])

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

  const handleSelect = (client: Client) => {
    setSearchTerm(client.name)
    setShowDropdown(false)
    onChange(client.id, client.name)
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
      <Label htmlFor='client-autocomplete'>
        {label} {required && '*'}
      </Label>
      <div className='relative'>
        <Input
          id='client-autocomplete'
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

        {showDropdown && filteredClients.length > 0 && (
          <div className='absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto'>
            {filteredClients.map(client => (
              <div
                key={client.id}
                onClick={() => handleSelect(client)}
                className='px-4 py-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0'
              >
                <div className='font-medium'>{client.name}</div>
                <div className='text-sm text-gray-500'>
                  {client.email}
                  {client.company && ` • ${client.company}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
