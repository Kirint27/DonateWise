// src/containers/TaxReporting/TaxReporting.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import TaxReporting from "./TaxReporting"; // Adjust based on your project structure
import '@testing-library/jest-dom'; 
beforeEach(() => {
  global.fetch = jest.fn();

  fetch.mockImplementation((url) => {
    if (url === 'http://localhost:3001/api/user') {
      return Promise.resolve({
        json: () => Promise.resolve(loggedInUser), // Mock user data
      });
    } else if (url === 'http://localhost:3001/api/donations/all-donations') {
      return Promise.resolve({
        json: () => Promise.resolve([]), // Simulate empty array for no donations
      });
    }
    return Promise.reject(new Error('Unknown endpoint')); // Handle unexpected calls
  });
});
// Define mock user data
const loggedInUser = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
};

// Sample donations
const currentTaxYearDonations = [
  {
    charityName: "Charity A",
    date: "2023-01-15",
    amount: "100.00",
    paymentMethod: "Credit Card",
    paymentStatus: "Completed"
  },
  {
    charityName: "Charity B",
    date: "2023-02-20",
    amount: "50.00",
    paymentMethod: "PayPal",
    paymentStatus: "Completed"
  }
];

const previousTaxYearDonations = [
  {
    charityName: "Charity C",
    date: "2022-01-15",
    amount: "200.00",
    paymentMethod: "Bank Transfer",
    paymentStatus: "Completed"
  }
];

describe("TaxReporting Component", () => {
  it("renders the header", () => {
    render(<TaxReporting user={loggedInUser} currentTaxYearDonations={[]} previousTaxYearDonations={[]} />);
    expect(screen.getByText(/donation history by financial year/i)).toBeInTheDocument();
  });

  it("displays current tax year donations when present", () => {
    render(<TaxReporting user={loggedInUser} currentTaxYearDonations={currentTaxYearDonations} previousTaxYearDonations={[]} />);
    
    expect(screen.getByText(/current financial year/i)).toBeInTheDocument();
    expect(screen.getByText('Total Donated: £150.00')).toBeInTheDocument();
    expect(screen.getByText("Charity A")).toBeInTheDocument();
    expect(screen.getByText("Charity B")).toBeInTheDocument();
  });

  it("displays previous tax year donations when present", () => {
    render(<TaxReporting user={loggedInUser} currentTaxYearDonations={[]} previousTaxYearDonations={previousTaxYearDonations} />);
    
    expect(screen.getByText(/previous financial year/i)).toBeInTheDocument();
    expect(screen.getByText('Total Donated: £200.00')).toBeInTheDocument();
    expect(screen.getByText("Charity C")).toBeInTheDocument();
  });

  it("does not render current financial year section when no donations", () => {
    render(<TaxReporting user={loggedInUser} currentTaxYearDonations={[]} previousTaxYearDonations={[]} />);
    
    expect(screen.queryByText(/current financial year/i)).not.toBeInTheDocument();
  });

  it("does not render previous financial year section when no donations", () => {
    render(<TaxReporting user={loggedInUser} currentTaxYearDonations={[]} previousTaxYearDonations={[]} />);
    
    expect(screen.queryByText(/previous financial year/i)).not.toBeInTheDocument();
  });
});