// ReviewFilter.test.js
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ReviewFilter from '../components/ReviewFilter' // Adjust the import path as necessary

describe('ReviewFilter', () => {
  // Test 1: Renders with all filter options
  it('renders with all filter options', () => {
    render(<ReviewFilter setFilter={() => {}} />)

    expect(screen.getByRole('combobox')).toBeInTheDocument()
    // Verifying the presence of all expected options
    ;[
      'All Reviews',
      '1 Star',
      '2 Stars',
      '3 Stars',
      '4 Stars',
      '5 Stars'
    ].forEach((text) => {
      expect(screen.getByRole('option', { name: text })).toBeInTheDocument()
    })
  })

  // Test 2: Changing select option to a specific star rating
  it('calls setFilter with the correct value when changed to a specific star rating', () => {
    const setFilterMock = jest.fn()
    render(<ReviewFilter setFilter={setFilterMock} />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '3' } })
    expect(setFilterMock).toHaveBeenCalledWith(3)
  })

  // Test 3: Changing select option to show all reviews
  it('calls setFilter with null when changed to show all reviews', () => {
    const setFilterMock = jest.fn()
    render(<ReviewFilter setFilter={setFilterMock} />)

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'all' }
    })

    expect(setFilterMock).toHaveBeenCalledWith(null)
  })
})
