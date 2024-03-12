/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ToReadButton from '../components/ToReadButton';

describe('ToReadButton', () => {
    let mock;

    beforeEach(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.restore();
    });

    it('renders without crashing', () => {
        const { getByText } = render(<ToReadButton book_id={1} />);
        const button = getByText(/Add to To-Read/i);
        expect(button).toBeInTheDocument();
    });

    it('toggles reading state when clicked', async () => {

        // Mock the GET request
        mock.onGet(`/users/1/to_read/1`).reply(200, { toRead: false });

        // Mock the PUT request
        mock.onPut(`/users/1/to_read/1`).reply(200, { toRead: true });

        const { getByText } = render(<ToReadButton book_id={1} />);
        const button = getByText(/Add to To-Read/i);

        // Click the button
        fireEvent.click(button);

        // Wait for the state to be updated
        await waitFor(() => expect(button).toHaveTextContent(/Add to To-Read/i));
    });
});