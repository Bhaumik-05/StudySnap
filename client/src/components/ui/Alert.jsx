const STYLES = {
  error: "border-[var(--danger)]/40 bg-[#c24141]/10 text-[var(--danger)]",
  success: "border-[var(--success)]/40 bg-[#16794c]/10 text-[var(--success)]",
  warning: "border-[var(--warning)]/40 bg-[#a16207]/10 text-[var(--warning)]",
  info: "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)]",
};

function Alert({ variant = "info", children, className = "" }) {
  if (!children) return null;
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`rounded-[var(--radius-sm)] border px-3.5 py-2.5 text-sm ${STYLES[variant]} ${className}`}
    >
      {children}
    </div>
  );
}

export default Alert;
