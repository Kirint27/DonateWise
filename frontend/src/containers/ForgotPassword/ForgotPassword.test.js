import React from "react";
import { render } from "@testing-library/react";
import ForgotPassword from "./ForgotPassword";

describe("ForgotPassword tests", () => {
  it("should render", () => {
    expect(render(<ForgotPassword />)).toBeTruthy();
  });
});
