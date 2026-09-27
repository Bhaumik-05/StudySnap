// client/tests/components/ui/FormFields.test.jsx
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Input from "../../../src/components/ui/Input";
import Select from "../../../src/components/ui/Select";
import TextArea from "../../../src/components/ui/TextArea";

describe.each([
  ["Input", Input],
  ["TextArea", TextArea],
])("%s", (_, Component) => {
  it("associates its label and accepts typing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Component
        name="title"
        label="Title"
        onChange={onChange}
      />,
    );

    const field = screen.getByRole("textbox", { name: "Title" });

    expect(field).toHaveAttribute("id", "title");

    await user.type(field, "Study notes");

    expect(field).toHaveValue("Study notes");
    expect(onChange).toHaveBeenCalled();
  });

  it("uses an explicit id when provided", () => {
    render(
      <Component id="custom-title" name="title" label="Title" />,
    );

    expect(screen.getByLabelText("Title")).toHaveAttribute(
      "id",
      "custom-title",
    );
  });

  it("replaces the hint with an error and marks the field invalid", () => {
    const { rerender } = render(
      <Component name="title" label="Title" hint="Enter a title" />,
    );

    expect(screen.getByText("Enter a title")).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toHaveAttribute(
      "aria-invalid",
      "false",
    );

    rerender(
      <Component
        name="title"
        label="Title"
        hint="Enter a title"
        error="Title is required"
      />,
    );

    expect(screen.getByText("Title is required")).toBeInTheDocument();
    expect(screen.queryByText("Enter a title")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toBeInvalid();
  });

  it("does not accept typing when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Component
        name="title"
        label="Title"
        disabled
        onChange={onChange}
      />,
    );

    await user.type(screen.getByLabelText("Title"), "Blocked");

    expect(screen.getByLabelText("Title")).toHaveValue("");
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("Select", () => {
  const options = (
    <>
      <option value="">Choose semester</option>
      <option value="1">Semester 1</option>
      <option value="2">Semester 2</option>
    </>
  );

  it("associates its label and changes selection", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Select name="semester" label="Semester" onChange={onChange}>
        {options}
      </Select>,
    );

    const select = screen.getByRole("combobox", { name: "Semester" });

    await user.selectOptions(select, "2");

    expect(select).toHaveValue("2");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("shows validation errors instead of hints", () => {
    render(
      <Select
        name="semester"
        label="Semester"
        hint="Choose your semester"
        error="Semester is required"
      >
        {options}
      </Select>,
    );

    expect(screen.getByLabelText("Semester")).toBeInvalid();
    expect(screen.getByText("Semester is required")).toBeInTheDocument();
    expect(
      screen.queryByText("Choose your semester"),
    ).not.toBeInTheDocument();
  });

  it("prevents selection when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Select
        name="semester"
        label="Semester"
        disabled
        onChange={onChange}
      >
        {options}
      </Select>,
    );

    await user.selectOptions(screen.getByLabelText("Semester"), "2");

    expect(screen.getByLabelText("Semester")).toHaveValue("");
    expect(onChange).not.toHaveBeenCalled();
  });
});