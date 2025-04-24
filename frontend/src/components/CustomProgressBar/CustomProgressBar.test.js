import React from "react";
import { render } from "@testing-library/react";
import CustomProgressBar from "./CustomProgressBar";

describe("CustomProgressBar tests", () => {
  it("should render", () => {
    expect(render(<CustomProgressBar />)).toBeTruthy();
  });
});
