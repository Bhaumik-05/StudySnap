import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/ui/Container";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Alert from "../../components/ui/Alert";
import Spinner from "../../components/ui/Spinner";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../lib/constants";
import { validateDeptName } from "../../lib/validators";
import { getErrorMessage } from "../../lib/api";
import {
  fetchDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../api/departments";

function Departments() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && user?.role === ROLES.ADMIN;

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [newName, setNewName] = useState("");
  const [newNameError, setNewNameError] = useState("");
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editError, setEditError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [rowError, setRowError] = useState({ id: null, message: "" });

  function load() {
    setLoading(true);
    fetchDepartments()
      .then((data) => setDepartments(data.departments || []))
      .catch((error) =>
        setLoadError(getErrorMessage(error, "Could not load departments.")),
      )
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleCreate(event) {
    event.preventDefault();
    setFormError("");
    const error = validateDeptName(newName);
    if (error) {
      setNewNameError(error);
      return;
    }
    setNewNameError("");
    setCreating(true);
    try {
      await createDepartment(newName.trim());
      setNewName("");
      load();
    } catch (error) {
      setFormError(getErrorMessage(error, "Could not create department."));
    } finally {
      setCreating(false);
    }
  }

  function startEdit(dept) {
    setEditingId(dept.deptId);
    setEditValue(dept.deptName);
    setEditError("");
    setRowError({ id: null, message: "" });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValue("");
    setEditError("");
  }

  async function handleSaveEdit(deptId) {
    const error = validateDeptName(editValue);
    if (error) {
      setEditError(error);
      return;
    }
    setSavingId(deptId);
    try {
      await updateDepartment(deptId, editValue.trim());
      setEditingId(null);
      load();
    } catch (error) {
      setRowError({
        id: deptId,
        message: getErrorMessage(error, "Could not update department."),
      });
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(deptId) {
    if (!window.confirm("Delete this department? This cannot be undone.")) {
      return;
    }
    setDeletingId(deptId);
    setRowError({ id: null, message: "" });
    try {
      await deleteDepartment(deptId);
      load();
    } catch (error) {
      setRowError({
        id: deptId,
        message: getErrorMessage(error, "Could not delete department."),
      });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-2 border-b border-[var(--border)] pb-6">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
          03 / Departments
        </span>
        <h1 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
          Departments
        </h1>
        <p className="text-sm text-[var(--muted)]">
          Browse notes by department, or jump straight into a subject.
        </p>
      </div>

      {isAdmin && (
        <form
          onSubmit={handleCreate}
          className="mt-6 flex flex-col gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <Input
              label="New department name"
              placeholder="Computer Engineering"
              value={newName}
              onChange={(event) => {
                setNewName(event.target.value);
                setNewNameError("");
              }}
              error={newNameError}
            />
          </div>
          <Button type="submit" variant="primary" loading={creating}>
            Add department
          </Button>
          {formError && (
            <Alert variant="error" className="sm:ml-3">
              {formError}
            </Alert>
          )}
        </form>
      )}

      <div className="mt-8">
        {loading ? (
          <Spinner label="Loading departments…" />
        ) : loadError ? (
          <Alert variant="error">{loadError}</Alert>
        ) : departments.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No departments yet.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept) => (
              <div
                key={dept.deptId}
                className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4"
              >
                {editingId === dept.deptId ? (
                  <>
                    <Input
                      value={editValue}
                      onChange={(event) => {
                        setEditValue(event.target.value);
                        setEditError("");
                      }}
                      error={editError}
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        onClick={() => handleSaveEdit(dept.deptId)}
                        loading={savingId === dept.deptId}
                      >
                        Save
                      </Button>
                      <Button variant="ghost" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/notes?deptId=${dept.deptId}`}
                        className="font-medium capitalize hover:underline"
                      >
                        {dept.deptName}
                      </Link>
                      <span className="font-mono text-xs text-[var(--muted-light)]">
                        #{dept.deptId}
                      </span>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => startEdit(dept)}>
                          Rename
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(dept.deptId)}
                          loading={deletingId === dept.deptId}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </>
                )}
                {rowError.id === dept.deptId && (
                  <Alert variant="error">{rowError.message}</Alert>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}

export default Departments;
