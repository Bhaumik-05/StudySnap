import Container from "../ui/Container";

function AppShell({ children }) {
  return (
    <div className="min-h-svh bg-[var(--background)] text-[var(--foreground)]">
      <header className="relative z-20 border-b border-[var(--border)]">
        <Container>
          <div className="grid min-h-24 grid-cols-[1fr_auto_1fr] items-center gap-6">

            {/* Brand */}
            <a
              href="/"
              className="group flex items-center gap-4"
              aria-label="StudySnap home"
            >

              <div className="leading-none">
                <div className="text-[30px] font-bold tracking-[-0.055em]">
                  StudySnap
                </div>

                <div className="mt-1.5 hidden font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[var(--muted)] sm:block">
                  Academic workspace
                </div>
              </div>
            </a>

            {/* Navigation */}
            <nav className="hidden items-center md:flex">
              <a
                href="/notes"
                className="group flex items-center gap-3 border-x border-[var(--border)] px-7 py-3"
              >
                <span className="font-mono text-[9px] font-bold text-[var(--muted)]">
                  
                </span>

                <span className="relative text-xs font-bold uppercase tracking-[0.16em]">
                  Notes
                  <span className="absolute -bottom-2 left-0 h-px w-full origin-left bg-black transition-transform duration-200 group-hover:scale-x-0" />
                </span>

                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              </a>

              <a
                href="#about"
                className="group flex items-center gap-3 px-7 py-3 text-[var(--muted)] transition-colors hover:text-black"
              >
                <span className="font-mono text-[9px] font-bold">
                  
                </span>

                <span className="text-xs font-bold uppercase tracking-[0.16em]">
                  About
                </span>
              </a>
            </nav>

            {/* Actions */}
            <div className="flex items-center justify-end gap-5">
              <a
                href="/login"
                className="hidden text-xs font-bold uppercase tracking-[0.14em] transition-opacity hover:opacity-50 sm:block"
              >
                Login
              </a>

              <a
                href="/register"
                className="group flex items-center gap-3"
              >
                <span className="hidden text-xs font-bold uppercase tracking-[0.14em] sm:block">
                  Join
                </span>

                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white transition-transform duration-200 group-hover:rotate-45">
                  <span className="text-lg leading-none">
                    ↗
                  </span>
                </span>
              </a>
            </div>
          </div>
        </Container>
      </header>

      <main>{children}</main>
    </div>
  );
}

export default AppShell;