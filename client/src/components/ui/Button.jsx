const VARIANTS = {
  primary:
    "bg-[var(--foreground)] text-white hover:opacity-90 disabled:opacity-50",
  accent:
    "bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90 disabled:opacity-50",
  outline:
    "border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:border-[var(--foreground)] disabled:opacity-50",
  ghost:
    "bg-transparent text-[var(--foreground)] hover:bg-[var(--surface-muted)] disabled:opacity-50",
  danger:
    "bg-[var(--danger)] text-white hover:opacity-90 disabled:opacity-50",
};

function Button({
  as: Component = "button",
  variant = "primary",
  loading = false,
  className = "",
  children,
  disabled,
  ...props
}) {
  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] transition-colors ${VARIANTS[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="spinner" aria-hidden="true" />}
      {children}
    </Component>
  );
}

export default Button;
