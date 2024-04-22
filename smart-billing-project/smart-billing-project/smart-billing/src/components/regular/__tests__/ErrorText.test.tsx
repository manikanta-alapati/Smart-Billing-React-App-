import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ErrorText from "../ErrorText";

describe("ErrorText Component", () => {
  test("Should render the error text", () => {
    render(<ErrorText>Error</ErrorText>);
    expect(screen.getByText("Error")).toBeInTheDocument();
  });
});
