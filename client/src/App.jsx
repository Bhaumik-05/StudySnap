import AppShell from "./components/layout/AppShell";
import Container from "./components/ui/Container";
import Button from "./components/ui/Button";

function App() {
  return (
    <AppShell>
      <section className="border-b border-[var(--border)]">
        <Container>
          <div className="grid min-h-[calc(100svh-72px)] grid-cols-1 lg:grid-cols-2">
            {/* Editorial introduction */}
            <div className="flex flex-col justify-between border-b border-[var(--border)] py-8 lg:border-b-0 lg:border-r lg:py-10 lg:pr-12">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                  01 / StudySnap
                </span>
              </div>

              <div className="max-w-2xl py-16 lg:py-0">
                <p className="mb-5 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  College notes, organized.
                </p>

                <h1 className="text-[clamp(3.5rem,8vw,7rem)] font-bold leading-[0.88] tracking-[-0.075em]">
                  Study
                  <br />
                  without
                  <br />
                  the clutter.
                </h1>

                <p className="mt-8 max-w-lg text-base leading-7 text-[var(--muted)] sm:text-lg">
                  Discover, share, and manage academic notes in one focused
                  workspace built for students and faculty.
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                  <Button variant="primary" size="lg">
                    Explore notes
                  </Button>

                  <Button variant="secondary" size="lg">
                    Create account
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[var(--border)] pt-5 text-xs text-[var(--muted)]">
                <span>Academic workspace</span>
                <span>01 / 01</span>
              </div>
            </div>

            {/* Visual half */}
            <div className="relative hidden overflow-hidden bg-[#d8eee9] lg:flex">
              <div className="absolute inset-0">
                <div className="absolute left-[15%] top-[15%] h-56 w-56 rounded-full border border-black/10" />

                <div className="absolute bottom-[15%] right-[12%] h-72 w-72 rounded-full border border-black/10" />

                <div className="absolute left-[25%] top-[30%] h-px w-[55%] rotate-[-25deg] bg-black/15" />

                <div className="absolute left-[20%] top-[50%] h-px w-[60%] rotate-[20deg] bg-black/15" />
              </div>

              <div className="relative m-auto max-w-md p-12">
  <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-black/50">
    Your academic workspace
  </span>

  <div className="mt-8 border border-black/15 bg-white/70 p-6 backdrop-blur-sm">
    <div className="flex items-start justify-between">
      <span className="font-mono text-xs text-black/50">
        STUDYSNAP / 001
      </span>

      <span className="rounded-full bg-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
        IDEA
      </span>
    </div>

    <blockquote className="mt-12 text-3xl font-bold leading-[1.05] tracking-[-0.05em] text-black">
      “Good notes don't just save time.
      <br />
      They give you time.”
    </blockquote>

    <p className="mt-6 text-sm font-medium text-black/50">
      — StudySnap
    </p>

    <div className="mt-8 flex items-center justify-between border-t border-black/10 pt-4 text-xs font-medium uppercase tracking-wider text-black/50">
      <span>Learn</span>
      <span>Share</span>
      <span>Grow</span>
    </div>
  </div>
</div>
            </div>
          </div>
        </Container>
      </section>
    </AppShell>
  );
}

export default App;