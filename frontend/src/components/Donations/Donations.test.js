import React from "react";
import { render } from "@testing-library/react";
import Donations from "./Donations";

describe("Donations tests", () => {
  it("should render", () => {
    expect(render(<Donations />)).toBeTruthy();
  });
});
