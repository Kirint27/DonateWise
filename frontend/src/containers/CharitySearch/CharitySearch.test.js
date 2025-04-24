import React from "react";
import { render } from "@testing-library/react";
import CharitySearch, { fetchCharities } from "./CharitySearch"; // ✅ Import fetchCharities

describe("CharitySearch tests", () => {
  it("should render", () => {
    expect(render(<CharitySearch />)).toBeTruthy();
  });
});

describe("fetchCharities", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  
});
