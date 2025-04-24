import React from "react";
import { render } from "@testing-library/react";
import ResetPassword from "./ResetPassword";

describe("ResetPassword tests", () => {
  it("should render", () => {
    expect(render(<ResetPassword />)).toBeTruthy();
  });
});
