import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/ui/Container";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Alert from "../../components/ui/Alert";
import Spinner from "../../components/ui/Spinner";
import Badge from "../../components/ui/Badge";
import { fetchPendingNotes, fetchRejectedNotes, updateNoteStatus } from "../../api/admin";
import { fetchDepartments } from "../../api/departments";
import {
  fetchSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../../api/subjects";
import { getErrorMessage } from "../../lib/api";
import { formatDate } from "../../lib/format";
import { validateSubjectName, validateSubjectDeptIds } from "../../lib/validators";

const TABS = [
  { key: "pending", label: "Pending notes" },
  { key: "rejected", label: "Rejected notes" },
  { key: "subjects", label: "Subjects" },
];

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`border-b-2 px-1 pb-3 text-xs font-bold uppercase tracking-[0.12em] transition-colors ${
        active
          ? "border-[var(--foreground)] text-[var(--foreground)]"
          : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
      }`}
    >
      {children}
    </button>
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
      .catch((err) => setError(getErrorMessage(err, "Could not load pending notes.")))
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
      setRowError({ id, message: getErrorMessage(err, "Could not approve note.") });
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
      await updateNoteStatus(id, { status: "rejected", rejectionReason: rejectionReason.trim() });
      setRejectingId(null);
      load();
    } catch (err) {
      setRowError({ id, message: getErrorMessage(err, "Could not reject note.") });
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <Spinner label="Loading pending notes…" />;
  if (error) return <Alert variant="error">{error}</Alert>;
  if (notes.length === 0) {
    return <p className="py-12 text-center text-sm text-[var(--muted)]">Nothing pending review.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {notes.map((note) => (
        <div
          key={note.noteId}
          className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-medium">{note.title}</p>
              <p className="text-xs text-[var(--muted-light)]">
                Dept #{note.deptId} · Subject #{note.subjectId} · Sem {note.semester} · Uploaded{" "}
                {formatDate(note.uploadDate)} by {note.uploadedBy}
              </p>
            </div>
            <a
              href={note.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium underline"
            >
              View PDF
            </a>
          </div>

          {note.description && (
            <p className="mt-2 text-sm text-[var(--muted)]">{note.description}</p>
          )}

          {rowError.id === note.noteId && (
            <Alert variant="error" className="mt-3">
              {rowError.message}
            </Alert>
          )}

          {rejectingId === note.noteId ? (
            <div className="mt-3 flex flex-col gap-2">
              <Input
                label="Rejection reason"
                value={rejectionReason}
                onChange={(event) => {
                  setRejectionReason(event.target.value);
                  setRejectionError("");
                }}
                error={rejectionError}
              />
              <div className="flex gap-2">
                <Button
                  variant="danger"
                  onClick={() => confirmReject(note.noteId)}
                  loading={busyId === note.noteId}
                >
                  Confirm rejection
                </Button>
                <Button variant="ghost" onClick={() => setRejectingId(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-3 flex gap-2">
              <Button
                variant="primary"
                onClick={() => handleApprove(note.noteId)}
                loading={busyId === note.noteId}
              >
                Approve
              </Button>
              <Button variant="outline" onClick={() => startReject(note.noteId)}>
                Reject
              </Button>
            </div>
          )}
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
      .catch((err) => setError(getErrorMessage(err, "Could not load rejected notes.")))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading rejected notes…" />;
  if (error) return <Alert variant="error">{error}</Alert>;
  if (notes.length === 0) {
    return <p className="py-12 text-center text-sm text-[var(--muted)]">No rejected notes.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {notes.map((note) => (
        <div
          key={note.noteId}
          className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-medium">{note.title}</p>
              <p className="text-xs text-[var(--muted-light)]">
                Uploaded {formatDate(note.uploadDate)} by {note.uploadedBy}
              </p>
            </div>
            <Badge tone="rejected">Rejected</Badge>
          </div>
          {note.rejectionReason && (
            <Alert variant="warning" className="mt-3">
              {note.rejectionReason}
            </Alert>
          )}
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
      .catch((err) => setError(getErrorMessage(err, "Could not load subjects.")))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function toggleDept(list, setList, deptId) {
    setList(
      list.includes(deptId) ? list.filter((id) => id !== deptId) : [...list, deptId],
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
      await createSubject({ subjectName: name.trim(), deptId: deptIds });
      setName("");
      setDeptIds([]);
      load();
    } catch (err) {
      setFormError(getErrorMessage(err, "Could not create subject."));
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
      await updateSubject(subjectId, { subjectName: editName.trim(), deptId: editDeptIds });
      setEditingId(null);
      load();
    } catch (err) {
      setRowError({ id: subjectId, message: getErrorMessage(err, "Could not update subject.") });
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(subjectId) {
    if (!window.confirm("Delete this subject? This cannot be undone.")) return;
    setDeletingId(subjectId);
    try {
      await deleteSubject(subjectId);
      load();
    } catch (err) {
      setRowError({ id: subjectId, message: getErrorMessage(err, "Could not delete subject.") });
    } finally {
      setDeletingId(null);
    }
  }

  function deptNames(ids) {
    return ids
      .map((id) => departments.find((d) => d.deptId === id)?.deptName || `#${id}`)
      .join(", ");
  }

  if (loading) return <Spinner label="Loading subjects…" />;
  if (error) return <Alert variant="error">{error}</Alert>;

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={handleCreate}
        className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4"
      >
        <Input
          label="New subject name"
          placeholder="Data Structures"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setFormErrors((prev) => ({ ...prev, subjectName: undefined }));
          }}
          error={formErrors.subjectName}
        />
        <div>
          <p className="mb-1.5 text-sm font-medium">Departments</p>
          <div className="flex flex-wrap gap-2">
            {departments.map((dept) => (
              <label
                key={dept.deptId}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm ${
                  deptIds.includes(dept.deptId)
                    ? "border-[var(--foreground)] bg-[var(--surface-muted)]"
                    : "border-[var(--border)]"
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={deptIds.includes(dept.deptId)}
                  onChange={() => {
                    toggleDept(deptIds, setDeptIds, dept.deptId);
                    setFormErrors((prev) => ({ ...prev, deptId: undefined }));
                  }}
                />
                {dept.deptName}
              </label>
            ))}
          </div>
          {formErrors.deptId && (
            <p className="mt-1 text-xs text-[var(--danger)]">{formErrors.deptId}</p>
          )}
        </div>
        {formError && <Alert variant="error">{formError}</Alert>}
        <Button type="submit" variant="primary" loading={creating} className="self-start">
          Add subject
        </Button>
      </form>

      <div className="flex flex-col gap-3">
        {subjects.map((subject) => (
          <div
            key={subject.subjectId}
            className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            {editingId === subject.subjectId ? (
              <div className="flex flex-col gap-3">
                <Input
                  value={editName}
                  onChange={(event) => {
                    setEditName(event.target.value);
                    setEditErrors((prev) => ({ ...prev, subjectName: undefined }));
                  }}
                  error={editErrors.subjectName}
                />
                <div className="flex flex-wrap gap-2">
                  {departments.map((dept) => (
                    <label
                      key={dept.deptId}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm ${
                        editDeptIds.includes(dept.deptId)
                          ? "border-[var(--foreground)] bg-[var(--surface-muted)]"
                          : "border-[var(--border)]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={editDeptIds.includes(dept.deptId)}
                        onChange={() => {
                          toggleDept(editDeptIds, setEditDeptIds, dept.deptId);
                          setEditErrors((prev) => ({ ...prev, deptId: undefined }));
                        }}
                      />
                      {dept.deptName}
                    </label>
                  ))}
                </div>
                {editErrors.deptId && (
                  <p className="text-xs text-[var(--danger)]">{editErrors.deptId}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    onClick={() => handleSaveEdit(subject.subjectId)}
                    loading={savingId === subject.subjectId}
                  >
                    Save
                  </Button>
                  <Button variant="ghost" onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium capitalize">{subject.subjectName}</p>
                  <p className="text-xs text-[var(--muted-light)]">{deptNames(subject.deptId)}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => startEdit(subject)}>
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(subject.subjectId)}
                    loading={deletingId === subject.subjectId}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}
            {rowError.id === subject.subjectId && (
              <Alert variant="error" className="mt-2">
                {rowError.message}
              </Alert>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Admin() {
  const [tab, setTab] = useState("pending");

  return (
    <Container className="py-10">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border)] pb-6">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
            Control room
          </span>
          <h1 className="mt-2 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
            Admin
          </h1>
        </div>
        <Link
          to="/departments"
          className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
        >
          <span>Manage departments</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>

      <div className="mt-6 flex gap-6 border-b border-[var(--border)]">
        {TABS.map((t) => (
          <TabButton key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </TabButton>
        ))}
      </div>

      <div className="mt-6">
        {tab === "pending" && <PendingNotes />}
        {tab === "rejected" && <RejectedNotes />}
        {tab === "subjects" && <SubjectsManager />}
      </div>
    </Container>
  );
}

export default Admin;
