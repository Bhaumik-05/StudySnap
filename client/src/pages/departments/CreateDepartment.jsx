import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AppShell from "../../components/layout/AppShell";
import Container from "../../components/ui/Container";
import { createDepartment } from "../../api/departments";

function CreateDepartment() {
    const navigate = useNavigate();

    const [deptName, setDeptName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const trimmedName = deptName.trim();

        if (!trimmedName) {
            setError("Department name is required.");
            return;
        }

        try {
            setLoading(true);

            await createDepartment({
                deptName: trimmedName,
            });

            setSuccess("Department created successfully.");

            setDeptName("");

            // Go back to department list after successful creation
            setTimeout(() => {
                navigate("/departments");
            }, 800);
        } catch (err) {
            setError(
                err.userMessage || "Unable to create department.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppShell>
            <section className="border-b border-[var(--border)]">
                <Container>
                    <div className="py-12 sm:py-16">

                        {/* Header */}
                        <div className="border-b border-[var(--border)] pb-8">
                            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                                02 / Academic structure
                            </span>

                            <h1 className="mt-5 text-5xl font-bold leading-none tracking-[-0.06em] sm:text-6xl">
                                Create Department
                            </h1>

                            <p className="mt-5 max-w-xl text-base leading-7 text-[var(--muted)]">
                                Add a new academic department to StudySnap.
                            </p>
                        </div>

                        {/* Form */}
                        <div className="pt-10">
                            <form
                                onSubmit={handleSubmit}
                                className="max-w-xl"
                            >
                                <div>
                                    <label
                                        htmlFor="deptName"
                                        className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]"
                                    >
                                        Department name
                                    </label>

                                    <input
                                        id="deptName"
                                        type="text"
                                        value={deptName}
                                        onChange={(event) =>
                                            setDeptName(event.target.value)
                                        }
                                        placeholder="e.g. Computer Engineering"
                                        disabled={loading}
                                        className="mt-3 w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none transition-colors focus:border-black disabled:opacity-50"
                                    />
                                </div>

                                {/* Error */}
                                {error && (
                                    <p className="mt-4 text-sm text-[var(--danger)]">
                                        {error}
                                    </p>
                                )}

                                {/* Success */}
                                {success && (
                                    <p className="mt-4 text-sm">
                                        {success}
                                    </p>
                                )}

                                {/* Buttons */}
                                <div className="mt-8 flex items-center gap-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="border border-[var(--border)] bg-[var(--foreground)] px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[var(--background)] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {loading
                                            ? "Creating..."
                                            : "Create department"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => navigate("/departments")}
                                        disabled={loading}
                                        className="px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[var(--muted)] hover:text-[var(--foreground)]"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </Container>
            </section>
        </AppShell>
    );
}

export default CreateDepartment;