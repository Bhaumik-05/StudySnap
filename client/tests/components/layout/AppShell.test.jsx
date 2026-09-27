// client/tests/components/layout/AppShell.test.jsx
import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AppShell from "../../../src/components/layout/AppShell";

vi.mock("../../../src/components/layout/Navbar", () => ({
  default: () => <nav aria-label="Main navigation">Navbar</nav>,
}));

describe("AppShell", () => {
  it("renders navigation, the child route, and the footer", () => {
    render(
      <MemoryRouter initialEntries={["/notes"]}>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/notes" element={<h1>Notes page</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("navigation", { name: "Main navigation" }),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole("main")).getByRole("heading", {
        name: "Notes page",
      }),
    ).toBeInTheDocument();

    const footer = screen.getByRole("contentinfo");

    expect(footer).toHaveTextContent("StudySnap — academic workspace");
    expect(footer).toHaveTextContent(`© ${new Date().getFullYear()}`);
  });
});