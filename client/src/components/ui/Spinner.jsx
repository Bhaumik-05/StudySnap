function Spinner({ label = "Loading…" }) {
  return (
    <div className="flex min-h-[50svh] items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-[var(--muted)]">
        <span className="spinner text-2xl" aria-hidden="true" />
        <p className="font-mono text-xs uppercase tracking-[0.2em]">{label}</p>
      </div>
    </div>
  );
}

export default Spinner;
