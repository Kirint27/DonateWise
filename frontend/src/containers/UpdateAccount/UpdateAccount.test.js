import React from "react";
import { render } from "@testing-library/react";
import UpdateAccount from "./UpdateAccount";

describe("UpdateAccount tests", () => {
  it("should render", () => {
    expect(render(<UpdateAccount />)).toBeTruthy();
  });
});
