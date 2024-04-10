import React from 'react'
import { render, waitFor } from '@testing-library/react'
import axios from 'axios'
import StatisticsYear from '../components/StatisticsYear'
import { API_URL } from '../proxy'

jest.mock('axios')

describe('StatisticsYear component', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    console.error.mockRestore()
  })

  it('renders correctly with average reading time and rating', async () => {
    const mockAverageTime = { data: { average_time: 60 } }
    const mockAverageRating = { data: { average_rating: 3.5 } }

    axios.get.mockResolvedValueOnce(mockAverageTime)
    axios.get.mockResolvedValueOnce(mockAverageRating)

    const { getByText, getByAltText } = render(<StatisticsYear userid={1} />)

    await waitFor(() => {
      expect(
        getByText('Your average reading time is 60 minutes')
      ).toBeInTheDocument()
      expect(getByText('Your average book rating is 3.50')).toBeInTheDocument()
      expect(getByAltText('Book')).toBeInTheDocument()
    })

    // Check if API requests were made with the correct URLs
    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/books/1/average_time`)
    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/users/1/average_rating`)

    // Check if API requests were made only once
    expect(axios.get).toHaveBeenCalledTimes(2)
  })

  it('logs errors to console if fetching data fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch average time'))
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch average rating'))

    render(<StatisticsYear userid={1} />)

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching average reading time:',
        new Error('Failed to fetch average time')
      )
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching average rating:',
        new Error('Failed to fetch average rating')
      )
    })

    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/books/1/average_time`)
    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/users/1/average_rating`)

    expect(axios.get).toHaveBeenCalledTimes(2)
  })
})
