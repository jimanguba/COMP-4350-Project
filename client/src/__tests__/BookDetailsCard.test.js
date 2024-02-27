import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BookDetailsCard from './BookDetailsCard';

const mockUpdateBookDetails = jest.fn();

const sampleBook = {
  title: 'Sample Title',
  author: 'Sample Author',
  pages: 200,
  genre: 'Sample Genre',
};

describe('BookDetailsCard Component', () => {
  it('renders with book details', () => {
    render(<BookDetailsCard book={sampleBook} updateBookDetails={mockUpdateBookDetails} />);

    expect(screen.getByLabelText('Title')).toHaveValue(sampleBook.title);
    expect(screen.getByLabelText('Author')).toHaveValue(sampleBook.author);
    expect(screen.getByLabelText('Pages')).toHaveValue(sampleBook.pages.toString());
    expect(screen.getByLabelText('Genre')).toHaveValue(sampleBook.genre);

    expect(screen.getByText('Edit Book Details')).toBeInTheDocument();
  });

  it('calls updateBookDetails when "Submit Changes" button is clicked', () => {
    render(<BookDetailsCard book={sampleBook} updateBookDetails={mockUpdateBookDetails} />);

    fireEvent.click(screen.getByText('Edit Book Details'));
    fireEvent.click(screen.getByText('Submit Changes'));

    expect(mockUpdateBookDetails).toHaveBeenCalledWith({
      title: '',
      author: '',
      pages: 0,
      genre: '',
    });
  });

  it('toggles editing mode when "Edit Book Details" button is clicked', () => {
    render(<BookDetailsCard book={sampleBook} updateBookDetails={mockUpdateBookDetails} />);

    fireEvent.click(screen.getByText('Edit Book Details'));

    expect(screen.getByLabelText('Title')).toBeDisabled();
    expect(screen.getByLabelText('Author')).toBeDisabled();
    expect(screen.getByLabelText('Pages')).toBeDisabled();
    expect(screen.getByLabelText('Genre')).toBeDisabled();
    expect(screen.getByText('Submit Changes')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Submit Changes'));

    expect(mockUpdateBookDetails).toHaveBeenCalledWith({
      title: '',
      author: '',
      pages: 0,
      genre: '',
    });
  });
});
