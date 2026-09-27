// client/tests/routes/RouteGuards.test.jsx
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import ProtectedRoute from "../../src/routes/ProtectedRoute";
import GuestRoute from "../../src/routes/GuestRoute";
import { useAuth } from "../../src/context/AuthContext";

vi.mock("../../src/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

function LoginDestination() {
  const { state } = useLocation();

  return (
    <>
      <h1>Login destination</h1>
      <output data-testid="return-path">
        {state?.from?.pathname}
      </output>
    </>
  );
}

function renderProtected(allowedRoles) {
  return render(
    <MemoryRouter initialEntries={["/private"]}>
      <Routes>
        <Route element={<ProtectedRoute allowedRoles={allowedRoles} />}>
          <Route path="/private" element={<h1>Private content</h1>} />
        </Route>
        <Route path="/login" element={<LoginDestination />} />
        <Route path="/dashboard" element={<h1>Dashboard destination</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

function renderGuest() {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<h1>Login form</h1>} />
        </Route>
        <Route path="/dashboard" element={<h1>Dashboard destination</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  useAuth.mockReturnValue({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });
});

describe("ProtectedRoute", () => {
  it("shows loading while restoring the session", () => {
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: true,
    });

    renderProtected();

    expect(
      screen.getByText("Restoring your session…"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Private content")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Login destination"),
    ).not.toBeInTheDocument();
  });

  it("redirects guests to login and preserves the requested path", async () => {
    renderProtected();

    expect(
      await screen.findByRole("heading", { name: "Login destination" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("return-path")).toHaveTextContent("/private");
  });

  it("renders protected content for authenticated users", () => {
    useAuth.mockReturnValue({
      user: { role: "STUDENT" },
      isAuthenticated: true,
      isLoading: false,
    });

    renderProtected();

    expect(
      screen.getByRole("heading", { name: "Private content" }),
    ).toBeInTheDocument();
  });

  it("redirects users whose role is not allowed", async () => {
    useAuth.mockReturnValue({
      user: { role: "STUDENT" },
      isAuthenticated: true,
      isLoading: false,
    });

    renderProtected(["ADMIN"]);

    expect(
      await screen.findByRole("heading", {
        name: "Dashboard destination",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Private content")).not.toBeInTheDocument();
  });

  it("allows users with an accepted role", () => {
    useAuth.mockReturnValue({
      user: { role: "ADMIN" },
      isAuthenticated: true,
      isLoading: false,
    });

    renderProtected(["ADMIN"]);

    expect(
      screen.getByRole("heading", { name: "Private content" }),
    ).toBeInTheDocument();
  });
});

describe("GuestRoute", () => {
  it("shows loading before authentication is resolved", () => {
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: true,
    });

    renderGuest();

    expect(screen.getByText("Loading…")).toBeInTheDocument();
    expect(screen.queryByText("Login form")).not.toBeInTheDocument();
  });

  it("renders the login route for guests", () => {
    renderGuest();

    expect(
      screen.getByRole("heading", { name: "Login form" }),
    ).toBeInTheDocument();
  });

  it("redirects authenticated users to the dashboard", async () => {
    useAuth.mockReturnValue({
      user: { role: "STUDENT" },
      isAuthenticated: true,
      isLoading: false,
    });

    renderGuest();

    expect(
      await screen.findByRole("heading", {
        name: "Dashboard destination",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Login form")).not.toBeInTheDocument();
  });
});