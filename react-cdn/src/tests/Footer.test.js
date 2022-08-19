import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { Footer } from "../components/Footer";

beforeAll(() => {});
afterEach(() => {
  cleanup();
});
afterAll(() => {});

describe("Footer Component Test Cases", () => {
  it("1 :Should render all the elementns correctly", async () => {
    render(<Footer />);
    expect(screen.getByTestId("footer-content")).toBeTruthy();
  });
});
