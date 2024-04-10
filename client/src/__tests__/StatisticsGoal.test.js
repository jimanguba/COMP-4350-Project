import React from 'react'
import { render, waitFor } from '@testing-library/react'
import axios from 'axios'
import StatisticsGoal from '../components/StatisticsGoal'

jest.mock('axios')

describe('StatisticsGoal component', () => {
  it('renders correctly with user data and reading progress', async () => {
    const mockUserData = { data: { bookgoal: 10, username: 'Test User' } }
    const mockReadingProgress = { data: [{ count: 5 }] }

    axios.get.mockResolvedValueOnce(mockUserData)
    axios.get.mockResolvedValueOnce(mockReadingProgress)

    render(<StatisticsGoal userid={1} />)

    await waitFor(() => {
      expect(document.body).toHaveTextContent("Test User's Reading Statistics")
      expect(document.body).toHaveTextContent(
        "Your Yearly Reading Goal: Keep going! You're 50% there!"
      )
      expect(document.body).toHaveTextContent('5 out of 10 books completed')
    })
  })

  it('displays error message if reading data fetch fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch data'))

    const { getByText } = render(<StatisticsGoal user_id={1} />)

    await waitFor(() => {
      expect(getByText('Failed to fetch data')).toBeInTheDocument()
    })
  })
})
