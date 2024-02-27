import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BookCoverCard from './BookCoverCard';

const sampleBook = {
  title: 'Sample Title',
};

describe('BookCoverCard Component', () => {
  it('renders with a small size and untitled book when no title is provided', () => {
    render(<BookCoverCard book={{}} size="small" />);

    const titleElement = screen.getByText('Untitled');
    expect(titleElement).toBeInTheDocument();

    const component = screen.getByTestId('book-cover-card');
    expect(component).toHaveClass('bookCoverCard');
    expect(component).toHaveClass('small');
  });

  it('renders with a large size and the provided book title', () => {
    render(<BookCoverCard book={sampleBook} size="large" />);

    const titleElement = screen.getByText(sampleBook.title);
    expect(titleElement).toBeInTheDocument();

    const component = screen.getByTestId('book-cover-card');
    expect(component).toHaveClass('bookCoverCard');
    expect(component).toHaveClass('large');
  });

});
