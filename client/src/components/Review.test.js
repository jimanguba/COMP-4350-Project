import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ReviewsList from './ReviewList.js';
import ReviewForm from './ReviewForm.js';
import ReviewCard from './ReviewCard.js';
import ReplyForm from './ReplyForm.js';

describe('Reviews Feature', () => {
    let initialReview;

    beforeEach(() => {
        initialReview = {
            reviewer: "Jamie Lannister",
            rating: 5,
            date: "Reviewed in the United Kingdom on August 15, 2024",
            content: "The Night Circus is a stunning feat of imagination...",
            verifiedPurchase: true,
            tags: ["Fantasy", "Romance", "Mystery"],
            replies: []
        };
    });

    test('ReviewForm renders correctly', () => {
        render(<ReviewForm addReview={() => {}} />);
        expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your review')).toBeInTheDocument();
        expect(screen.getByText('Submit Review')).toBeInTheDocument();
    });

    test('ReviewCard renders with initial data', () => {
        render(<ReviewCard review={initialReview} addReply={() => {}} />);
        expect(screen.getByText(initialReview.reviewer)).toBeInTheDocument();
        expect(screen.getByText(initialReview.content)).toBeInTheDocument();
        expect(screen.getByText('Reply')).toBeInTheDocument();
    });


    test('Submitting ReviewForm adds a new review', () => {
        const addReviewMock = jest.fn();
        render(<ReviewForm addReview={addReviewMock} />);
        userEvent.type(screen.getByPlaceholderText('Your name'), 'Arya Stark');
        userEvent.type(screen.getByPlaceholderText('Enter your review'), 'A thrilling adventure.');
        userEvent.click(screen.getByText('Submit Review'));
        expect(addReviewMock).toHaveBeenCalledWith(expect.objectContaining({
            reviewer: 'Arya Stark',
            content: 'A thrilling adventure.'
        }));
    });

    test('Toggling genre tags in ReviewForm', () => {
        render(<ReviewForm addReview={() => {}} />);
        
        const fantasyButton = screen.getByText('Fantasy');
        
        fireEvent.click(fantasyButton);
        
        expect(fantasyButton).toHaveClass('selected');
        
        fireEvent.click(fantasyButton);
        
        expect(fantasyButton).not.toHaveClass('selected');
    });    

    test('ReviewCard displays verified purchase when true', () => {
        render(<ReviewCard review={{...initialReview, verifiedPurchase: true}} addReply={() => {}} />);
        
        // Find the icon with the faCheckCircle class
        const verifiedPurchaseIcon = screen.getByTestId('verified-purchase-icon');
        
        // Assert that the icon is in the document
        expect(verifiedPurchaseIcon).toBeInTheDocument();
    });
    
    

    test('ReviewCard does not display verified purchase when false', () => {
        const { queryByText } = render(<ReviewCard review={{...initialReview, verifiedPurchase: false}} addReply={() => {}} />);
        expect(queryByText('Verified Purchase')).not.toBeInTheDocument();
    });

    test('ReplyForm renders correctly', () => {
        render(<ReplyForm submitReply={() => {}} />);
        expect(screen.getByPlaceholderText('Write a reply...')).toBeInTheDocument();
        expect(screen.getByText('Submit Reply')).toBeInTheDocument();
    });

    test('Submitting ReplyForm calls submitReply with reply text', () => {
        const submitReplyMock = jest.fn();
        render(<ReplyForm submitReply={submitReplyMock} />);
        userEvent.type(screen.getByPlaceholderText('Write a reply...'), 'A fascinating read.');
        userEvent.click(screen.getByText('Submit Reply'));
        expect(submitReplyMock).toHaveBeenCalledWith('A fascinating read.');
    });

    test('ReviewsList initializes with default review', () => {
        render(<ReviewsList />);
        expect(screen.getByText(initialReview.reviewer)).toBeInTheDocument();
        expect(screen.getByText(/The Night Circus is a stunning feat of imagination/i)).toBeInTheDocument();
    });




    test('ReviewCard shows all tags for a review', () => {
        render(<ReviewCard review={initialReview} addReply={() => {}} />);
        initialReview.tags.forEach(tag => {
            expect(screen.getByText(tag)).toBeInTheDocument();
        });
    });


});

