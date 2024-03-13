/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ReviewCard from '../components/ReviewCard'; // Adjust the import path according to your project structure

describe('ReviewCard', () => {
  const reviewMock = {
    user_id: 'user123',
    review_title: 'Great Product',
    rating: 5,
    verifiedPurchase: true,
    comment: 'This product is amazing!',
    tags: ['Durable', 'Stylish'],
    replies: ['Thanks for your feedback!'],
    review_date: '2023-01-01',
  };

  it('renders correctly with a given review', () => {
    render(<ReviewCard review={reviewMock} addReply={() => {}} />);
    expect(screen.getByText('Great Product')).toBeInTheDocument();
    expect(screen.getByText('This product is amazing!')).toBeInTheDocument();
    expect(screen.getAllByTestId('star').length).toBe(5);
    expect(screen.getByText('Durable')).toBeInTheDocument();
    expect(screen.getByText('Stylish')).toBeInTheDocument();
    expect(screen.getByText('Thanks for your feedback!')).toBeInTheDocument();
  });
  

  it('fetches and displays the username correctly', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onGet(`/user/${reviewMock.user_id}`).reply(200, 'John Doe');

    render(<ReviewCard review={reviewMock} addReply={() => {}} />);

    await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());
  });

  it('toggles the reply form when the reply button is clicked', () => {
    render(<ReviewCard review={reviewMock} addReply={() => {}} />);

    const replyButton = screen.getByText('Reply');
    fireEvent.click(replyButton);
    expect(screen.getByText('Submit Reply')).toBeInTheDocument(); // Assuming "Submit Reply" is a text in your ReplyForm component

    fireEvent.click(replyButton);
    expect(screen.queryByText('Submit Reply')).not.toBeInTheDocument(); // Form should be hidden now
  });
});
