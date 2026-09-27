// client/tests/components/ui/Display.test.jsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Alert from "../../../src/components/ui/Alert";
import Badge from "../../../src/components/ui/Badge";
import Container from "../../../src/components/ui/Container";
import Spinner from "../../../src/components/ui/Spinner";

describe("Alert", () => {
  it("renders nothing without content", () => {
    const { container } = render(<Alert />);
    expect(container).toBeEmptyDOMElement();
  });

  it.each([
    ["error", "alert"],
    ["success", "status"],
    ["warning", "status"],
    ["info", "status"],
  ])("uses the correct role for %s messages", (variant, role) => {
    render(<Alert variant={variant}>Message</Alert>);
    expect(screen.getByRole(role)).toHaveTextContent("Message");
  });
});

describe("Badge", () => {
  it("renders its content", () => {
    render(<Badge tone="approved">Approved</Badge>);
    expect(screen.getByText("Approved")).toBeInTheDocument();
  });

  it("falls back to neutral styling for an unknown tone", () => {
    const { rerender } = render(<Badge>Pending</Badge>);
    const neutralClasses = screen.getByText("Pending").className;

    rerender(<Badge tone="unknown">Pending</Badge>);

    expect(screen.getByText("Pending").className).toBe(neutralClasses);
  });
});

describe("Container", () => {
  it("renders children and forwards attributes", () => {
    render(
      <Container role="region" aria-label="Notes" className="custom">
        Notes content
      </Container>,
    );

    const region = screen.getByRole("region", { name: "Notes" });

    expect(region).toHaveTextContent("Notes content");
    expect(region).toHaveClass("custom");
  });
});

describe("Spinner", () => {
  it("renders the default loading label", () => {
    render(<Spinner />);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("renders a custom loading label", () => {
    render(<Spinner label="Loading notes…" />);
    expect(screen.getByText("Loading notes…")).toBeInTheDocument();
  });
});