import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AppShell from "../../components/layout/AppShell";
import Container from "../../components/ui/Container";
import DepartmentCard from "../../components/departments/DepartmentCard";
import { getDepartments } from "../../api/departments";

function Departments() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDepartments = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getDepartments();

                setDepartments(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(
                    err.userMessage || "Unable to load departments.",
                );
            } finally {
                setLoading(false);
            }
        };

        loadDepartments();
    }, []);

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

                            <div className="mt-5 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                                <div>
                                    <h1 className="text-5xl font-bold leading-none tracking-[-0.06em] sm:text-6xl">
                                        Departments
                                    </h1>

                                    <p className="mt-5 max-w-xl text-base leading-7 text-[var(--muted)]">
                                        Browse academic departments and discover the
                                        subjects and notes available for each area.
                                    </p>
                                </div>

                                <Link
                                    to="/subjects"
                                    className="group inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.12em]"
                                >
                                    <span>View subjects</span>

                                    <span className="text-lg transition-transform duration-200 group-hover:translate-x-1">
                                        →
                                    </span>
                                </Link>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="pt-10">

                            {/* Loading */}
                            {loading && (
                                <div className="py-16 text-center text-sm text-[var(--muted)]">
                                    Loading departments...
                                </div>
                            )}

                            {/* Error */}
                            {!loading && error && (
                                <div className="border border-[var(--border)] bg-[var(--surface)] p-6">
                                    <p className="text-sm text-[var(--danger)]">
                                        {error}
                                    </p>
                                </div>
                            )}

                            {/* Empty */}
                            {!loading &&
                                !error &&
                                departments.length === 0 && (
                                    <div className="border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
                                        <h2 className="text-xl font-bold">
                                            No departments found
                                        </h2>

                                        <p className="mt-2 text-sm text-[var(--muted)]">
                                            There are currently no departments available.
                                        </p>
                                    </div>
                                )}

                            {/* Departments */}
                            {!loading &&
                                !error &&
                                departments.length > 0 && (
                                    <div className="grid gap-px border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">

                                        {departments.map((department) => (
                                            <DepartmentCard
                                                key={
                                                    department.deptId ||
                                                    department._id
                                                }
                                                department={department}
                                            />
                                        ))}

                                    </div>
                                )}

                        </div>
                    </div>
                </Container>
            </section>
        </AppShell>
    );
}

export default Departments;