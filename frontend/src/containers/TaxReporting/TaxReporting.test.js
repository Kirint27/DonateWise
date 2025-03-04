import React from "react";
import { render } from "@testing-library/react";
import TaxReporting from "./TaxReporting";

describe("TaxReporting tests", () => {
  it("should render", () => {
    expect(render(<TaxReporting />)).toBeTruthy();
  });
});
