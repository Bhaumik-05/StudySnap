const STYLES = {
  pending: "bg-[#a16207]/10 text-[var(--warning)] border-[var(--warning)]/30",
  approved: "bg-[#16794c]/10 text-[var(--success)] border-[var(--success)]/30",
  rejected: "bg-[#c24141]/10 text-[var(--danger)] border-[var(--danger)]/30",
  neutral: "bg-[var(--surface-muted)] text-[var(--muted)] border-[var(--border)]",
  red: "bg-[#c24141]/10 text-[var(--danger)] border-[var(--danger)]/30",
  blue: "bg-[#2563eb]/10 text-[#2563eb] border-[#2563eb]/30",
  yellow: "bg-[#a16207]/10 text-[var(--warning)] border-[var(--warning)]/30",
};

function Badge({ tone = "neutral", children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] ${STYLES[tone] || STYLES.neutral} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
