// client/tests/components/notes/NoteCard.test.jsx
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NoteCard from "../../../src/components/notes/NoteCard";
import { formatDate } from "../../../src/lib/format";

const { navigate } = vi.hoisted(() => ({
  navigate: vi.fn(),
}));

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => navigate,
}));

vi.mock("../../../src/lib/format", () => ({
  formatDate: vi.fn(() => "Sep 20, 2026"),
}));

const note = {
  noteId: 12,
  title: "Database Normalization",
  description: "First, second and third normal forms.",
  semester: 3,
  uploadDate: "2026-09-18T12:00:00Z",
  approvedDate: "2026-09-20T12:00:00Z",
  downloadCount: 8,
};

describe("NoteCard", () => {
  it("renders note details and formatted metadata", () => {
    render(
      <NoteCard
        note={note}
        deptName="computer SCIENCE"
        subjectName="database SYSTEMS"
      />,
    );

    expect(
      screen.getByRole("heading", { name: note.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(note.description)).toBeInTheDocument();
    expect(screen.getByText("Sem 3")).toBeInTheDocument();
    expect(screen.getByText("Computer Science")).toBeInTheDocument();
    expect(screen.getByText("Database Systems")).toBeInTheDocument();
    expect(screen.getByText("8 downloads")).toBeInTheDocument();
    expect(screen.getByText("Sep 20, 2026")).toBeInTheDocument();
    expect(formatDate).toHaveBeenCalledWith(note.approvedDate);
  });

  it("handles missing optional values", () => {
    render(
      <NoteCard
        note={{
          ...note,
          description: undefined,
          approvedDate: undefined,
          downloadCount: undefined,
        }}
      />,
    );

    expect(screen.queryByText(note.description)).not.toBeInTheDocument();
    expect(screen.getByText("0 downloads")).toBeInTheDocument();
    expect(formatDate).toHaveBeenCalledWith(note.uploadDate);
  });

  it("opens note details when the card is clicked", async () => {
    const user = userEvent.setup();

    render(<NoteCard note={note} />);
    await user.click(screen.getByRole("article"));

    expect(navigate).toHaveBeenCalledExactlyOnceWith("/notes/12");
  });

  it("navigates only once when View is clicked", async () => {
    const user = userEvent.setup();

    render(<NoteCard note={note} />);
    await user.click(screen.getByRole("button", { name: /view/i }));

    // Verifies that the button click does not trigger card navigation twice.
    expect(navigate).toHaveBeenCalledExactlyOnceWith("/notes/12");
  });
});