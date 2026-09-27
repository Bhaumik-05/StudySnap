function DepartmentCard({ department }) {
    const departmentName = (department.deptName || department.name)
        .split(" ")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ");

    return (
        <article
            className="
                group
                relative
                border
                border-[var(--border)]
                bg-[var(--background)]
                p-6
                transition-colors
                duration-300
                hover:bg-[var(--surface)]
            "
        >
            {/* Top metadata */}
            <div className="flex items-start justify-between gap-4">
                <span
                    className="
                        font-mono
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.18em]
                        text-[var(--muted-light)]
                    "
                >
                    Department
                </span>

                <span
                    className="
                        font-mono
                        text-[9px]
                        text-[var(--muted-light)]
                    "
                >
                    → 01
                </span>
            </div>

            {/* Department title */}
            <h2
                className="
                    mt-14
                    max-w-[90%]
                    text-2xl
                    font-black
                    leading-[1]
                    tracking-[-0.045em]
                    text-[var(--foreground)]
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                    sm:text-[28px]
                "
            >
                {departmentName}
            </h2>

            {/* Description */}
            <p
                className="
                    mt-4
                    max-w-sm
                    text-sm
                    leading-6
                    text-[var(--muted)]
                "
            >
                Explore subjects and academic notes associated
                with this department.
            </p>

            {/* Bottom action */}
            <div
                className="
                    mt-8
                    flex
                    items-end
                    justify-between
                    border-t
                    border-[var(--border)]
                    pt-4
                "
            >
                <span
                    className="
                        font-mono
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-[0.18em]
                        text-[var(--muted-light)]
                    "
                >
                    StudySnap / Academic
                </span>

                <span
                    className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[var(--border)]
                        text-sm
                        text-[var(--foreground)]
                        transition-colors
                        duration-200
                    "
                >
                    <span
                        className="
                            inline-block
                            transition-transform
                            duration-300
                            group-hover:translate-x-1
                        "
                    >
                        ↗
                    </span>
                </span>
            </div>

            {/* Kaminari-style editorial hover line */}
            <span
                className="
                    absolute
                    bottom-[-1px]
                    left-0
                    h-[2px]
                    w-0
                    bg-[var(--foreground)]
                    transition-all
                    duration-500
                    ease-[cubic-bezier(0.22,1,0.36,1)]
                    group-hover:w-full
                "
            />
        </article>
    );
}

export default DepartmentCard;