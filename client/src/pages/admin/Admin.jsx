import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/ui/Container";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Alert from "../../components/ui/Alert";
import Spinner from "../../components/ui/Spinner";
import Badge from "../../components/ui/Badge";
import {
  fetchPendingNotes,
  fetchRejectedNotes,
  updateNoteStatus,
} from "../../api/admin";
import { fetchDepartments } from "../../api/departments";
import {
  fetchSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../../api/subjects";
import { getErrorMessage } from "../../lib/api";
import { formatDate } from "../../lib/format";
import {
  validateSubjectName,
  validateSubjectDeptIds,
} from "../../lib/validators";

const TABS = [
  { key: "pending", label: "Pending notes", index: "01" },
  { key: "rejected", label: "Rejected notes", index: "02" },
  { key: "subjects", label: "Subjects", index: "03" },
];

function TabButton({ active, onClick, children, index }) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex min-w-[120px] items-center gap-3 border-t-2 py-4 text-left transition-all duration-200 ${
        active
          ? "border-[var(--foreground)] text-[var(--foreground)]"
          : "border-transparent text-[var(--muted)] hover:border-[var(--border)] hover:text-[var(--foreground)]"
      }`}
    >
      <span
        className={`font-mono text-[10px] font-bold tracking-[0.12em] ${
          active ? "text-[var(--foreground)]" : "text-[var(--muted-light)]"
        }`}
      >
        {index}
      </span>

      <span className="text-xs font-bold uppercase tracking-[0.12em]">
        {children}
      </span>

      <span
        className={`ml-auto text-lg transition-transform duration-200 ${
          active ? "translate-x-0" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
        }`}
      >
        →
      </span>
    </button>
  );
}

function SectionLabel({ number, children }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[10px] font-bold tracking-[0.16em] text-[var(--muted-light)]">
        {number}
      </span>

      <span className="h-px w-8 bg-[var(--border)]" />

      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
        {children}
      </span>
    </div>
  );
}

function PendingNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionError, setRejectionError] = useState("");
  const [rowError, setRowError] = useState({ id: null, message: "" });

  function load() {
    setLoading(true);
    fetchPendingNotes()
      .then((data) => setNotes(data.data || []))
      .catch((err) =>
        setError(getErrorMessage(err, "Could not load pending notes.")),
      )
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleApprove(id) {
    setBusyId(id);
    setRowError({ id: null, message: "" });

    try {
      await updateNoteStatus(id, { status: "approved" });
      load();
    } catch (err) {
      setRowError({
        id,
        message: getErrorMessage(err, "Could not approve note."),
      });
    } finally {
      setBusyId(null);
    }
  }

  function startReject(id) {
    setRejectingId(id);
    setRejectionReason("");
    setRejectionError("");
  }

  async function confirmReject(id) {
    if (!rejectionReason.trim()) {
      setRejectionError("A rejection reason is required.");
      return;
    }

    setBusyId(id);

    try {
      await updateNoteStatus(id, {
        status: "rejected",
        rejectionReason: rejectionReason.trim(),
      });

      setRejectingId(null);
      load();
    } catch (err) {
      setRowError({
        id,
        message: getErrorMessage(err, "Could not reject note."),
      });
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return (
      <div className="border-t border-[var(--border)] py-16">
        <Spinner label="Loading pending notes…" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="error">{error}</Alert>;
  }

  if (notes.length === 0) {
    return (
      <div className="border-y border-[var(--border)] py-20 text-center">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-light)]">
          Queue clear
        </div>

        <p className="mt-3 text-2xl font-black tracking-[-0.04em]">
          Nothing pending review.
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-[var(--border)]">
      {notes.map((note, index) => (
        <div
          key={note.noteId}
          className="group border-b border-[var(--border)] py-7 transition-colors duration-200 hover:bg-[var(--surface-muted)]"
        >
          <div className="grid gap-6 lg:grid-cols-[72px_minmax(0,1fr)_220px]">
            {/* Index */}
            <div className="hidden lg:block">
              <span className="font-mono text-xs font-bold text-[var(--muted-light)]">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Main information */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--muted-light)]">
                      NOTE #{note.noteId}
                    </span>

                    <span className="h-1 w-1 rounded-full bg-[var(--muted-light)]" />

                    <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--warning)]">
                      Awaiting review
                    </span>
                  </div>

                  <h3 className="text-2xl font-black capitalize tracking-[-0.05em] sm:text-3xl">
                    {note.title}
                  </h3>
                </div>
              </div>

              <div className="mt-5 grid gap-x-8 gap-y-3 border-t border-[var(--border)] pt-4 sm:grid-cols-2 xl:grid-cols-4">
                <div>
                  <p className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[var(--muted-light)]">
                    Department
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    #{note.deptId}
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[var(--muted-light)]">
                    Subject
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    #{note.subjectId}
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[var(--muted-light)]">
                    Semester
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {note.semester}
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[var(--muted-light)]">
                    Uploaded
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {formatDate(note.uploadDate)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-2 gap-y-1 text-xs text-[var(--muted)]">
                <span>Uploaded by</span>
                <span className="font-semibold text-[var(--foreground)]">
                  {note.uploadedBy}
                </span>
              </div>

              {note.description && (
                <p className="mt-5 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                  {note.description}
                </p>
              )}

              {rowError.id === note.noteId && (
                <Alert variant="error" className="mt-5">
                  {rowError.message}
                </Alert>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col justify-between gap-4 border-t border-[var(--border)] pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <a
                href={note.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/pdf flex items-center justify-between border-b border-[var(--foreground)] pb-2 text-xs font-bold uppercase tracking-[0.12em]"
              >
                <span>View PDF</span>

                <span className="transition-transform duration-200 group-hover/pdf:translate-x-1">
                  ↗
                </span>
              </a>

              {rejectingId === note.noteId ? (
                <div className="flex flex-col gap-3">
                  <Input
                    label="Rejection reason"
                    value={rejectionReason}
                    onChange={(event) => {
                      setRejectionReason(event.target.value);
                      setRejectionError("");
                    }}
                    error={rejectionError}
                  />

                  <Button
                    variant="danger"
                    onClick={() => confirmReject(note.noteId)}
                    loading={busyId === note.noteId}
                    className="w-full"
                  >
                    Confirm rejection
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setRejectingId(null)}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="grid gap-2">
                  <Button
                    variant="primary"
                    onClick={() => handleApprove(note.noteId)}
                    loading={busyId === note.noteId}
                    className="w-full"
                  >
                    Approve
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => startReject(note.noteId)}
                    className="w-full"
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RejectedNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRejectedNotes()
      .then((data) => setNotes(data.data || []))
      .catch((err) =>
        setError(getErrorMessage(err, "Could not load rejected notes.")),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="border-t border-[var(--border)] py-16">
        <Spinner label="Loading rejected notes…" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="error">{error}</Alert>;
  }

  if (notes.length === 0) {
    return (
      <div className="border-y border-[var(--border)] py-20 text-center">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-light)]">
          Rejection archive
        </div>

        <p className="mt-3 text-2xl font-black tracking-[-0.04em]">
          No rejected notes.
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-[var(--border)]">
      {notes.map((note, index) => (
        <div
          key={note.noteId}
          className="border-b border-[var(--border)] py-7 transition-colors duration-200 hover:bg-[var(--surface-muted)]"
        >
          <div className="grid gap-5 lg:grid-cols-[72px_minmax(0,1fr)_180px]">
            <div className="hidden lg:block">
              <span className="font-mono text-xs font-bold text-[var(--muted-light)]">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-3">
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--muted-light)]">
                  NOTE #{note.noteId}
                </span>

                <Badge tone="rejected">Rejected</Badge>
              </div>

              <h3 className="text-2xl font-black capitalize tracking-[-0.05em] sm:text-3xl">
                {note.title}
              </h3>

              <div className="mt-4 flex flex-wrap gap-x-2 text-xs text-[var(--muted)]">
                <span>Uploaded</span>
                <span className="font-semibold text-[var(--foreground)]">
                  {formatDate(note.uploadDate)}
                </span>
                <span>by</span>
                <span className="font-semibold text-[var(--foreground)]">
                  {note.uploadedBy}
                </span>
              </div>

              {note.rejectionReason && (
                <div className="mt-5 border-l-2 border-[var(--danger)] bg-[var(--surface-muted)] px-4 py-3">
                  <p className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[var(--danger)]">
                    Rejection reason
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {note.rejectionReason}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-start justify-start lg:justify-end">
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--muted-light)]">
                Archived
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SubjectsManager() {
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [deptIds, setDeptIds] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDeptIds, setEditDeptIds] = useState([]);
  const [editErrors, setEditErrors] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [rowError, setRowError] = useState({ id: null, message: "" });

  function load() {
    setLoading(true);

    Promise.all([fetchDepartments(), fetchSubjects()])
      .then(([deptData, subjectData]) => {
        setDepartments(deptData.departments || []);
        setSubjects(Array.isArray(subjectData) ? subjectData : []);
      })
      .catch((err) =>
        setError(getErrorMessage(err, "Could not load subjects.")),
      )
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function toggleDept(list, setList, deptId) {
    setList(
      list.includes(deptId)
        ? list.filter((id) => id !== deptId)
        : [...list, deptId],
    );
  }

  async function handleCreate(event) {
    event.preventDefault();
    setFormError("");

    const nextErrors = {};

    const nameError = validateSubjectName(name);
    if (nameError) nextErrors.subjectName = nameError;

    const deptError = validateSubjectDeptIds(deptIds);
    if (deptError) nextErrors.deptId = deptError;

    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setCreating(true);

    try {
      await createSubject({
        subjectName: name.trim(),
        deptId: deptIds,
      });

      setName("");
      setDeptIds([]);
      load();
    } catch (err) {
      setFormError(
        getErrorMessage(err, "Could not create subject."),
      );
    } finally {
      setCreating(false);
    }
  }

  function startEdit(subject) {
    setEditingId(subject.subjectId);
    setEditName(subject.subjectName);
    setEditDeptIds([...subject.deptId]);
    setEditErrors({});
    setRowError({ id: null, message: "" });
  }

  async function handleSaveEdit(subjectId) {
    const nextErrors = {};

    const nameError = validateSubjectName(editName);
    if (nameError) nextErrors.subjectName = nameError;

    const deptError = validateSubjectDeptIds(editDeptIds);
    if (deptError) nextErrors.deptId = deptError;

    setEditErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setSavingId(subjectId);

    try {
      await updateSubject(subjectId, {
        subjectName: editName.trim(),
        deptId: editDeptIds,
      });

      setEditingId(null);
      load();
    } catch (err) {
      setRowError({
        id: subjectId,
        message: getErrorMessage(
          err,
          "Could not update subject.",
        ),
      });
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(subjectId) {
    if (
      !window.confirm(
        "Delete this subject? This cannot be undone.",
      )
    ) {
      return;
    }

    setDeletingId(subjectId);

    try {
      await deleteSubject(subjectId);
      load();
    } catch (err) {
      setRowError({
        id: subjectId,
        message: getErrorMessage(
          err,
          "Could not delete subject.",
        ),
      });
    } finally {
      setDeletingId(null);
    }
  }

  function toTitleCase(value) {
    return value
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase())
        .replace(/\bAi&Ml\b/i, "AI&ML");
}

function deptNames(ids) {
    return ids
        .map(
            (id) =>
                toTitleCase(
                    departments.find((d) => d.deptId === id)?.deptName ||
                        `#${id}`,
                ),
        )
        .join(", ");
}

  if (loading) {
    return (
      <div className="border-t border-[var(--border)] py-16">
        <Spinner label="Loading subjects…" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="error">{error}</Alert>;
  }

  return (
    <div className="grid gap-10 xl:grid-cols-[360px_minmax(0,1fr)]">
      {/* Create */}
      <div>
        <SectionLabel number="03.1">
          Create subject
        </SectionLabel>

        <div className="mt-5 border-t border-[var(--foreground)] pt-5">
          <h2 className="text-3xl font-black tracking-[-0.05em]">
            New subject
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Create a subject and associate it with one or more
            departments.
          </p>
        </div>

        <form
          onSubmit={handleCreate}
          className="mt-7 flex flex-col gap-5"
        >
          <Input
            label="Subject name"
            placeholder="Data Structures"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setFormErrors((prev) => ({
                ...prev,
                subjectName: undefined,
              }));
            }}
            error={formErrors.subjectName}
          />

          <div>
            <p className="mb-3 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
              Departments
            </p>

            <div className="grid gap-2">
              {departments.map((dept) => (
                <label
                  key={dept.deptId}
                  className={`group flex cursor-pointer items-center justify-between border px-3 py-3 transition-all duration-200 ${
                    deptIds.includes(dept.deptId)
                      ? "border-[var(--foreground)] bg-[var(--accent)]"
                      : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--foreground)]"
                  }`}
                >
                  <span className="text-sm font-semibold">
                      {toTitleCase(dept.deptName)}
                  </span>

                  <span
                    className={`flex h-5 w-5 items-center justify-center border text-[10px] font-bold ${
                      deptIds.includes(dept.deptId)
                        ? "border-black bg-black text-white"
                        : "border-[var(--border)] text-transparent"
                    }`}
                  >
                    ✓
                  </span>

                  <input
                    type="checkbox"
                    className="hidden"
                    checked={deptIds.includes(dept.deptId)}
                    onChange={() => {
                      toggleDept(
                        deptIds,
                        setDeptIds,
                        dept.deptId,
                      );

                      setFormErrors((prev) => ({
                        ...prev,
                        deptId: undefined,
                      }));
                    }}
                  />
                </label>
              ))}
            </div>

            {formErrors.deptId && (
              <p className="mt-2 text-xs text-[var(--danger)]">
                {formErrors.deptId}
              </p>
            )}
          </div>

          {formError && (
            <Alert variant="error">{formError}</Alert>
          )}

          <Button
            type="submit"
            variant="primary"
            loading={creating}
            className="w-full"
          >
            Add subject
          </Button>
        </form>
      </div>

      {/* Existing subjects */}
      <div>
        <SectionLabel number="03.2">
          Existing subjects
        </SectionLabel>

        <div className="mt-5 border-t border-[var(--border)]">
          {subjects.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-[var(--muted)]">
                No subjects created yet.
              </p>
            </div>
          ) : (
            subjects.map((subject, index) => (
              <div
                key={subject.subjectId}
                className="group border-b border-[var(--border)] py-6 transition-colors duration-200 hover:bg-[var(--surface-muted)]"
              >
                {editingId === subject.subjectId ? (
                  <div className="flex flex-col gap-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--muted-light)]">
                          Editing
                        </span>

                        <h3 className="mt-1 text-xl font-black tracking-[-0.04em]">
                          Subject #{subject.subjectId}
                        </h3>
                      </div>

                      <span className="font-mono text-xs text-[var(--muted-light)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <Input
                      value={editName}
                      onChange={(event) => {
                        setEditName(event.target.value);

                        setEditErrors((prev) => ({
                          ...prev,
                          subjectName: undefined,
                        }));
                      }}
                      error={editErrors.subjectName}
                    />

                    <div>
                      <p className="mb-3 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                        Departments
                      </p>

                      <div className="grid gap-2 sm:grid-cols-2">
                        {departments.map((dept) => (
                          <label
                            key={dept.deptId}
                            className={`flex cursor-pointer items-center justify-between border px-3 py-3 transition-all duration-200 ${
                              editDeptIds.includes(dept.deptId)
                                ? "border-[var(--foreground)] bg-[var(--accent)]"
                                : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--foreground)]"
                            }`}
                          >
                            <span className="text-sm font-semibold">
                              {dept.deptName}
                            </span>

                            <span
                              className={`flex h-5 w-5 items-center justify-center border text-[10px] font-bold ${
                                editDeptIds.includes(dept.deptId)
                                  ? "border-black bg-black text-white"
                                  : "border-[var(--border)] text-transparent"
                              }`}
                            >
                              ✓
                            </span>

                            <input
                              type="checkbox"
                              className="hidden"
                              checked={editDeptIds.includes(
                                dept.deptId,
                              )}
                              onChange={() => {
                                toggleDept(
                                  editDeptIds,
                                  setEditDeptIds,
                                  dept.deptId,
                                );

                                setEditErrors((prev) => ({
                                  ...prev,
                                  deptId: undefined,
                                }));
                              }}
                            />
                          </label>
                        ))}
                      </div>

                      {editErrors.deptId && (
                        <p className="mt-2 text-xs text-[var(--danger)]">
                          {editErrors.deptId}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button
                        variant="primary"
                        onClick={() =>
                          handleSaveEdit(subject.subjectId)
                        }
                        loading={
                          savingId === subject.subjectId
                        }
                      >
                        Save changes
                      </Button>

                      <Button
                        variant="ghost"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-[56px_minmax(0,1fr)_auto] sm:items-center">
                    <div>
                      <span className="font-mono text-xs font-bold text-[var(--muted-light)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--muted-light)]">
                          SUBJECT #{subject.subjectId}
                        </span>
                      </div>

                      <h3 className="mt-1 text-xl font-black capitalize tracking-[-0.04em]">
                        {subject.subjectName}
                      </h3>

                      <p className="mt-2 text-xs text-[var(--muted)]">
                        {deptNames(subject.deptId)}
                      </p>
                    </div>

                    <div className="flex gap-2 sm:justify-end">
                      <Button
                        variant="outline"
                        onClick={() => startEdit(subject)}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="danger"
                        onClick={() =>
                          handleDelete(subject.subjectId)
                        }
                        loading={
                          deletingId === subject.subjectId
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )}

                {rowError.id === subject.subjectId && (
                  <Alert variant="error" className="mt-4">
                    {rowError.message}
                  </Alert>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function Admin() {
  const [tab, setTab] = useState("pending");

  return (
    <Container className="py-8 sm:py-12">
      {/* Header */}
      <header className="relative overflow-hidden border-b border-[var(--border)] pb-8">
        <div className="absolute -right-3 -top-10 select-none text-[clamp(7rem,17vw,15rem)] font-black leading-none tracking-[-0.12em] text-[var(--surface-muted)]">
          04
        </div>

        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
              StudySnap / Administration
            </span>

            <Link
              to="/departments"
              className="group inline-flex items-center gap-3 border-b border-[var(--foreground)] pb-1 text-[10px] font-bold uppercase tracking-[0.14em] transition-all duration-200"
            >
              <span>Manage departments</span>

              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          <div className="mt-10 max-w-4xl">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted-light)]">
              Control room
            </div>

            <h1 className="mt-2 text-[clamp(4rem,10vw,8rem)] font-black leading-[0.82] tracking-[-0.09em]">
              Admin.
            </h1>

            <p className="mt-7 max-w-xl text-sm leading-6 text-[var(--muted)] sm:text-base">
              Review submitted notes, manage the academic subject
              catalogue, and keep the StudySnap workspace organised.
            </p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="mt-8 grid border-b border-[var(--border)] sm:flex sm:gap-8">
        {TABS.map((tabItem) => (
          <TabButton
            key={tabItem.key}
            active={tab === tabItem.key}
            onClick={() => setTab(tabItem.key)}
            index={tabItem.index}
          >
            {tabItem.label}
          </TabButton>
        ))}
      </nav>

      {/* Current section heading */}
      <section className="py-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <SectionLabel
              number={
                TABS.find((item) => item.key === tab)?.index || "01"
              }
            >
              {TABS.find((item) => item.key === tab)?.label}
            </SectionLabel>

            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] sm:text-4xl">
              {tab === "pending" && "Review queue"}
              {tab === "rejected" && "Rejected archive"}
              {tab === "subjects" && "Subject catalogue"}
            </h2>
          </div>

          <div className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--muted-light)]">
            Administrative workspace
          </div>
        </div>
      </section>

      {/* Content */}
      <div>
        {tab === "pending" && <PendingNotes />}
        {tab === "rejected" && <RejectedNotes />}
        {tab === "subjects" && <SubjectsManager />}
      </div>

      {/* Footer marker */}
      <footer className="mt-16 flex items-center justify-between border-t border-[var(--border)] pt-5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--muted-light)]">
        <span>StudySnap / Admin</span>
        <span>04 / 04</span>
      </footer>
    </Container>
  );
}

export default Admin;