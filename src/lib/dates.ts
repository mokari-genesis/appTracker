import { format } from 'date-fns'

/**
 * Formats a date string (YYYY-MM-DD or ISO format) to a readable format
 * Handles timezone issues by parsing the date in local timezone
 * @param dateString - Date string in YYYY-MM-DD or ISO format
 * @param formatString - Format string for date-fns (default: 'MMM dd, yyyy')
 * @returns Formatted date string or '--' if date is invalid
 */
export function formatDateLocal(dateString: string | null | undefined, formatString: string = 'MMM dd, yyyy'): string {
  if (!dateString) return '--'
  
  try {
    // Extract YYYY-MM-DD from ISO string or use as is
    const dateStr = dateString.split('T')[0]
    const [year, month, day] = dateStr.split('-')
    
    // Create date in local timezone to avoid timezone offset issues
    const date = new Date(Number(year), Number(month) - 1, Number(day))
    
    return format(date, formatString)
  } catch (error) {
    return '--'
  }
}

/**
 * Converts a date string to YYYY-MM-DD format for input fields
 * @param dateString - Date string in any format
 * @returns Date string in YYYY-MM-DD format or empty string
 */
export function toInputDateFormat(dateString: string | null | undefined): string {
  if (!dateString) return ''
  
  try {
    // If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString
    }
    
    // Extract YYYY-MM-DD from ISO string
    return dateString.split('T')[0]
  } catch (error) {
    return ''
  }
}

/**
 * Gets today's date in YYYY-MM-DD format
 * @returns Today's date as YYYY-MM-DD string
 */
export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0]
}
