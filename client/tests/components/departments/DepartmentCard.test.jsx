// client/tests/components/departments/DepartmentCard.test.jsx
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DepartmentCard from "../../../src/components/departments/DepartmentCard";

const department = {
  deptId: 7,
  deptName: "computer science",
};

describe("DepartmentCard", () => {
  it("renders the formatted name and padded department ID", () => {
    render(<DepartmentCard department={department} isAdmin={false} />);

    expect(
      screen.getByRole("heading", { name: "Computer Science" }),
    ).toBeInTheDocument();
    expect(screen.getByText("→ 07")).toBeInTheDocument();
  });

  it("supports the fallback name property", () => {
    render(
      <DepartmentCard department={{ deptId: 8, name: "mathematics" }} />,
    );

    expect(
      screen.getByRole("heading", { name: "Mathematics" }),
    ).toBeInTheDocument();
  });

  it("hides management actions for non-admin users", () => {
    render(<DepartmentCard department={department} isAdmin={false} />);

    expect(
      screen.queryByRole("button", { name: "Rename" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Delete" }),
    ).not.toBeInTheDocument();
  });

  it("passes the department to rename and its ID to delete", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <DepartmentCard
        department={department}
        isAdmin
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Rename" }));
    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(onEdit).toHaveBeenCalledExactlyOnceWith(department);
    expect(onDelete).toHaveBeenCalledExactlyOnceWith(7);
  });
});