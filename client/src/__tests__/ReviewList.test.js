/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ReviewsList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import ReviewFilter from '../components/ReviewFilter';

// Mock data for initial reviews
const mockReviews = [
  { id: 1, rating: 5, comment: 'Great book!', replies: [] },
  { id: 2, rating: 4, comment: 'Enjoyable read.', replies: [] },
  { id: 3, rating: 3, comment: 'Average read.', replies: [] }
];

describe('ReviewsList', () => {

  it('renders correctly with initial reviews', () => {
    render(<ReviewsList reviews={mockReviews} bookId="1" />);

    // Check for the presence of initial reviews
    expect(screen.getByText('Great book!')).toBeInTheDocument();
    expect(screen.getByText('Enjoyable read.')).toBeInTheDocument();
    expect(screen.getByText('Average read.')).toBeInTheDocument();

    // Check for the presence of the ReviewFilter component by its select element
    expect(screen.getByText('All Reviews')).toBeInTheDocument();
  });

  it('filters reviews based on star rating', async () => {
    render(<ReviewsList reviews={mockReviews} bookId="1" />);

    // Check that all reviews are initially rendered
    expect(screen.getByText('Great book!')).toBeInTheDocument();
    expect(screen.getByText('Enjoyable read.')).toBeInTheDocument();
    expect(screen.getByText('Average read.')).toBeInTheDocument();

    // Select to filter for only 5-star reviews
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '5' } });

    await waitFor(() => {
      expect(screen.getByText('Great book!')).toBeInTheDocument();
      expect(screen.queryByText('Enjoyable read.')).not.toBeInTheDocument();
      expect(screen.queryByText('Average read.')).not.toBeInTheDocument();
    });
  });

});
