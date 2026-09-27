import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Container from "../../components/ui/Container";
import Alert from "../../components/ui/Alert";
import Spinner from "../../components/ui/Spinner";

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
   *
   * Expected backend response:
   *
   * {
   *   departments: [...]
   * }
   *
   * We also support a direct array response in case
   * the backend returns:
   *
   * [...]
   */
  const loadDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError("");

      const response = await fetchDepartments();

      let departmentList = [];

      if (Array.isArray(response)) {
        departmentList = response;
      } else if (Array.isArray(response?.departments)) {
        departmentList = response.departments;
      } else if (Array.isArray(response?.data)) {
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

  function toTitleCase(text) {
    return text
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return (
    <Container className="py-10 sm:py-14">

      {/* =========================================
          HEADER
      ========================================= */}
      <section className="border-b border-[var(--border)] pb-8">

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

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
              Browse the academic departments available
              in StudySnap.
            </p>
          </div>

          {/* ADMIN ONLY */}
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

      {/* =========================================
          ADMIN INFORMATION
      ========================================= */}
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
              You can create, rename and delete departments.
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

      {/* =========================================
          ERROR
      ========================================= */}
      {deleteError && (
        <div className="mt-6">
          <Alert variant="error">
            {deleteError}
          </Alert>
        </div>
      )}

      {/* =========================================
          DEPARTMENT LIST
      ========================================= */}
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
          <div className="border border-[var(--border)] bg-[var(--surface)] p-6">
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
                There are currently no departments available.
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
                (department, index) => {
                  const deptId = department.deptId;

                  const isEditing =
                    editingId === deptId;

                  const isSaving =
                    savingId === deptId;

                  const isDeleting =
                    deletingId === deptId;

                  return (
                    <article
                      key={deptId}
                      className="
                        group
                        relative
                        min-h-[250px]
                        bg-[var(--background)]
                        p-6
                        transition-all
                        duration-300
                        hover:bg-[var(--surface)]
                      "
                    >
                      {/* Top */}
                      <div className="flex items-start justify-between">

                        <span
                          className="
                            font-mono
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.18em]
                            text-[var(--muted-light)]
                          "
                        >
                          Department
                        </span>

                        <span
                          className="
                            font-mono
                            text-[9px]
                            text-[var(--muted-light)]
                          "
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Content */}
                      {isEditing ? (
                        <div className="mt-12">

                          <label
                            htmlFor={`department-${deptId}`}
                            className="
                              font-mono
                              text-[9px]
                              font-bold
                              uppercase
                              tracking-[0.16em]
                              text-[var(--muted)]
                            "
                          >
                            Rename department
                          </label>

                          <input
                            id={`department-${deptId}`}
                            type="text"
                            value={editValue}
                            onChange={(event) => {
                              setEditValue(
                                event.target.value
                              );
                              setEditError("");
                            }}
                            onKeyDown={(event) => {
                              if (
                                event.key ===
                                "Enter"
                              ) {
                                handleSaveEdit(
                                  deptId
                                );
                              }

                              if (
                                event.key ===
                                "Escape"
                              ) {
                                cancelEdit();
                              }
                            }}
                            autoFocus
                            disabled={isSaving}
                            className="
                              mt-3
                              w-full
                              border-0
                              border-b
                              border-[var(--border)]
                              bg-transparent
                              px-0
                              py-2
                              text-lg
                              font-bold
                              outline-none
                              transition-colors
                              focus:border-[var(--foreground)]
                            "
                          />

                          {editError && (
                            <p
                              className="
                                mt-3
                                text-xs
                                text-[var(--danger)]
                              "
                            >
                              {editError}
                            </p>
                          )}

                          <div className="mt-6 flex gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                handleSaveEdit(
                                  deptId
                                )
                              }
                              disabled={isSaving}
                              className="
                                border
                                border-[var(--foreground)]
                                bg-[var(--foreground)]
                                px-4
                                py-2
                                font-mono
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.12em]
                                text-[var(--background)]
                                disabled:opacity-50
                              "
                            >
                              {isSaving
                                ? "Saving..."
                                : "Save"}
                            </button>

                            <button
                              type="button"
                              onClick={cancelEdit}
                              disabled={isSaving}
                              className="
                                border
                                border-[var(--border)]
                                px-4
                                py-2
                                font-mono
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.12em]
                                text-[var(--foreground)]
                                hover:bg-[var(--surface-muted)]
                                disabled:opacity-50
                              "
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h2
                            className="
                              mt-14
                              max-w-[90%]
                              text-2xl
                              font-black
                              leading-none
                              tracking-[-0.045em]
                              transition-transform
                              duration-300
                              group-hover:translate-x-1
                            "
                          >
                            {toTitleCase(department.deptName)}
                          </h2>

                          <div
                            className="
                              mt-5
                              h-[2px]
                              w-8
                              bg-[var(--foreground)]
                              transition-all
                              duration-500
                              group-hover:w-16
                            "
                          />

                          <p
                            className="
                              mt-4
                              max-w-sm
                              text-sm
                              leading-6
                              text-[var(--muted)]
                            "
                          >
                            Explore subjects and academic
                            notes associated with this
                            department.
                          </p>
                        </>
                      )}

                      {/* ADMIN CONTROLS */}
                      {isAdmin &&
                        !isEditing && (
                          <div
                            className="
                              absolute
                              bottom-0
                              left-0
                              right-0
                              flex
                              items-center
                              justify-between
                              border-t
                              border-[var(--border)]
                              px-6
                              py-3
                            "
                          >
                            <button
                              type="button"
                              onClick={() =>
                                startEdit(
                                  department
                                )
                              }
                              className="
                                font-mono
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.14em]
                                text-[var(--muted)]
                                transition-colors
                                hover:text-[var(--foreground)]
                              "
                            >
                              Rename
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  deptId
                                )
                              }
                              disabled={
                                isDeleting
                              }
                              className="
                                font-mono
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.14em]
                                text-[var(--danger)]
                                transition-opacity
                                hover:opacity-70
                                disabled:opacity-40
                              "
                            >
                              {isDeleting
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        )}

                      {/* Bottom editorial line */}
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
                          group-hover:w-full
                        "
                      />
                    </article>
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