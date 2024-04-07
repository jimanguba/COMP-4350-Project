// GenreRecommendations.test.js
import React from 'react'
import axios from 'axios'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import GenreRecommendations from '../components/GenreRecommendations' // Adjust the import path as necessary

// Mocking axios
jest.mock('axios')

// Mocking react-router-dom Link to prevent errors during testing
jest.mock('react-router-dom', () => ({
  Link: ({ children }) => children
}))

describe('GenreRecommendations', () => {
  it('displays a loading message while fetching related books', () => {
    const { getByText } = render(
      <GenreRecommendations genre="Fantasy" currentBookId="1" />
    )
    expect(getByText(/Loading related books.../i)).toBeInTheDocument()
  })

  it('displays a message when no related books are found', async () => {
    axios.get.mockResolvedValueOnce({ data: [] })

    const { getByText } = render(
      <GenreRecommendations genre="Fantasy" currentBookId="1" />
    )

    await waitFor(() => {
      expect(
        getByText(/No related books found in this genre./i)
      ).toBeInTheDocument()
    })
  })

  it('renders related books when data is fetched successfully', async () => {
    const relatedBooks = [
      { book_id: '2', title: 'The Fantasy Book', author: 'Author A' },
      { book_id: '3', title: 'Another Fantasy Book', author: 'Author B' }
    ]

    axios.get.mockResolvedValueOnce({ data: relatedBooks })

    const { getByText } = render(
      <GenreRecommendations genre="Fantasy" currentBookId="1" />
    )

    // Wait for the axios response to be processed and the component to update
    await waitFor(() => {
      relatedBooks.forEach((book) => {
        expect(getByText(book.title)).toBeInTheDocument()
      })
    })
  })
})
