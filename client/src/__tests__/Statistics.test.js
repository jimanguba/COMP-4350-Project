/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Statistics from '../pages/Statistics';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

describe('Statistics', () => {
  it('displays calendar data and book details', async () => {
    const mockAxios = new MockAdapter(axios);
    const mockedCalendarData = [
      { day: '2024-03-21', book: 'Book 1', author: 'Author 1', value: 1 },
      { day: '2024-03-22', book: 'Book 2', author: 'Author 2', value: 2 },
    ];
    mockAxios.onGet('/users/123/calendar-data').reply(200, mockedCalendarData);

    render(
      <MemoryRouter>
        <Statistics user_id={123} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Your Reading Calendar')).toBeInTheDocument();
    });

    const calendarDate = screen.getByText('21').closest('button');
    act(() => {
      calendarDate.click();
    });

    await waitFor(() => {
      expect(screen.getByText('So far this year....')).toBeInTheDocument();
      expect(screen.getByText('21')).toBeInTheDocument();
      expect(screen.getByText('Your Reading Calendar')).toBeInTheDocument();
    });
  });
});
