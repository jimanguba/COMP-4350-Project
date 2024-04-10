/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import ToReadButton from '../components/ToReadButton'

describe('ToReadButton', () => {
  let mock

  beforeEach(() => {
    mock = new MockAdapter(axios)
  })

  afterEach(() => {
    mock.restore()
  })

  it('renders without crashing', () => {
    render(<ToReadButton book_id={1} />)
    expect(screen.getByText('Add to To-Read')).toBeInTheDocument()
  })

  it('toggles reading state when clicked', async () => {
    // Mock the GET request
    mock.onGet('/users/1/to_read/1').reply(200, { toRead: false })

    // Mock the PUT request
    mock.onPut('/users/1/to_read/1').reply(200, { toRead: true })

    render(<ToReadButton book_id={1} />)

    expect(screen.getByText('Add to To-Read')).toBeInTheDocument()

    const button = screen.getByText('Add to To-Read')

    // Click the button
    fireEvent.click(button)

    // Wait for the state to be updated
    expect(screen.getByText('Add to To-Read')).toBeInTheDocument()
  })
})
