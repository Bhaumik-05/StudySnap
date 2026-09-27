// client/tests/components/ui/Button.test.jsx
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "../../../src/components/ui/Button";

describe("Button", () => {
  it("calls onClick when enabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Save</Button>);

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["disabled", { disabled: true }],
    ["loading", { loading: true }],
  ])("blocks clicks while %s", async (_, props) => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button {...props} onClick={onClick}>
        Save
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Save" });

    expect(button).toBeDisabled();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("becomes enabled when loading finishes", () => {
    const { rerender } = render(<Button loading>Save</Button>);

    expect(screen.getByRole("button")).toBeDisabled();

    rerender(<Button loading={false}>Save</Button>);

    expect(screen.getByRole("button")).toBeEnabled();
  });

  it("supports rendering as a link", () => {
    render(
      <Button as="a" href="/notes">
        Browse notes
      </Button>,
    );

    expect(
      screen.getByRole("link", { name: "Browse notes" }),
    ).toHaveAttribute("href", "/notes");
  });
});