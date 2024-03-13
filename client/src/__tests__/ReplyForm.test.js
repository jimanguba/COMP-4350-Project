/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReplyForm from '../components/ReplyForm';

describe('ReplyForm', () => {
  it('renders the reply form with a textarea and a submit button', () => {
    render(<ReplyForm submitReply={() => {}} />);
    
    // Check if textarea is in the document
    expect(screen.getByPlaceholderText('Write a reply...')).toBeInTheDocument();
    // Check if submit button is in the document
    expect(screen.getByRole('button', { name: 'Submit Reply' })).toBeInTheDocument();
  });

  it('allows typing in the textarea', () => {
    render(<ReplyForm submitReply={() => {}} />);
    
    const textarea = screen.getByPlaceholderText('Write a reply...');
    fireEvent.change(textarea, { target: { value: 'This is a test reply' } });
    
    expect(textarea.value).toBe('This is a test reply');
  });

  it('calls submitReply with the textarea value when the form is submitted', () => {
    const mockSubmitReply = jest.fn();
    render(<ReplyForm submitReply={mockSubmitReply} />);
    
    const textarea = screen.getByPlaceholderText('Write a reply...');
    const submitButton = screen.getByRole('button', { name: 'Submit Reply' });
    
    // Simulate user typing in the textarea
    fireEvent.change(textarea, { target: { value: 'This is a test reply' } });
    // Simulate form submission
    fireEvent.click(submitButton);
    
    // Check if mockSubmitReply was called with the correct argument
    expect(mockSubmitReply).toHaveBeenCalledWith('This is a test reply');
  });
});
