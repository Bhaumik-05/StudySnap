import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Container from "../../components/ui/Container";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import Spinner from "../../components/ui/Spinner";
import NoteCard from "../../components/notes/NoteCard";
import Pagination from "../../components/ui/Pagination";
import { searchNotes } from "../../api/notes";
import { fetchDepartments } from "../../api/departments";
import { fetchSubjects } from "../../api/subjects";
import { getErrorMessage } from "../../lib/api";
import { SEMESTERS, SEARCH_PAGE_SIZE } from "../../lib/constants";

function Notes() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [notes, setNotes] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");

  const filters = useMemo(
    () => ({
      semester: searchParams.get("semester") || "",
      deptId: searchParams.get("deptId") || "",
      subjectId: searchParams.get("subjectId") || "",
      search: searchParams.get("search") || "",
      page: Number(searchParams.get("page")) || 1,
    }),
    [searchParams],
  );

  useEffect(() => {
    fetchDepartments()
      .then((data) => setDepartments(data.departments || []))
      .catch(() => { });
    fetchSubjects()
      .then((data) => setSubjects(Array.isArray(data) ? data : []))
      .catch(() => { });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch = filters.search || "";

      if (searchInput === currentSearch) {
        return;
      }

      updateFilter("search", searchInput.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setLoading(true);
    setError("");
    searchNotes({ ...filters, limit: SEARCH_PAGE_SIZE })
      .then((data) => {
        setNotes(data.data || []);
        setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 });
      })
      .catch((err) => setError(getErrorMessage(err, "Could not load notes.")))
      .finally(() => setLoading(false));
  }, [filters]);

  function updateFilter(key, value) {
    const next = new URLSearchParams(searchParams);

    if (value === "" || value === undefined) {
      next.delete(key);
    } else {
      next.set(key, value);
    }

    if (key !== "page") {
      next.delete("page");
    }

    setSearchParams(next);
  }

  const subjectsForDept = filters.deptId
    ? subjects.filter((s) => s.deptId.includes(Number(filters.deptId)))
    : subjects;

  function departmentName(deptId) {
    return departments.find((d) => d.deptId === deptId)?.deptName;
  }
  function subjectName(subjectId) {
    return subjects.find((s) => s.subjectId === subjectId)?.subjectName;
  }

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-2 border-b border-[var(--border)] pb-6">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
          02 / Notes
        </span>
        <h1 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
          Browse notes
        </h1>
        <p className="text-sm text-[var(--muted)]">
          {pagination.total} approved note{pagination.total === 1 ? "" : "s"} available.
        </p>
      </div>

      <div className="mt-8">

        {/* Search */}
        <section className="rounded-[30px] border border-[var(--border)] bg-white p-3 shadow-[0_14px_40px_rgba(0,0,0,0.045)]">

          <form
            onSubmit={(event) => {
              event.preventDefault();
              updateFilter("search", searchInput.trim());
            }}
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            {/* Search icon */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-[#b9eadc] text-black">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="6.5" />
                <path
                  d="m16 16 4 4"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Search input */}
            <div className="min-w-0 flex-1 px-1">
              <label className="mb-1 block font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[var(--muted)]">
                Search library
              </label>

              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search notes, subjects, topics..."
                className="
            w-full
            border-0
            bg-transparent
            p-0
            text-[17px]
            font-medium
            tracking-[-0.01em]
            text-black
            outline-none
            placeholder:text-[#a2a29d]
            focus:ring-0
          "
              />
            </div>

            {/* Active status */}
            <div className="hidden shrink-0 items-center gap-2 pr-4 sm:flex">
              <span
                className={`h-2 w-2 rounded-full transition-colors duration-200 ${searchInput.trim()
                    ? "bg-[#72c8b0]"
                    : "bg-[#d7d7d2]"
                  }`}
              />

              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                {searchInput.trim() ? "Active" : "Browse all"}
              </span>
            </div>
          </form>
        </section>


        {/* Filters */}
        <section className="mt-5">

          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[var(--muted)]">
                Refine results
              </span>

              <span className="h-px w-8 bg-[var(--border)]" />
            </div>

            {(filters.semester ||
              filters.deptId ||
              filters.subjectId ||
              filters.search) && (
                <button
                  type="button"
                  onClick={() => setSearchParams({})}
                  className="
            font-mono
            text-[9px]
            font-bold
            uppercase
            tracking-[0.18em]
            text-[var(--muted)]
            transition-colors
            duration-200
            hover:text-black
          "
                >
                  Clear all
                </button>
              )}
          </div>


          <div className="grid gap-3 md:grid-cols-3">

            {/* Department */}
            <div className="rounded-[22px] border border-[var(--border)] bg-white p-3 transition-shadow duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)]">

              <label className="mb-2 block px-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                Department
              </label>

              <select
                value={filters.deptId}
                onChange={(event) => {
                  const next = new URLSearchParams(searchParams);
                  const value = event.target.value;

                  if (value) {
                    next.set("deptId", value);
                  } else {
                    next.delete("deptId");
                  }

                  next.delete("subjectId");
                  next.delete("page");

                  setSearchParams(next);
                }}
                className="
            w-full
            appearance-none
            rounded-[15px]
            border
            border-[#e7e7e3]
            bg-[#f7f7f4]
            px-3
            py-2.5
            text-sm
            font-medium
            text-black
            outline-none
            transition
            duration-200
            focus:border-black
            focus:bg-white
          "
              >
                <option value="">All departments</option>

                {departments.map((dept) => (
                  <option
                    key={dept.deptId}
                    value={dept.deptId}
                  >
                    {dept.deptName}
                  </option>
                ))}
              </select>
            </div>


            {/* Subject */}
            <div className="rounded-[22px] border border-[var(--border)] bg-white p-3 transition-shadow duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)]">

              <label className="mb-2 block px-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                Subject
              </label>

              <select
                value={filters.subjectId}
                onChange={(event) =>
                  updateFilter("subjectId", event.target.value)
                }
                className="
            w-full
            appearance-none
            rounded-[15px]
            border
            border-[#e7e7e3]
            bg-[#f7f7f4]
            px-3
            py-2.5
            text-sm
            font-medium
            text-black
            outline-none
            transition
            duration-200
            focus:border-black
            focus:bg-white
          "
              >
                <option value="">All subjects</option>

                {subjectsForDept.map((subject) => (
                  <option
                    key={subject.subjectId}
                    value={subject.subjectId}
                  >
                    {subject.subjectName}
                  </option>
                ))}
              </select>
            </div>


            {/* Semester */}
            <div className="rounded-[22px] border border-[var(--border)] bg-white p-3 transition-shadow duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)]">

              <label className="mb-2 block px-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                Semester
              </label>

              <select
                value={filters.semester}
                onChange={(event) =>
                  updateFilter("semester", event.target.value)
                }
                className="
            w-full
            appearance-none
            rounded-[15px]
            border
            border-[#e7e7e3]
            bg-[#f7f7f4]
            px-3
            py-2.5
            text-sm
            font-medium
            text-black
            outline-none
            transition
            duration-200
            focus:border-black
            focus:bg-white
          "
              >
                <option value="">All semesters</option>

                {SEMESTERS.map((sem) => (
                  <option
                    key={sem}
                    value={sem}
                  >
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </section>
      </div>

      <div className="mt-8">
        {loading ? (
          <Spinner label="Loading notes…" />
        ) : error ? (
          <Alert variant="error">{error}</Alert>
        ) : notes.length === 0 ? (
          <p className="py-12 text-center text-sm text-[var(--muted)]">
            No notes match these filters yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <NoteCard
                key={note.noteId}
                note={note}
                deptName={departmentName(note.deptId)}
                subjectName={subjectName(note.subjectId)}
              />
            ))}
          </div>
        )}

        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onChange={(page) => updateFilter("page", page)}
        />
      </div>
    </Container>
  );
}

export default Notes;
