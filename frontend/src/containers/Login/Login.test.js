import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import Login from "./login";
import { useHistory } from "react-router-dom";  // Mock react-router's useHistory

// Mock the useHistory hook
jest.mock("react-router-dom", () => ({
  useHistory: jest.fn(),
}));

describe("Login tests", () => {
  beforeEach(() => {
    // Reset mocks before each test
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );
    useHistory.mockReturnValue({ push: jest.fn() }); // Mock the history push method
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should navigate to dashboard when password is correct", async () => {
    const { getByText, getByPlaceholderText } = render(<Login />);
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Enter password");
    const loginButton = getByText("Login");

    fireEvent.change(emailInput, {
      target: { value: process.env.REACT_APP_TEST_EMAIL },
    });
    fireEvent.change(passwordInput, {
      target: { value: process.env.REACT_APP_TEST_PASSWORD },
    });
    fireEvent.click(loginButton);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    // Check that the fetch is called with correct data
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3001/api/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: process.env.REACT_APP_TEST_EMAIL,
          password: process.env.REACT_APP_TEST_PASSWORD,
        }),
        credentials: "include",
      }
    );

    // Check if useHistory's push was called to navigate to the dashboard
    const historyPush = useHistory().push;
    await waitFor(() => expect(historyPush).toHaveBeenCalledWith("/dashboard"));
  });
});
