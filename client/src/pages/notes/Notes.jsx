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
      .catch(() => {});
    fetchSubjects()
      .then((data) => setSubjects(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

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
    // Any filter change resets pagination back to page 1.
    if (key !== "page") next.delete("page");
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

      <div className="mt-6 grid gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:grid-cols-2 lg:grid-cols-4">
        <form
          className="sm:col-span-2 lg:col-span-4"
          onSubmit={(event) => {
            event.preventDefault();
            updateFilter("search", searchInput.trim());
          }}
        >
          <Input
            label="Search"
            placeholder="Search by title or description"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </form>

        <Select
          label="Department"
          value={filters.deptId}
          onChange={(event) => {
            // Set deptId and clear subjectId in a single update — calling
            // updateFilter twice here would have each call read the same
            // stale searchParams snapshot and the second call would
            // silently undo the first.
            const next = new URLSearchParams(searchParams);
            const value = event.target.value;
            if (value) next.set("deptId", value);
            else next.delete("deptId");
            next.delete("subjectId");
            next.delete("page");
            setSearchParams(next);
          }}
        >
          <option value="">All departments</option>
          {departments.map((dept) => (
            <option key={dept.deptId} value={dept.deptId}>
              {dept.deptName}
            </option>
          ))}
        </Select>

        <Select
          label="Subject"
          value={filters.subjectId}
          onChange={(event) => updateFilter("subjectId", event.target.value)}
        >
          <option value="">All subjects</option>
          {subjectsForDept.map((subject) => (
            <option key={subject.subjectId} value={subject.subjectId}>
              {subject.subjectName}
            </option>
          ))}
        </Select>

        <Select
          label="Semester"
          value={filters.semester}
          onChange={(event) => updateFilter("semester", event.target.value)}
        >
          <option value="">All semesters</option>
          {SEMESTERS.map((sem) => (
            <option key={sem} value={sem}>
              Semester {sem}
            </option>
          ))}
        </Select>

        <div className="flex items-end">
          <Button
            variant="ghost"
            type="button"
            onClick={() => setSearchParams({})}
            className="w-full"
          >
            Clear filters
          </Button>
        </div>
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
