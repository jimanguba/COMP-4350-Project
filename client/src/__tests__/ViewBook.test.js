/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ViewBook from '../components/ViewBook';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('ViewBook', () => {

    // Set up mock for axios
    let mock;
    beforeEach(() => {
        mock = new MockAdapter(axios);
    });
    afterEach(() => {
        mock.restore();
    });

    it('displays loading state', () => {
        render(
            <MemoryRouter initialEntries={['/view-book/1']}>
                <ViewBook />
            </MemoryRouter>
        );
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });

    it('renders ViewBook component without valid book ID', async () => {
        mock.onGet('/book/undefined').reply(404);
    
        render(
            <MemoryRouter initialEntries={[`/view-book/undefined`]}>
                <Routes>
                    <Route path="/view-book/:book_id" element={<ViewBook />}/>
                </Routes>
            </MemoryRouter>
        );
    
        expect(await screen.findByText(/No book selected/i)).toBeInTheDocument();
    });

    it('displays no book when API call fails', async () => {
        mock.onGet('/book/1').reply(500);

        render(
            <MemoryRouter initialEntries={[`/view-book/1`]}>
                <Routes>
                    <Route path="/view-book/:book_id" element={<ViewBook />}/>
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText(/No book selected/i)).toBeInTheDocument());
    });

    it('renders ViewBook component with book details and displays BookDetailsCard', async () => {
        const book = { id: 1, title: 'Test Book', author: 'Test Author', pages: 100, genre: 'Test Genre' };
        mock.onGet(`/book/${book.id}`).reply(200, { book, reviews: [] });

        render(
            <MemoryRouter initialEntries={[`/view-book/${book.id}`]}>
                <Routes>
                    <Route path="/view-book/:book_id" element={<ViewBook />}/>
                </Routes>
            </MemoryRouter>
        );

        // Wait for the book to be fetched and the state to be updated
        await waitFor(() => expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument());

        // Check that the book details are displayed in the BookDetailsCard
        expect(screen.getByText(/Test Book/i)).toBeInTheDocument();
        expect(screen.getByText(/Author/i)).toBeInTheDocument();
        expect(screen.getByText(/Pages/i)).toBeInTheDocument();
        expect(screen.getByText(/Genre/i)).toBeInTheDocument();
    });
});





