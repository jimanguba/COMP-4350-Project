/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BookCoverCard from '../components/BookCoverCard'

describe('BookCoverCard', () => {
  it('renders BookCoverCard with default "small" size', () => {
    const book = {
      title: 'Sample Book Title'
    }

    render(<BookCoverCard book={book} />)
    expect(screen.getByText('Sample Book Title')).toBeInTheDocument()
    expect(screen.getByTestId('book-cover-card')).toHaveClass('small')
  })

  it('renders BookCoverCard with "large" size', () => {
    const book = {
      title: 'Sample Book Title'
    }

    render(<BookCoverCard book={book} size="large" />)
    expect(screen.getByText('Sample Book Title')).toBeInTheDocument()
    expect(screen.getByTestId('book-cover-card')).toHaveClass('large')
  })

  it('renders BookCoverCard with untitled book', () => {
    const book = {}

    render(<BookCoverCard book={book} />)
    expect(screen.getByText('Untitled')).toBeInTheDocument()
  })
})
