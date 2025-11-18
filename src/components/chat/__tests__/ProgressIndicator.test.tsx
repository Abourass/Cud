import { describe, it, expect } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import { ProgressIndicator } from "../ProgressIndicator";

describe("ProgressIndicator", () => {
  it("should render message text", () => {
    render(() => <ProgressIndicator message="Generating image..." />);
    expect(screen.getByText("Generating image...")).toBeInTheDocument();
  });

  it("should show indeterminate spinner when isIndeterminate is true", () => {
    const { container } = render(() => (
      <ProgressIndicator message="Loading..." isIndeterminate={true} />
    ));

    // Check for spinner SVG
    const spinner = container.querySelector("svg.animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("should show progress percentage when progress is provided", () => {
    render(() => (
      <ProgressIndicator message="Processing..." progress={45} isIndeterminate={false} />
    ));

    expect(screen.getByText("45%")).toBeInTheDocument();
  });

  it("should show progress bar when progress is provided", () => {
    const { container } = render(() => (
      <ProgressIndicator message="Processing..." progress={60} isIndeterminate={false} />
    ));

    // Check for progress bar container
    const progressBar = container.querySelector(".bg-sky-500");
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveStyle({ width: "60%" });
  });

  it("should not show progress bar when isIndeterminate is true", () => {
    const { container } = render(() => (
      <ProgressIndicator message="Loading..." progress={30} isIndeterminate={true} />
    ));

    // Progress bar should not be shown
    const progressBar = container.querySelector(".bg-slate-600");
    expect(progressBar).not.toBeInTheDocument();
  });

  it("should apply correct styling", () => {
    const { container } = render(() => (
      <ProgressIndicator message="Test message" />
    ));

    const wrapper = container.querySelector(".bg-slate-700");
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass("rounded-lg");
  });
});
