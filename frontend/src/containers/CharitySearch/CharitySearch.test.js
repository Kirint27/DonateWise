import React from "react";
import { render } from "@testing-library/react";
import CharitySearch from "./CharitySearch";

describe("CharitySearch tests", () => {
  it("should render", () => {
    expect(render(<CharitySearch />)).toBeTruthy();
  });
});
