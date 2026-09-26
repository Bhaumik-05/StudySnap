import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="flex min-h-[70svh] items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
          404 / Not Found
        </p>

        <h1 className="mt-5 text-6xl font-bold tracking-[-0.06em]">
          Lost in the notes.
        </h1>

        <p className="mt-5 text-[var(--muted)]">
          The page you're looking for doesn't exist.
        </p>

        <Link
          to="/"
          className="group mt-8 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.12em]"
        >
          <span>Back to StudySnap</span>
<span className="transition-transform duration-200 group-hover:-translate-x-1">
  ←
</span>
        </Link>
      </div>
    </main>
  );
}

export default NotFound;