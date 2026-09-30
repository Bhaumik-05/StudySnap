function DepartmentCard({
    department,
    isAdmin,
    onEdit,
    onDelete,

    // CHANGE: Edit state and handlers
    isEditing,
    editValue,
    onEditChange,
    onSave,
    onCancel,
    isSaving,
    editError,
}) {
    const departmentName = (
        department.deptName ||
        department.name ||
        ""
    )
        .trim()
        .split(/\s+/)
        .map(
            (word) =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
        )
        .join(" ");

    return (
        <article
            className="
                group
                relative
                flex
                min-h-[310px]
                flex-col
                overflow-hidden
                bg-[var(--background)]
                p-6
                transition-all
                duration-300
                hover:bg-[var(--surface)]
            "
        >
            {/* =========================================
                TOP METADATA
            ========================================= */}
            <div className="flex items-start justify-between">
                <span
                    className="
                        font-mono
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.2em]
                        text-[var(--muted-light)]
                    "
                >
                    Department
                </span>

                <span
                    className="
                        font-mono
                        text-[9px]
                        tracking-[0.12em]
                        text-[var(--muted-light)]
                    "
                >
                    →{" "}
                    {String(department.deptId).padStart(
                        2,
                        "0"
                    )}
                </span>
            </div>

            {/* =========================================
                DEPARTMENT NAME
            ========================================= */}
            <div className="mt-12">
                <h2
                    className="
                        max-w-[92%]
                        text-2xl
                        font-black
                        leading-[0.98]
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

                {/* Editorial underline */}
                <div
                    className="
                        mt-5
                        h-[2px]
                        w-8
                        bg-[var(--foreground)]
                        transition-all
                        duration-500
                        ease-[cubic-bezier(0.22,1,0.36,1)]
                        group-hover:w-16
                    "
                />
            </div>

            {/* =========================================
                STATISTICS
            ========================================= */}
            <div
                className="
                    mt-8
                    grid
                    grid-cols-2
                    border
                    border-[var(--border)]
                "
            >
                {/* Users */}
                <div
                    className="
                        border-r
                        border-[var(--border)]
                        px-4
                        py-4
                        transition-colors
                        duration-300
                        group-hover:bg-[var(--background)]
                    "
                >
                    <div className="flex items-center justify-between">
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
                            Users
                        </span>

                        <span
                            className="
                                font-mono
                                text-[8px]
                                text-[var(--muted-light)]
                            "
                        >
                            01
                        </span>
                    </div>

                    <p
                        className="
                            mt-2
                            text-2xl
                            font-black
                            leading-none
                            tracking-[-0.04em]
                            text-[var(--foreground)]
                        "
                    >
                        {department.userCount ?? 0}
                    </p>
                </div>

                {/* Approved Notes */}
                <div
                    className="
                        px-4
                        py-4
                        transition-colors
                        duration-300
                        group-hover:bg-[var(--background)]
                    "
                >
                    <div className="flex items-center justify-between">
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
                            Approved
                        </span>

                        <span
                            className="
                                font-mono
                                text-[8px]
                                text-[var(--muted-light)]
                            "
                        >
                            02
                        </span>
                    </div>

                    <p
                        className="
                            mt-2
                            text-2xl
                            font-black
                            leading-none
                            tracking-[-0.04em]
                            text-[var(--foreground)]
                        "
                    >
                        {department.approvedNotesCount ?? 0}
                    </p>

                    <p
                        className="
                            mt-1
                            font-mono
                            text-[7px]
                            uppercase
                            tracking-[0.12em]
                            text-[var(--muted-light)]
                        "
                    >
                        Notes
                    </p>
                </div>
            </div>

            {/* =========================================
                FLEX SPACER
            ========================================= */}
            <div className="flex-1" />

            {/* =========================================
                BOTTOM FOOTER
            ========================================= */}
            <div
                className="
                    mt-8
                    border-t
                    border-[var(--border)]
                    pt-4
                "
            >
                {isAdmin ? (
                    isEditing ? (
                        /* =====================================
                           EDIT MODE
                        ===================================== */
                        <div className="w-full">
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
                                Rename department
                            </span>

                            <input
                                type="text"
                                value={editValue}
                                onChange={(event) =>
                                    onEditChange(
                                        event.target.value
                                    )
                                }
                                autoFocus
                                disabled={isSaving}
                                className="
                                    mt-3
                                    w-full
                                    border
                                    border-[var(--border)]
                                    bg-[var(--background)]
                                    px-3
                                    py-2.5
                                    font-mono
                                    text-xs
                                    text-[var(--foreground)]
                                    outline-none
                                    transition-colors
                                    focus:border-[var(--foreground)]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                                placeholder="Department name"
                            />

                            {editError && (
                                <p
                                    className="
                                        mt-2
                                        font-mono
                                        text-[9px]
                                        text-[var(--danger)]
                                    "
                                >
                                    {editError}
                                </p>
                            )}

                            <div
                                className="
                                    mt-4
                                    flex
                                    items-center
                                    justify-end
                                    gap-4
                                "
                            >
                                {/* Cancel */}
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    disabled={isSaving}
                                    className="
                                        font-mono
                                        text-[9px]
                                        font-bold
                                        uppercase
                                        tracking-[0.14em]
                                        text-[var(--muted)]
                                        transition-all
                                        duration-200
                                        hover:text-[var(--foreground)]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >
                                    Cancel
                                </button>

                                {/* Save */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        onSave(
                                            department.deptId
                                        )
                                    }
                                    disabled={
                                        isSaving ||
                                        !editValue.trim()
                                    }
                                    className="
                                        font-mono
                                        text-[9px]
                                        font-bold
                                        uppercase
                                        tracking-[0.14em]
                                        text-[var(--foreground)]
                                        transition-all
                                        duration-200
                                        hover:translate-x-0.5
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >
                                    {isSaving
                                        ? "Saving..."
                                        : "Save"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* =====================================
                           NORMAL ADMIN MODE
                        ===================================== */
                        <div
                            className="
                                flex
                                items-end
                                justify-between
                                gap-4
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

                            <div className="flex items-center gap-4">
                                {/* Rename */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        onEdit(department)
                                    }
                                    className="
                                        font-mono
                                        text-[9px]
                                        font-bold
                                        uppercase
                                        tracking-[0.14em]
                                        text-[var(--muted)]
                                        transition-all
                                        duration-200
                                        hover:translate-x-0.5
                                        hover:text-[var(--foreground)]
                                    "
                                >
                                    Rename
                                </button>

                                {/* Delete */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        onDelete(
                                            department.deptId
                                        )
                                    }
                                    className="
                                        font-mono
                                        text-[9px]
                                        font-bold
                                        uppercase
                                        tracking-[0.14em]
                                        text-[var(--danger)]
                                        transition-all
                                        duration-200
                                        hover:translate-x-0.5
                                        hover:opacity-70
                                    "
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    )
                ) : (
                    /* =====================================
                       NORMAL USER MODE
                    ===================================== */
                    <div
                        className="
                            flex
                            items-end
                            justify-between
                            gap-4
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
                                transition-all
                                duration-300
                                group-hover:bg-[var(--foreground)]
                                group-hover:text-[var(--background)]
                            "
                        >
                            <span
                                className="
                                    inline-block
                                    transition-transform
                                    duration-300
                                    group-hover:translate-x-0.5
                                "
                            >
                                ↗
                            </span>
                        </span>
                    </div>
                )}
            </div>

            {/* =========================================
                EDITORIAL HOVER LINE
            ========================================= */}
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