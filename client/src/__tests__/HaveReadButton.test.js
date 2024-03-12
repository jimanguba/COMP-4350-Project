/**
 * Button for adding/removing a book from the user's "to-read"
 * @param {Object} book
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import HaveReadButton from '../components/HaveReadButton';

describe('HaveReadButton', () => {
    let mock;

    beforeEach(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.restore();
    });

    it('renders without crashing', () => {
        const { getByText } = render(<HaveReadButton book_id={1} />);
        const button = getByText(/Mark as Read/i);
        expect(button).toBeInTheDocument();
    });

    it('toggles reading state when clicked', async () => {

        // Mock the GET request
        mock.onGet(`/users/1/have_read/1`).reply(200, { haveRead: false });

        // Mock the PUT request
        mock.onPut(`/users/1/have_read/1`).reply(200, { haveRead: true });

        const { getByText } = render(<HaveReadButton book_id={1} />);
        const button = getByText(/Mark as Read/i);

        // Click the button
        fireEvent.click(button);

        // Wait for the state to be updated
        await waitFor(() => expect(button).toHaveTextContent(/Already Read/i));
    });
});