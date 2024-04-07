import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ReviewDateFilter from "../components/ReviewDateFilter"; // Adjust the import path to where your component is located

describe("ReviewDateFilter", () => {
  // Test 1: Renders with all date filter options
  it("renders with all date filter options", () => {
    render(<ReviewDateFilter setDateFilter={() => {}} />);

    // Check for the select element and its default value
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "All Dates" }).selected).toBe(
      true,
    );

    // Verify all options are present
    ["All Dates", "Last 24 hours", "Last week", "Last month"].forEach(
      (optionText) => {
        expect(
          screen.getByRole("option", { name: optionText }),
        ).toBeInTheDocument();
      },
    );
  });

  // Test 2: Changing select option to "Last 24 hours"
  it('calls setDateFilter with "1" when changed to "Last 24 hours"', () => {
    const setDateFilterMock = jest.fn();
    render(<ReviewDateFilter setDateFilter={setDateFilterMock} />);

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "1" } });

    expect(setDateFilterMock).toHaveBeenCalledWith("1");
  });

  // Test 3: Changing select option to "Last month"
  it('calls setDateFilter with "30" when changed to "Last month"', () => {
    const setDateFilterMock = jest.fn();
    render(<ReviewDateFilter setDateFilter={setDateFilterMock} />);

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "30" } });

    expect(setDateFilterMock).toHaveBeenCalledWith("30");
  });
});
