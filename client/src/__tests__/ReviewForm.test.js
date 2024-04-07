/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import ReviewForm from '../components/ReviewForm' // Update the path as necessary

// Mocking the universal-cookie module
jest.mock('universal-cookie')

// Setup for axios mock
const mockAxios = new MockAdapter(axios)
const mockAddReview = jest.fn()

describe('ReviewForm', () => {
  beforeEach(() => {
    // Reset mock calls before each test
    mockAxios.reset()
    mockAddReview.mockReset()
  })

  it('renders the review form correctly', () => {
    render(<ReviewForm addReview={mockAddReview} bookId="1" />)
    expect(screen.getByPlaceholderText('Review Title')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your review')).toBeInTheDocument()
    // Using querySelectorAll to select by class name as a workaround
    expect(document.querySelectorAll('.star').length).toBe(5)
    expect(screen.getByText('Submit Review')).toBeInTheDocument()
  })

  it('submits a review with valid data', async () => {
    mockAxios.onPost('/reviews/new').reply(200, {
      message: 'Review added successfully'
    })

    const bookId = '1'
    render(<ReviewForm addReview={mockAddReview} bookId={bookId} />)

    fireEvent.change(screen.getByPlaceholderText('Review Title'), {
      target: { value: 'Great Book' }
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your review'), {
      target: { value: 'This is a fantastic read!' }
    })
    // Using querySelectorAll to simulate clicking the 4th star
    fireEvent.click(document.querySelectorAll('.star')[3]) // Set rating to 4 stars

    fireEvent.click(screen.getByText('Submit Review'))

    await waitFor(() => {
      expect(mockAddReview).toHaveBeenCalled()
    })
  })
})
