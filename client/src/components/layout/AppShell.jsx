import { Link } from "react-router-dom";
import Container from "../ui/Container";

function AppShell({ children }) {
  return (
    <div className="min-h-svh bg-[var(--background)] text-[var(--foreground)]">
      <header className="relative z-20 border-b border-[var(--border)]">
        <Container>
          <div className="flex min-h-24 items-center justify-between">

            {/* Brand */}
            <Link
              to="/"
              className="group"
              aria-label="StudySnap home"
            >
              <div className="text-[35px] font-bold leading-none tracking-[-0.055em]">
                StudySnap
              </div>

              <div className="mt-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                Academic workspace
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden items-center md:flex">
              <Link
                to="/departments"
                className="border-l border-[var(--border)] px-8 py-3 text-xs font-bold uppercase tracking-[0.16em] transition-colors hover:text-[var(--muted)]"
              >
                Departments
              </Link>
              <Link
                to="/notes"
                className="border-l border-[var(--border)] px-8 py-3 text-xs font-bold uppercase tracking-[0.16em] transition-colors hover:text-[var(--muted)]"
              >
                Notes
              </Link>

              <a
                href="/#about"
                className="border-l border-[var(--border)] px-8 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
              >
                About
              </a>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-6">
              <Link
                to="/login"
                className="hidden text-xs font-bold uppercase tracking-[0.14em] transition-opacity hover:opacity-50 sm:block"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="group flex items-center gap-3"
              >
                <span className="hidden text-xs font-bold uppercase tracking-[0.14em] sm:block">
                  Join
                </span>

                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-black/20 transition-all duration-200 group-hover:bg-black group-hover:text-white">
                  <span className="text-base transition-transform duration-200 group-hover:rotate-45">
                    ↗
                  </span>
                </span>
              </Link>
            </div>

          </div>
        </Container>
      </header>

      <main>{children}</main>
    </div>
  );
}

export default AppShell;