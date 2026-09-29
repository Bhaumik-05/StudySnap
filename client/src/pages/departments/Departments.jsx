import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Container from "../../components/ui/Container";
import Alert from "../../components/ui/Alert";
import Spinner from "../../components/ui/Spinner";
import DepartmentCard from "../../components/departments/DepartmentCard";

import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../lib/constants";
import { validateDeptName } from "../../lib/validators";
import { getErrorMessage } from "../../lib/api";

import {
  fetchDepartments,
  updateDepartment,
  deleteDepartment,
} from "../../api/departments";

function Departments() {
  const { user, isAuthenticated } = useAuth();

  const isAdmin =
    isAuthenticated && user?.role === ROLES.ADMIN;

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Editing
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editError, setEditError] = useState("");
  const [savingId, setSavingId] = useState(null);

  // Deleting
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  /*
   * Load departments
   */
  const loadDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError("");

      const response = await fetchDepartments();

      let departmentList = [];

      if (Array.isArray(response)) {
        departmentList = response;
      } else if (
        Array.isArray(response?.departments)
      ) {
        departmentList = response.departments;
      } else if (
        Array.isArray(response?.data)
      ) {
        departmentList = response.data;
      }

      setDepartments(departmentList);
    } catch (error) {
      console.error(
        "Load departments error:",
        error
      );

      setLoadError(
        getErrorMessage(
          error,
          "Could not load departments."
        )
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  /*
   * Start editing
   */
  function startEdit(department) {
    setEditingId(department.deptId);
    setEditValue(department.deptName || "");
    setEditError("");
    setDeleteError("");
  }

  /*
   * Cancel editing
   */
  function cancelEdit() {
    setEditingId(null);
    setEditValue("");
    setEditError("");
  }

  /*
   * Update department
   */
  async function handleSaveEdit(deptId) {
    const validationError =
      validateDeptName(editValue);

    if (validationError) {
      setEditError(validationError);
      return;
    }

    try {
      setSavingId(deptId);
      setEditError("");
      setDeleteError("");

      await updateDepartment(
        deptId,
        editValue.trim()
      );

      setEditingId(null);
      setEditValue("");

      await loadDepartments();
    } catch (error) {
      console.error(
        "Update department error:",
        error
      );

      setEditError(
        getErrorMessage(
          error,
          "Could not update department."
        )
      );
    } finally {
      setSavingId(null);
    }
  }

  /*
   * Delete department
   */
  async function handleDelete(deptId) {
    const confirmed = window.confirm(
      "Delete this department? This cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(deptId);
      setDeleteError("");

      await deleteDepartment(deptId);

      await loadDepartments();
    } catch (error) {
      console.error(
        "Delete department error:",
        error
      );

      setDeleteError(
        getErrorMessage(
          error,
          "Could not delete department."
        )
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Container className="py-10 sm:py-14">
      {/* HEADER */}
      <section className="border-b border-[var(--border)] pb-8">
        <div
          className="
                        flex
                        flex-col
                        gap-6
                        sm:flex-row
                        sm:items-end
                        sm:justify-between
                    "
        >
          <div>
            <span
              className="
                                font-mono
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.2em]
                                text-[var(--muted)]
                            "
            >
              02 / Academic structure
            </span>

            <h1
              className="
                                mt-4
                                text-5xl
                                font-black
                                leading-none
                                tracking-[-0.06em]
                                sm:text-6xl
                            "
            >
              Departments
            </h1>

            <p
              className="
                                mt-5
                                max-w-2xl
                                text-sm
                                leading-6
                                text-[var(--muted)]
                            "
            >
              Browse the academic departments
              available in StudySnap.
            </p>
          </div>

          {/* Admin create button */}
          {isAdmin && (
            <Link
              to="/departments/create"
              className="
                                inline-flex
                                h-11
                                items-center
                                justify-center
                                border
                                border-[#b9eadc]
                                bg-[#b9eadc]
                                px-5
                                font-mono
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.14em]
                                text-[#111111]
                                shadow-sm
                                transition-all
                                duration-200
                                hover:-translate-y-0.5
                                hover:bg-[#a7e1d1]
                                hover:shadow-md
                            "
            >
              + New department
            </Link>
          )}
        </div>
      </section>

      {/* ADMIN INFORMATION */}
      {isAdmin && (
        <div
          className="
                        mt-6
                        flex
                        flex-col
                        gap-2
                        border
                        border-[var(--border)]
                        bg-[var(--surface)]
                        p-5
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
        >
          <div>
            <p className="text-sm font-bold">
              Administrator mode
            </p>

            <p className="mt-1 text-xs text-[var(--muted)]">
              You can create, rename and delete
              departments.
            </p>
          </div>

          <span
            className="
                            w-fit
                            border
                            border-[var(--border)]
                            px-3
                            py-1.5
                            font-mono
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.15em]
                            text-[var(--muted)]
                        "
          >
            ADMIN
          </span>
        </div>
      )}

      {/* DELETE ERROR */}
      {deleteError && (
        <div className="mt-6">
          <Alert variant="error">
            {deleteError}
          </Alert>
        </div>
      )}

      {/* DEPARTMENT LIST */}
      <section className="mt-10">
        <div
          className="
                        mb-4
                        flex
                        items-center
                        justify-between
                        border-b
                        border-[var(--border)]
                        pb-3
                    "
        >
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
            {departments.length}{" "}
            {departments.length === 1
              ? "department"
              : "departments"}
          </span>

          <span
            className="
                            hidden
                            font-mono
                            text-[9px]
                            uppercase
                            tracking-[0.15em]
                            text-[var(--muted-light)]
                            sm:block
                        "
          >
            {isAdmin
              ? "Manage academic structure"
              : "Academic directory"}
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <Spinner label="Loading departments…" />
        )}

        {/* Error */}
        {!loading && loadError && (
          <div
            className="
                            border
                            border-[var(--border)]
                            bg-[var(--surface)]
                            p-6
                        "
          >
            <Alert variant="error">
              {loadError}
            </Alert>

            <button
              type="button"
              onClick={loadDepartments}
              className="
                                mt-4
                                border
                                border-[var(--border)]
                                px-4
                                py-2
                                font-mono
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.14em]
                                transition-colors
                                hover:bg-[var(--foreground)]
                                hover:text-[var(--background)]
                            "
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !loadError &&
          departments.length === 0 && (
            <div
              className="
                                border
                                border-dashed
                                border-[var(--border)]
                                bg-[var(--surface)]
                                px-6
                                py-20
                                text-center
                            "
            >
              <p className="text-lg font-bold">
                No departments found
              </p>

              <p className="mt-2 text-sm text-[var(--muted)]">
                There are currently no
                departments available.
              </p>

              {isAdmin && (
                <Link
                  to="/departments/create"
                  className="
                                        mt-6
                                        inline-flex
                                        border
                                        border-[#b9eadc]
                                        bg-[#b9eadc]
                                        px-5
                                        py-3
                                        font-mono
                                        text-[9px]
                                        font-bold
                                        uppercase
                                        tracking-[0.14em]
                                        text-[#111111]
                                        shadow-sm
                                        transition-all
                                        duration-200
                                        hover:-translate-y-0.5
                                        hover:bg-[#a7e1d1]
                                        hover:shadow-md
                                    "
                >
                  Create department
                </Link>
              )}
            </div>
          )}

        {/* Department cards */}
        {!loading &&
          !loadError &&
          departments.length > 0 && (
            <div
              className="
                                grid
                                gap-px
                                border
                                border-[var(--border)]
                                bg-[var(--border)]
                                sm:grid-cols-2
                                lg:grid-cols-3
                            "
            >
              {departments.map(
                (department) => {
                  const deptId =
                    department.deptId;

                  return (
                    <DepartmentCard
                      key={deptId}
                      department={
                        department
                      }
                      isAdmin={isAdmin}
                      onEdit={
                        startEdit
                      }
                      onDelete={
                        handleDelete
                      }
                    />
                  );
                }
              )}
            </div>
          )}
      </section>
    </Container>
  );
}

export default Departments;