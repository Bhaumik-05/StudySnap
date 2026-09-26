import { cn } from "../../lib/utils";

const variants = {
  primary:
    "bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200",

  secondary:
    "border border-black/15 bg-transparent text-black hover:bg-black hover:text-white",

  accent:
    "bg-[var(--accent)] text-[var(--accent-foreground)] hover:brightness-95",

  ghost:
    "text-black hover:bg-black/5",

  danger:
    "bg-red-600 text-white hover:bg-red-700",
};

const sizes = {
  sm: "min-h-9 px-4 text-xs",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-13 px-7 text-sm",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-semibold",
        "transition-[background-color,color,border-color,transform,opacity]",
        "duration-150",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        "focus-visible:outline-black",
        "disabled:pointer-events-none disabled:opacity-50",
        "active:translate-y-px",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;