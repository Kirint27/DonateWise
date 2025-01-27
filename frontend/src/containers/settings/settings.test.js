import React from "react";
import { render } from "@testing-library/react";
import settings from "./settings";

describe("settings tests", () => {
  it("should render", () => {
    expect(render(<settings />)).toBeTruthy();
  });
});
