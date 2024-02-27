import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import BookList from './BookList';

jest.mock('axios');

const mockBooks = [
  { book_id: 1, title: 'Sample Book 1' },
  { book_id: 2, title: 'Sample Book 2' },
];

describe('BookList Component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockBooks });
  });

  it('renders a list of books with BookCoverCard components', async () => {
    render(
      <Router>
        <BookList />
      </Router>
    );

    // Wait for the data to be fetched
    await waitFor(() => {
      expect(screen.getByPlaceholderText('search titles...')).toBeInTheDocument();

      mockBooks.forEach((book) => {
        expect(screen.getByText(book.title)).toBeInTheDocument();
      });
    });
  });

  it('filters books based on the search query', async () => {
    render(
      <Router>
        <BookList />
      </Router>
    );

    await waitFor(() => {
      // Type a search query in the input element
      screen.getByPlaceholderText('search titles...').value = 'Book 1';
      screen.getByPlaceholderText('search titles...').dispatchEvent(new Event('input'));

      // Ensure only the matching book is rendered
      expect(screen.queryByText('Book 2')).not.toBeInTheDocument();
    });
  });
});
