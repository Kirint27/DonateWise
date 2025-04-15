import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from '../Dashboard'; // adjust path as needed
import '@testing-library/jest-dom';

global.fetch = jest.fn();

describe('Dashboard component (API Call Test)', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('displays goal amount of £500.00 for logged-in user', async () => {
    const user = { userId: 26 };

    // Mock all relevant API calls
    fetch.mockImplementation((url) => {
      if (url.includes('/goal-amount')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ goalAmount: 500.0 }),
        });
      }

      if (url.includes('/recent-donations')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    const { getByText } = render(
      <Router>
        <Dashboard user={user} />
      </Router>
    );

    await waitFor(() => {
      // Look for the exact rendered text from CustomProgressBar
      expect(getByText('Goal: £500.00')).toBeInTheDocument();
    });
  });
});
  