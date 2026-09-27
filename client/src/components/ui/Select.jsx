function Select({
  label,
  error,
  hint,
  id,
  children,
  className = "",
  ...props
}) {
  const selectId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-[var(--foreground)]"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full rounded-[var(--radius-sm)] border bg-[var(--surface)] px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--foreground)] ${
          error ? "border-[var(--danger)]" : "border-[var(--border)]"
        } ${className}`}
        aria-invalid={Boolean(error)}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <p className="text-xs text-[var(--danger)]">{error}</p>
      ) : hint ? (
        <p className="text-xs text-[var(--muted)]">{hint}</p>
      ) : null}
    </div>
  );
}

export default Select;
