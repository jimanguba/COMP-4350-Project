/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import BookList from '../pages/BookList'
import { MemoryRouter } from 'react-router-dom'

describe('BookList', () => {
  let mock

  beforeEach(() => {
    mock = new MockAdapter(axios)
  })

  afterEach(() => {
    mock.restore()
  })

  it('renders a list of books', async () => {
    const mockedBooks = [
      {
        book_id: 1,
        title: 'Book 1',
        author: 'Author 1',
        pages: 200,
        genre: 'Fiction',
      },
      {
        book_id: 2,
        title: 'Book 2',
        author: 'Author 2',
        pages: 250,
        genre: 'Non-fiction',
      },
    ]
    mock.onGet('/books').reply(200, mockedBooks)

    render(
      <MemoryRouter>
        <BookList type={'all'} />
      </MemoryRouter>,
    )

    // Waiting for books to be fetched and displayed
    await waitFor(() => {
      expect(screen.getByText('Book 1')).toBeInTheDocument()
    })
  })

  it('filters books based on search query', async () => {
    const mockedBooks = [
      {
        book_id: 1,
        title: 'Book 1',
        author: 'Author 1',
        pages: 200,
        genre: 'Fiction',
      },
      {
        book_id: 2,
        title: 'Book 2',
        author: 'Author 2',
        pages: 250,
        genre: 'Non-fiction',
      },
    ]
    mock.onGet('/books').reply(200, mockedBooks)

    render(
      <MemoryRouter>
        <BookList type={'all'} />
      </MemoryRouter>,
    )

    // Waiting for books to be fetched and displayed
    await waitFor(() => {
      expect(screen.getByText('Book 1')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('search titles...')
    fireEvent.change(searchInput, { target: { value: 'Book 1' } })

    expect(screen.getByText('Book 1')).toBeInTheDocument()
    expect(screen.queryByText('Book 2')).not.toBeInTheDocument()
  })

  it('renders compeleted book list page', async () => {
    render(
      <MemoryRouter>
        <BookList type={'completed'} />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getAllByText('Completed Books')).length >= 2
    })
  })

  it('renders to-read book list page', async () => {
    render(
      <MemoryRouter>
        <BookList type={'to-read'} />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText('Want To Read')).toBeInTheDocument()
    })
  })
})
