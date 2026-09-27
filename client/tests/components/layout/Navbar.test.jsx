// client/tests/components/layout/Navbar.test.jsx
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import Navbar from "../../../src/components/layout/Navbar";
import { useAuth } from "../../../src/context/AuthContext";

vi.mock("../../../src/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}</output>;
}

function renderNavbar() {
  return render(
    <MemoryRouter initialEntries={["/notes"]}>
      <Navbar />
      <LocationProbe />
    </MemoryRouter>,
  );
}

describe("Navbar", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn().mockResolvedValue(undefined),
    });
  });

  it("shows public links for guests", () => {
    renderNavbar();

    expect(screen.getByRole("link", { name: /log in/i })).toHaveAttribute(
      "href",
      "/login",
    );
    expect(
      screen.getByRole("link", { name: /join studysnap/i }),
    ).toHaveAttribute("href", "/register");
    expect(
      screen.queryByRole("link", { name: "Dashboard" }),
    ).not.toBeInTheDocument();
  });

  it.each(["STUDENT", "FACULTY"])(
    "shows upload and tagged links for %s",
    (role) => {
      useAuth.mockReturnValue({
        user: { name: "Alex", role },
        isAuthenticated: true,
        logout: vi.fn(),
      });

      renderNavbar();

      expect(
        screen.getByRole("link", { name: "Upload" }),
      ).toHaveAttribute("href", "/upload");
      expect(
        screen.getByRole("link", { name: "Tagged" }),
      ).toHaveAttribute("href", "/tagged");
      expect(
        screen.queryByRole("link", { name: "Admin" }),
      ).not.toBeInTheDocument();
    },
  );

  it("shows admin navigation for administrators", () => {
    useAuth.mockReturnValue({
      user: { name: "Admin", role: "ADMIN" },
      isAuthenticated: true,
      logout: vi.fn(),
    });

    renderNavbar();

    expect(screen.getByRole("link", { name: "Admin" })).toHaveAttribute(
      "href",
      "/admin",
    );
    expect(
      screen.queryByRole("link", { name: "Upload" }),
    ).not.toBeInTheDocument();
  });

  it("opens the mobile menu and closes it after navigation", async () => {
    const user = userEvent.setup();
    renderNavbar();

    const toggle = screen.getByRole("button", { name: "Toggle menu" });

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    // The mobile link includes the arrow in its accessible name.
    await user.click(
      screen.getByRole("link", { name: /^Departments→$/ }),
    );

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByTestId("location")).toHaveTextContent(
      "/departments",
    );
  });

  it("disables logout while pending and navigates home afterward", async () => {
    const user = userEvent.setup();
    let finishLogout;
    const logout = vi.fn(
      () => new Promise((resolve) => {
        finishLogout = resolve;
      }),
    );

    useAuth.mockReturnValue({
      user: { name: "Alex", role: "STUDENT" },
      isAuthenticated: true,
      logout,
    });

    renderNavbar();

    await user.click(screen.getByRole("button", { name: /log out/i }));

    expect(logout).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("button", { name: /leaving/i }),
    ).toBeDisabled();

    await act(async () => {
      finishLogout();
    });

    expect(screen.getByTestId("location").textContent).toBe("/");
    expect(
      screen.getByRole("button", { name: /log out/i }),
    ).toBeEnabled();
  });
});