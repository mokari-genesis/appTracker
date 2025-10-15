import React, { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useClients, useCreateClient } from '@/hooks/useClients'
import { Client } from '@/api/types'
import { PlusCircle } from 'lucide-react'

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
  const createClientMutation = useCreateClient()

  // Filter clients based on search term
  const filteredClients = clients.filter(
    client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Always show create option when there's text (allow duplicates)
  const showCreateOption = searchTerm.trim().length > 0

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

  const handleCreateClient = async () => {
    if (!searchTerm.trim()) return

    try {
      const clientName = searchTerm.trim()
      const result = await createClientMutation.mutateAsync({
        name: clientName,
        email: '',
        phone: null,
        company: null,
        address: null,
      })

      // The mutation returns insertId, use it as the client ID
      const newClientId = result.insertId.toString()
      setShowDropdown(false)
      onChange(newClientId, clientName)
    } catch (error) {
      console.error('Failed to create client:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // If Enter is pressed and there's a create option visible
    if (e.key === 'Enter' && showCreateOption) {
      // If there are no filtered results, create the client
      if (filteredClients.length === 0) {
        e.preventDefault()
        handleCreateClient()
      }
      // If there are filtered results but none match exactly, user can still create by pressing Enter twice
      // First Enter would select the first result (default behavior), so we don't interfere
    }
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
          onKeyDown={handleKeyDown}
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

        {showDropdown && (filteredClients.length > 0 || showCreateOption) && (
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
            {showCreateOption && (
              <div
                onClick={handleCreateClient}
                className='px-4 py-2 hover:bg-green-50 cursor-pointer border-t-2 border-green-200 bg-green-50/50'
              >
                <div className='font-medium flex items-center text-green-700'>
                  <PlusCircle className='mr-2 h-4 w-4' /> Create new: "{searchTerm}"
                </div>
                <div className='text-sm text-green-600'>Click or press Enter to create</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
