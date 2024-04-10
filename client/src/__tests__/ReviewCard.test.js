/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import ReviewCard from '../components/ReviewCard' // Adjust the import path according to your project structure
import { API_URL } from '../proxy'

describe('ReviewCard', () => {
  const reviewMock = {
    reviewid: 'review123', // Add review_id to match your component logic
    userid: 'user123',
    reviewTitle: 'Great Product',
    rating: 5,
    verifiedPurchase: true,
    comment: 'This product is amazing!',
    tags: ['Durable', 'Stylish'],
    reviewDate: '2023-01-01'
  }

  it('renders correctly with a given review', async () => {
    const mockAxios = new MockAdapter(axios)
    // Mocking the user name fetching
    mockAxios.onGet(`${API_URL}/user/${reviewMock.userid}`).reply(200, 'John Doe')
    // Mocking the replies fetching
    mockAxios.onGet(`${API_URL}/reviews/${reviewMock.reviewid}/replies`).reply(200, [
      {
        reply_text: 'Thanks for your feedback!',
        user_id: 'user456',
        reply_date: '2023-01-02'
      }
    ])

    render(<ReviewCard review={reviewMock} addReply={() => {}} />)

    // You might need to wait for the replies to be fetched and rendered
    await waitFor(() =>
      expect(screen.getByText('Thanks for your feedback!')).toBeInTheDocument()
    )
  })

  it('fetches and displays the username correctly', async () => {
    const mockAxios = new MockAdapter(axios)
    mockAxios.onGet(`${API_URL}/user/${reviewMock.userid}`).reply(200, 'John Doe')

    render(<ReviewCard review={reviewMock} addReply={() => {}} />)

    await waitFor(() =>
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    )
  })

  it('toggles the reply form when the reply button is clicked', () => {
    render(<ReviewCard review={reviewMock} addReply={() => {}} />)

    const replyButton = screen.getByText('Reply')
    fireEvent.click(replyButton)
    expect(screen.getByText('Submit Reply')).toBeInTheDocument() // Assuming "Submit Reply" is a text in your ReplyForm component

    fireEvent.click(replyButton)
    expect(screen.queryByText('Submit Reply')).not.toBeInTheDocument() // Form should be hidden now
  })
})
