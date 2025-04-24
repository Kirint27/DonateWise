import React from "react";
import { render } from "@testing-library/react";
import PrivacyPolicy from "./PrivacyPolicy";

describe("PrivacyPolicy tests", () => {
  it("should render", () => {
    expect(render(<PrivacyPolicy />)).toBeTruthy();
  });
});
