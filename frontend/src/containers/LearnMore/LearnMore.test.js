import React from "react";
import { render } from "@testing-library/react";
import LearnMore from "./LearnMore";

describe("LearnMore tests", () => {
  it("should render", () => {
    expect(render(<LearnMore />)).toBeTruthy();
  });
});
