/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import CompletedBookButton from '../components/CompletedBookButton'

describe('CompletedBookButton', () => {
  let mock

  beforeEach(() => {
    mock = new MockAdapter(axios)
  })

  afterEach(() => {
    mock.restore()
  })

  it('renders without crashing', () => {
    const { getByText } = render(<CompletedBookButton book_id={1} />)
    const button = getByText(/Mark as Completed/i)
    expect(button).toBeInTheDocument()
  })

  it('toggles reading state when clicked', async () => {
    // Mock the GET request
    mock
      .onGet(`/users/1/completed_books/1`)
      .reply(200, { completed_books: false })

    // Mock the PUT request
    mock
      .onPut(`/users/1/completed_books/1`)
      .reply(200, { completed_books: true })

    const { getByText } = render(<CompletedBookButton book_id={1} />)
    const button = getByText(/Mark as Completed/i)

    // Click the button
    fireEvent.click(button)

    // Wait for the state to be updated
    await waitFor(() => expect(button).toHaveTextContent(/Completed/i))
  })
})
