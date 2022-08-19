import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { Header } from "../components/Header";

beforeAll(() => {});
afterEach(() => {
  cleanup();
});
afterAll(() => {});

describe("Header Component Test Cases", () => {
  it("1 :Should render all the elements correctly", async () => {
    render(<Header />);
    // screen.debug();
    expect(screen.getByTestId("header-title")).toBeTruthy();
    expect(screen.getByTestId("header-body")).toBeTruthy();
  });
});
