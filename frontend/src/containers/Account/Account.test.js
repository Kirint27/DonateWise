import React from "react";
import { render } from "@testing-library/react";
import Account from "./Account";
import { render, fireEvent, waitFor } from "@testing-library/react";

describe("Account tests", () => {
  it("should render", () => {
    expect(render(<Account />)).toBeTruthy();
  });
});

jest.mock("fetch", () => {
  return jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ userId: "123" }),
    })
  );
});

describe("handleSubmit", () => {
  it("should prevent default form submission", () => {
    const { getByText } = render(<Account />);
    const form = getByText("Create Account").closest("form");
    const event = { preventDefault: jest.fn() };
    fireEvent.submit(form, event);
    expect(event.preventDefault).toHaveBeenCalled(1);
  });

  it("should extract causes from form", () => {
    const { getByText } = render(<Account />);
    const form = getByText("Create Account").closest("form");
    const input = form.querySelector('input[name="causes"]');
    input[0].checked = true;
    const event = { target: form };
    handleSubmit(event);
    expect(event.target.elements.causes[0].checked).toBe(true);
  });

  it("should send POST request to signup API", async () => {
    const { getByText } = render(<Account />);
    const form = getByText("Create Account").closest("form");
    const event = { target: form };
    const handleSubmit = jest.fn();
    handleSubmit(event);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(fetch).toHaveBeenCalledWith("http://localhost:3001/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: expect.any(String),
    });
  });

  it("should set showConfirmation to true", async () => {
    const { getByText } = render(<Account />);
    const form = getByText("Create Account").closest("form");
    const event = { target: form };
    const handleSubmit = jest.fn();
    handleSubmit(event);
    await waitFor(() => expect(setShowConfirmation).toHaveBeenCalledTimes(1));
    expect(setShowConfirmation).toHaveBeenCalledWith(true);
  });
});
