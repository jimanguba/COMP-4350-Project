/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import BookDetailsCard from "../components/BookDetailsCard";

describe("BookDetailsCard", () => {
  it("renders BookDetailsCard with default values", () => {
    const book = {
      title: "Sample Book Title",
      author: "Sample Author",
      pages: 200,
      genre: "Fiction",
    };

    render(<BookDetailsCard book={book} />);
    expect(screen.getByLabelText(/title/i)).toHaveValue("Sample Book Title");
    expect(screen.getByLabelText(/author/i)).toHaveValue("Sample Author");
    expect(screen.getByLabelText(/pages/i)).toHaveValue(200);
    expect(screen.getByLabelText(/genre/i)).toHaveValue("Fiction");
    expect(screen.getByText("Edit Book Details")).toBeInTheDocument();
  });

  it("edits BookDetailsCard and submits changes", async () => {
    const book = {
      title: "Sample Book Title",
      author: "Sample Author",
      pages: 200,
      genre: "Fiction",
    };

    const updateBookDetailsMock = jest.fn();

    render(<BookDetailsCard book={book} />);
    fireEvent.click(screen.getByText("Edit Book Details"));
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "New Title" },
    });
    fireEvent.change(screen.getByLabelText(/author/i), {
      target: { value: "New Author" },
    });
    fireEvent.change(screen.getByLabelText(/pages/i), {
      target: { value: "300" },
    });
    fireEvent.change(screen.getByLabelText(/genre/i), {
      target: { value: "New Genre" },
    });
    fireEvent.click(screen.getByText("Submit Changes"));

    await waitFor(() => {
      expect(screen.getByText("Edit Book Details")).toBeInTheDocument();
    });
  });
});
