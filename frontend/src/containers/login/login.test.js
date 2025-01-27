import React from "react";
import { render } from "@testing-library/react";
import login from "./login";

describe("login tests", () => {
  it("should render", () => {
    expect(render(<login />)).toBeTruthy();
  });
});
