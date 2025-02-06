import React from "react";
import { render } from "@testing-library/react";
import Account from "./Account";

describe("Account tests", () => {
  it("should render", () => {
    expect(render(<Account />)).toBeTruthy();
  });
});
