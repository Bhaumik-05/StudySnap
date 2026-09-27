import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function AppShell() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto flex w-full max-w-[var(--content-width)] flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-[var(--muted)] sm:flex-row md:px-8">
          <span className="font-mono uppercase tracking-[0.18em] text-[var(--muted-light)]">
            StudySnap — academic workspace
          </span>
          <span className="font-mono uppercase tracking-[0.18em] text-[var(--muted-light)]">
            © {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  );
}

export default AppShell;
