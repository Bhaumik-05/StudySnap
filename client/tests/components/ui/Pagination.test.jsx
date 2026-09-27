// client/tests/components/ui/Pagination.test.jsx
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination from "../../../src/components/ui/Pagination";

describe("Pagination", () => {
  it.each([0, 1])("renders nothing for %s total pages", (totalPages) => {
    const { container } = render(
      <Pagination page={1} totalPages={totalPages} onChange={vi.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("requests the previous and next pages", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Pagination page={2} totalPages={3} onChange={onChange} />);

    expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Previous" }));
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(onChange.mock.calls).toEqual([[1], [3]]);
  });

  it.each([
    [1, "Previous"],
    [3, "Next"],
  ])("blocks navigation beyond page %s", async (page, buttonName) => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Pagination page={page} totalPages={3} onChange={onChange} />,
    );

    const button = screen.getByRole("button", { name: buttonName });

    expect(button).toBeDisabled();
    await user.click(button);
    expect(onChange).not.toHaveBeenCalled();
  });
});