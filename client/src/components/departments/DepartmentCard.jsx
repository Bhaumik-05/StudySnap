function DepartmentCard({ department }) {
    return (
        <article
            className="group bg-[var(--surface)] p-7 transition-colors duration-200 hover:bg-[var(--surface-muted)]"
        >
            <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-xs text-[var(--muted)]">
                    DEPT
                </span>

                <span className="text-lg transition-transform duration-200 group-hover:translate-x-1">
                    ↗
                </span>
            </div>

            <h2 className="mt-12 text-2xl font-bold tracking-[-0.04em]">
                {(department.deptName || department.name)
                    .split(" ")
                    .map(
                        (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1)
                    )
                    .join(" ")}
            </h2>

            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                Explore subjects and academic notes associated with this
                department.
            </p>
        </article>
    );
}

export default DepartmentCard;