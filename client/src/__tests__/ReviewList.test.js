/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import ReviewsList from '../components/ReviewList'
import ReviewForm from '../components/ReviewForm'
import ReviewFilter from '../components/ReviewFilter'

// Mock data for initial reviews
const mockReviews = [
  { id: 1, rating: 5, comment: 'Great book!', replies: [] },
  { id: 2, rating: 4, comment: 'Enjoyable read.', replies: [] },
  { id: 3, rating: 3, comment: 'Average read.', replies: [] },
]

describe('ReviewsList', () => {
  it('renders correctly with initial reviews', () => {
    render(<ReviewsList reviews={mockReviews} bookId="1" />)

    // Check for the presence of initial reviews
    expect(screen.getByText('Great book!')).toBeInTheDocument()
    expect(screen.getByText('Enjoyable read.')).toBeInTheDocument()
    expect(screen.getByText('Average read.')).toBeInTheDocument()

    // Check for the presence of the ReviewFilter component by its select element
    expect(screen.getByText('All Reviews')).toBeInTheDocument()
  })

  // Assuming you have a ReviewsList component that uses ReviewFilter internally
  // and ReviewFilter has a select element for filtering reviews by rating

  it('filters reviews based on star rating', async () => {
    render(<ReviewsList reviews={mockReviews} bookId="1" />)

    // Get all elements with the role of combobox
    const comboboxes = screen.getAllByRole('combobox')

    // Assuming the first combobox is the one we want to interact with
    const ratingFilterSelect = comboboxes[0] // Adjust the index based on your actual layout

    // Change the select value to filter for 5-star reviews
    fireEvent.change(ratingFilterSelect, { target: { value: '5' } })

    // Wait for the UI to update based on the filter change
    await waitFor(() => {
      expect(screen.getByText('Great book!')).toBeInTheDocument()
      expect(screen.queryByText('Enjoyable read.')).not.toBeInTheDocument()
      expect(screen.queryByText('Average read.')).not.toBeInTheDocument()
    })
  })
})
