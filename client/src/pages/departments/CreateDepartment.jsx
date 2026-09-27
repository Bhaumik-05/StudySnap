import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Container from "../../components/ui/Container";
import Alert from "../../components/ui/Alert";

import { createDepartment } from "../../api/departments";
import { getErrorMessage } from "../../lib/api";
import { validateDeptName } from "../../lib/validators";

function CreateDepartment() {
    const navigate = useNavigate();

    const [deptName, setDeptName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        const trimmedName = deptName.trim();

        setError("");

        const validationError =
            validateDeptName(trimmedName);

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);

            await createDepartment(trimmedName);

            navigate("/departments");
        } catch (err) {
            console.error(
                "Create department error:",
                err
            );

            setError(
                getErrorMessage(
                    err,
                    "Unable to create department."
                )
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container className="py-8 sm:py-12">
            <div className="min-h-[calc(100vh-10rem)]">

                {/* =========================================
                    TOP NAVIGATION
                ========================================= */}
                <div className="mb-8 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/departments")
                        }
                        className="
                            group
                            flex
                            items-center
                            gap-2
                            font-mono
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.16em]
                            text-[var(--muted)]
                            transition-colors
                            hover:text-[var(--foreground)]
                        "
                    >
                        <span
                            className="
                                transition-transform
                                duration-200
                                group-hover:-translate-x-1
                            "
                        >
                            ←
                        </span>

                        Departments
                    </button>

                    <span
                        className="
                            font-mono
                            text-[9px]
                            uppercase
                            tracking-[0.18em]
                            text-[var(--muted-light)]
                        "
                    >
                        Admin / Create
                    </span>
                </div>

                {/* =========================================
                    SPLIT LAYOUT
                ========================================= */}
                <div
                    className="
                        grid
                        overflow-hidden
                        border
                        border-[var(--border)]
                        lg:grid-cols-[1fr_0.9fr]
                    "
                >

                    {/* =====================================
                        LEFT — FORM
                    ===================================== */}
                    <section
                        className="
                            flex
                            min-h-[620px]
                            flex-col
                            justify-between
                            bg-[var(--background)]
                            p-7
                            sm:p-10
                            lg:p-12
                        "
                    >
                        <div>

                            {/* Eyebrow */}
                            <div className="flex items-center gap-3">
                                <span
                                    className="
                                        flex
                                        h-7
                                        w-7
                                        items-center
                                        justify-center
                                        border
                                        border-[var(--border)]
                                        font-mono
                                        text-[9px]
                                        font-bold
                                    "
                                >
                                    01
                                </span>

                                <span
                                    className="
                                        font-mono
                                        text-[9px]
                                        font-bold
                                        uppercase
                                        tracking-[0.18em]
                                        text-[var(--muted)]
                                    "
                                >
                                    Department setup
                                </span>
                            </div>

                            {/* Heading */}
                            <h1
                                className="
                                    mt-10
                                    max-w-xl
                                    text-5xl
                                    font-black
                                    leading-[0.9]
                                    tracking-[-0.065em]
                                    sm:text-6xl
                                "
                            >
                                Create
                                <br />
                                Department.
                            </h1>

                            <p
                                className="
                                    mt-7
                                    max-w-md
                                    text-sm
                                    leading-6
                                    text-[var(--muted)]
                                "
                            >
                                Add a new academic department
                                to your StudySnap directory.
                                Students and faculty will be
                                able to browse it once created.
                            </p>

                            {/* Form */}
                            <form
                                onSubmit={handleSubmit}
                                className="mt-14"
                            >
                                <div>
                                    <label
                                        htmlFor="deptName"
                                        className="
                                            font-mono
                                            text-[9px]
                                            font-bold
                                            uppercase
                                            tracking-[0.17em]
                                            text-[var(--muted)]
                                        "
                                    >
                                        Department name
                                    </label>

                                    <input
                                        id="deptName"
                                        type="text"
                                        value={deptName}
                                        onChange={(event) => {
                                            setDeptName(
                                                event.target.value
                                            );
                                            setError("");
                                        }}
                                        placeholder="Computer Engineering"
                                        disabled={loading}
                                        autoFocus
                                        className="
                                            mt-4
                                            w-full
                                            border-0
                                            border-b
                                            border-[var(--border)]
                                            bg-transparent
                                            px-0
                                            py-4
                                            text-xl
                                            font-semibold
                                            tracking-tight
                                            outline-none
                                            transition-all
                                            duration-300
                                            placeholder:text-[var(--muted-light)]
                                            focus:border-[var(--foreground)]
                                            disabled:opacity-50
                                        "
                                    />

                                    <div
                                        className="
                                            mt-3
                                            flex
                                            items-center
                                            justify-between
                                        "
                                    >
                                        <p
                                            className="
                                                text-xs
                                                text-[var(--muted)]
                                            "
                                        >
                                            Use the official
                                            department name.
                                        </p>

                                        <span
                                            className="
                                                font-mono
                                                text-[9px]
                                                text-[var(--muted-light)]
                                            "
                                        >
                                            REQUIRED
                                        </span>
                                    </div>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div className="mt-6">
                                        <Alert variant="error">
                                            {error}
                                        </Alert>
                                    </div>
                                )}

                                {/* Actions */}
                                <div
                                    className="
                                        mt-10
                                        flex
                                        flex-col
                                        gap-3
                                        sm:flex-row
                                    "
                                >
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="
                                            group
                                            inline-flex
                                            h-12
                                            flex-1
                                            items-center
                                            justify-center
                                            gap-3
                                            border
                                            border-[var(--foreground)]
                                            bg-[var(--foreground)]
                                            px-6
                                            font-mono
                                            text-[9px]
                                            font-bold
                                            uppercase
                                            tracking-[0.16em]
                                            text-[var(--background)]
                                            transition-all
                                            duration-200
                                            hover:-translate-y-0.5
                                            hover:opacity-85
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    >
                                        {loading
                                            ? "Creating..."
                                            : "Create department"}

                                        {!loading && (
                                            <span
                                                className="
                                                    transition-transform
                                                    duration-200
                                                    group-hover:translate-x-1
                                                "
                                            >
                                                →
                                            </span>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                "/departments"
                                            )
                                        }
                                        disabled={loading}
                                        className="
                                            h-12
                                            border
                                            border-[var(--border)]
                                            px-6
                                            font-mono
                                            text-[9px]
                                            font-bold
                                            uppercase
                                            tracking-[0.16em]
                                            text-[var(--muted)]
                                            transition-colors
                                            hover:bg-[var(--surface-muted)]
                                            hover:text-[var(--foreground)]
                                            disabled:opacity-50
                                        "
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Bottom metadata */}
                        <div
                            className="
                                mt-12
                                flex
                                items-end
                                justify-between
                                border-t
                                border-[var(--border)]
                                pt-5
                            "
                        >
                            <div>
                                <p
                                    className="
                                        font-mono
                                        text-[8px]
                                        font-bold
                                        uppercase
                                        tracking-[0.15em]
                                        text-[var(--muted-light)]
                                    "
                                >
                                    StudySnap
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-[var(--muted)]
                                    "
                                >
                                    Academic workspace
                                </p>
                            </div>

                            <span
                                className="
                                    font-mono
                                    text-[9px]
                                    text-[var(--muted-light)]
                                "
                            >
                                2026
                            </span>
                        </div>
                    </section>

                    {/* =====================================
                        RIGHT — KAMINARI INSPIRED PANEL
                    ===================================== */}
                    <aside className="relative hidden min-h-[620px] overflow-hidden border-l border-[var(--border)] bg-[#e6f5f0] lg:block">
                        {/* Soft background */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/60 blur-3xl" />
                            <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-[#b9eadc]/50 blur-3xl" />
                        </div>

                        <div className="relative flex h-full flex-col p-10 xl:p-12">

                            {/* Top metadata */}
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#71807b]">
                                    ADMIN / 02
                                </span>

                                <span className="rounded-full bg-white/80 px-4 py-2 font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[#687672] shadow-sm">
                                    Create department
                                </span>
                            </div>

                            {/* Large editorial number */}
                            <div className="absolute left-10 top-[76px] select-none text-[8rem] font-black leading-none tracking-[-0.1em] text-black xl:text-[9rem]">
                                02
                            </div>

                            {/* Main visual */}
                            <div className="relative flex flex-1 items-center justify-center">

                                {/* Back directory sheet */}
                                <div className="absolute h-[355px] w-[285px] rotate-[-8deg] rounded-[24px] border border-black/5 bg-white/55 shadow-[0_25px_60px_rgba(0,0,0,0.08)]" />

                                {/* Main department card */}
                                <div className="relative z-10 w-[310px] rotate-[2deg] rounded-[24px] border border-black/5 bg-white p-7 shadow-[0_30px_70px_rgba(0,0,0,0.14)] xl:w-[340px]">

                                    {/* Card heading */}
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[#899590]">
                                                NEW ENTRY
                                            </p>

                                            <h2 className="mt-2 text-2xl font-black tracking-[-0.045em]">
                                                Department
                                            </h2>
                                        </div>

                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                                            +
                                        </div>
                                    </div>

                                    <div className="my-6 h-px bg-[#e5e8e7]" />

                                    {/* Department preview */}
                                    <div className="rounded-2xl bg-[#edf8f4] p-5">

                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-[#788580]">
                                                Department name
                                            </span>

                                            <span className="h-2.5 w-2.5 rounded-full bg-[#e8bf62]" />
                                        </div>

                                        <div className="mt-4 rounded-xl border border-black/[0.06] bg-white px-4 py-4">
                                            <span className="text-sm font-semibold text-[#222]">
                                                Computer Engineering
                                            </span>

                                            <div className="mt-3 h-1 w-[72%] rounded-full bg-[#dce4e1]" />
                                        </div>
                                    </div>

                                    {/* Academic structure */}
                                    <div className="mt-5">
                                        <p className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[#8b9692]">
                                            Academic structure
                                        </p>

                                        <div className="mt-3 flex items-center">

                                            {/* Department */}
                                            <div className="flex items-center gap-2">
                                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-[9px] font-bold text-white">
                                                    D
                                                </span>

                                                <span className="text-[10px] font-bold">
                                                    Department
                                                </span>
                                            </div>

                                            <span className="mx-3 text-[#a6afac]">
                                                →
                                            </span>

                                            {/* Subjects */}
                                            <div className="flex items-center gap-2">
                                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f3e8c9] text-[9px] font-bold text-[#77643a]">
                                                    S
                                                </span>

                                                <span className="text-[10px] font-bold">
                                                    Subjects
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom */}
                                    <div className="mt-6 flex items-center justify-between border-t border-[#e7e9e8] pt-4">
                                        <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#9aa4a1]">
                                            Directory / 2026
                                        </span>

                                        <span className="text-sm font-bold">
                                            →
                                        </span>
                                    </div>
                                </div>

                                {/* Floating "Add" card */}
                                <div className="absolute bottom-[18%] left-[1%] z-20 w-[145px] -rotate-[8deg] rounded-2xl bg-white p-4 shadow-[0_18px_35px_rgba(0,0,0,0.12)]">

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e3f5ef] text-lg font-semibold">
                                            +
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-bold">
                                                Add new
                                            </p>

                                            <p className="mt-0.5 text-[8px] text-[#929c99]">
                                                Academic unit
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 h-1.5 w-full rounded-full bg-[#e8ecea]" />
                                    <div className="mt-2 h-1.5 w-[65%] rounded-full bg-[#e8ecea]" />
                                </div>

                                {/* Floating hierarchy card */}
                                <div className="absolute right-[-1%] top-[31%] z-20 w-[140px] rotate-[7deg] rounded-2xl bg-white p-4 shadow-[0_18px_35px_rgba(0,0,0,0.12)]">

                                    <p className="font-mono text-[7px] font-bold uppercase tracking-[0.16em] text-[#8b9692]">
                                        DIRECTORY
                                    </p>

                                    <div className="mt-3 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-black" />
                                            <span className="text-[9px] font-semibold">
                                                Department
                                            </span>
                                        </div>

                                        <div className="ml-1 border-l border-[#dfe5e2] pl-4">
                                            <div className="flex items-center gap-2">
                                                <span className="h-1.5 w-1.5 rounded-full bg-[#e8bf62]" />
                                                <span className="text-[8px] text-[#77837f]">
                                                    Subjects
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating explanatory pill */}
                                <div className="absolute bottom-[10%] right-[3%] z-30 rounded-full bg-white px-5 py-3 shadow-[0_15px_30px_rgba(0,0,0,0.10)]">
                                    <p className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[#687570]">
                                        Build your directory.
                                    </p>
                                </div>
                            </div>

                            {/* Bottom explanation */}
                            <div className="relative mt-3 border-t border-black/10 pt-5">
                                <p className="text-sm font-bold tracking-tight">
                                    Start with a department.
                                </p>

                                <p className="mt-1 max-w-md text-[11px] leading-5 text-[#77837f]">
                                    Departments organise your academic workspace and provide the
                                    foundation for subjects and study resources.
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </Container>
    );
}

export default CreateDepartment;