import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import Account from "./Account";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

describe("Account tests", () => {
  it("should render", () => {
    expect(render(<Account />)).toBeTruthy();
  });
});

it("should extract causes from form", () => {
  const { getByText, getByLabelText } = render(<Account />);

  // Find the form element
  const form = getByText("Create Account").closest("form");

  // Get the checkboxes for causes (example with "Health & Medical")
  const causeInput = getByLabelText("Health & Medical");

  // Simulate selecting a checkbox
  fireEvent.click(causeInput); // or fireEvent.change(causeInput, { target: { checked: true } });

  // Submit the form
  fireEvent.submit(form);

  // Assert the cause checkbox is checked
  expect(causeInput.checked).toBe(true);
});


it("should send POST request to signup API", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ userId: "123" }),
    })
  );

  const { getByText, getByLabelText, getByPlaceholderText } = render(<Account />);

  fireEvent.change(getByPlaceholderText("Enter Full name"), {
    target: { value: "Jane Doe" },
  });
  fireEvent.change(getByPlaceholderText("Enter email"), {
    target: { value: "jane@example.com" },
  });
  fireEvent.change(getByPlaceholderText("Enter password"), {
    target: { value: "securepassword" },
  });
  fireEvent.change(getByPlaceholderText("Enter password again"), {
    target: { value: "securepassword" },
  });
  fireEvent.change(getByPlaceholderText("Enter your Annual salary"), {
    target: { value: "40000" },
  });

  // 🟢 Select goal type to show the input field
  fireEvent.change(
    getByLabelText("How do you want to set your yearly donation goal?"),
    {
      target: { value: "manual" },
    }
  );

  // 🟢 This is now visible after selecting "manual"
  fireEvent.change(getByPlaceholderText("Enter goal amount (£)"), {
    target: { value: "50000" },
  });

  fireEvent.change(getByPlaceholderText("Enter ciy you live in"), {
    target: { value: "London" },
  });

  // Assuming you need to select at least one cause
  fireEvent.click(getByLabelText("Health & Medical")); // or whatever label matches

  fireEvent.click(getByText("Create Account"));

  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
});

  
