import React from "react";
import { render } from "@testing-library/react";
import register from "./register";

describe("register tests", () => {
  it("should render", () => {
    expect(render(<register />)).toBeTruthy();
  });
});
