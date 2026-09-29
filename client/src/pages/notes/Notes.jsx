import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Container from "../../components/ui/Container";
import Alert from "../../components/ui/Alert";
import Spinner from "../../components/ui/Spinner";
import NoteCard from "../../components/notes/NoteCard";
import Pagination from "../../components/ui/Pagination";

import { searchNotes } from "../../api/notes";
import { fetchDepartments } from "../../api/departments";
import { fetchSubjects } from "../../api/subjects";
import { getErrorMessage } from "../../lib/api";
import { SEMESTERS, SEARCH_PAGE_SIZE } from "../../lib/constants";

/*
 * Convert names like:
 * computer engineering -> Computer Engineering
 *
 * Also keeps AI&ML correctly formatted.
 */
const formatTitleCase = (value) => {
  if (!value) return "";

  return value
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bAi&Ml\b/i, "AI&ML");
};

function Notes() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [notes, setNotes] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );

  /*
   * Get filters from URL
   */
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

  /*
   * =========================
   * LOAD DEPARTMENTS + SUBJECTS
   * =========================
   */
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [departmentData, subjectData] =
          await Promise.all([
            fetchDepartments(),
            fetchSubjects(),
          ]);

        /*
         * Department API normally returns:
         *
         * {
         *   departments: [...]
         * }
         *
         * But this also safely handles an array
         * or { data: [...] } response.
         */
        const departmentList = Array.isArray(
          departmentData,
        )
          ? departmentData
          : Array.isArray(
            departmentData?.departments,
          )
            ? departmentData.departments
            : Array.isArray(departmentData?.data)
              ? departmentData.data
              : [];

        /*
         * Subject API normally returns an array.
         * Also safely handle { subjects: [...] }
         * or { data: [...] }.
         */
        const subjectList = Array.isArray(subjectData)
          ? subjectData
          : Array.isArray(subjectData?.subjects)
            ? subjectData.subjects
            : Array.isArray(subjectData?.data)
              ? subjectData.data
              : [];

        setDepartments(departmentList);
        setSubjects(subjectList);
      } catch (err) {
        console.error(
          "Failed to load departments/subjects:",
          err,
        );

        /*
         * Always keep these states as arrays.
         * This prevents:
         *
         * departments.map is not a function
         */
        setDepartments([]);
        setSubjects([]);
      }
    };

    loadFilters();
  }, []);

  /*
   * =========================
   * SEARCH DEBOUNCE
   * =========================
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch = filters.search || "";

      if (searchInput === currentSearch) {
        return;
      }

      updateFilter(
        "search",
        searchInput.trim(),
      );
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  /*
   * =========================
   * LOAD NOTES
   * =========================
   */
  useEffect(() => {
    const loadNotes = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await searchNotes({
          ...filters,
          limit: SEARCH_PAGE_SIZE,
        });

        /*
         * Your existing backend response:
         *
         * {
         *   data: [...],
         *   pagination: {...}
         * }
         */
        const nextPagination = data?.pagination || {
          page: 1,
          totalPages: 1,
          total: 0,
        };

        const nextNotes = Array.isArray(data?.data)
          ? data.data
          : [];

        setNotes(nextNotes);
        setPagination(nextPagination);

        /*
         * If current page no longer exists,
         * move to the last valid page.
         */
        if (
          nextPagination.totalPages > 0 &&
          filters.page > nextPagination.totalPages
        ) {
          const next = new URLSearchParams(
            searchParams,
          );

          next.set(
            "page",
            String(nextPagination.totalPages),
          );

          setSearchParams(next);
        }
      } catch (err) {
        console.error(
          "Failed to load notes:",
          err,
        );

        setNotes([]);

        setPagination({
          page: 1,
          totalPages: 1,
          total: 0,
        });

        setError(
          getErrorMessage(
            err,
            "Could not load notes.",
          ),
        );
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, [filters]);

  /*
   * =========================
   * UPDATE URL FILTER
   * =========================
   */
  function updateFilter(key, value) {
    const next = new URLSearchParams(
      searchParams,
    );

    if (
      value === "" ||
      value === undefined ||
      value === null
    ) {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }

    /*
     * Any filter change should return
     * to page 1.
     */
    if (key !== "page") {
      next.delete("page");
    }

    setSearchParams(next);
  }

  /*
   * =========================
   * SUBJECT FILTER
   * =========================
   */
  const subjectsForDept = useMemo(() => {
    if (!filters.deptId) {
      return subjects;
    }

    const selectedDeptId = Number(
      filters.deptId,
    );

    return subjects.filter((subject) => {
      /*
       * Handle subject.deptId as:
       *
       * 1. number
       * 2. string
       * 3. array
       */
      if (Array.isArray(subject.deptId)) {
        return subject.deptId.some(
          (id) =>
            Number(id) === selectedDeptId,
        );
      }

      return (
        Number(subject.deptId) ===
        selectedDeptId
      );
    });
  }, [subjects, filters.deptId]);

  /*
   * =========================
   * DEPARTMENT NAME
   * =========================
   */
  function departmentName(deptId) {
    const department = departments.find(
      (department) =>
        Number(department.deptId) ===
        Number(deptId),
    );

    return department?.deptName || "";
  }

  /*
   * =========================
   * SUBJECT NAME
   * =========================
   */
  function subjectName(subjectId) {
    const subject = subjects.find(
      (subject) =>
        Number(subject.subjectId) ===
        Number(subjectId),
    );

    return subject?.subjectName || "";
  }

  /*
   * =========================
   * CLEAR ALL FILTERS
   * =========================
   */
  function clearFilters() {
    setSearchParams({});
    setSearchInput("");
  }

  const hasFilters =
    Boolean(filters.semester) ||
    Boolean(filters.deptId) ||
    Boolean(filters.subjectId) ||
    Boolean(filters.search);

  /*
   * =========================
   * PAGE
   * =========================
   */
  return (
    <>
      <Container className="notes-page">
        {/* =========================
            SEARCH
        ========================== */}
        <section className="notes-search-section">
          <form
            onSubmit={(event) => {
              event.preventDefault();

              updateFilter(
                "search",
                searchInput.trim(),
              );
            }}
            className="notes-search-box"
          >
            {/* Search Icon */}
            <div className="search-icon-box">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="6.5"
                />

                <path
                  d="m16 16 4 4"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Input */}
            <div className="search-input-wrapper">
              <label>
                Search library
              </label>

              <input
                type="text"
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(
                    event.target.value,
                  )
                }
                placeholder="Search notes, subjects, topics..."
              />
            </div>

            {/* Status */}
            <div className="search-status">
              <span
                className={
                  searchInput.trim()
                    ? "status-dot active"
                    : "status-dot"
                }
              />

              <span>
                {searchInput.trim()
                  ? "Active"
                  : "Browse all"}
              </span>
            </div>

            {/* Clear search */}
            {searchInput && (
              <button
                type="button"
                className="search-clear"
                onClick={() => {
                  setSearchInput("");
                  updateFilter(
                    "search",
                    "",
                  );
                }}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </form>

          <div className="search-result-count">
            {loading
              ? "Searching..."
              : `${pagination.total} ${pagination.total === 1
                ? "note"
                : "notes"
              } found`}
          </div>
        </section>

        {/* =========================
            FILTERS
        ========================== */}
        <section className="filter-section">
          <div className="filter-heading">
            <div className="filter-title">
              <span>
                Refine results
              </span>

              <div className="filter-line" />
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="clear-all"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="filter-grid">
            {/* Department */}
            <div className="filter-card">
              <label>
                Department
              </label>

              <div className="select-wrapper">
                <select
                  value={filters.deptId}
                  onChange={(event) => {
                    const value =
                      event.target.value;

                    const next =
                      new URLSearchParams(
                        searchParams,
                      );

                    if (value) {
                      next.set(
                        "deptId",
                        value,
                      );
                    } else {
                      next.delete(
                        "deptId",
                      );
                    }

                    /*
                     * Changing department should
                     * remove selected subject.
                     */
                    next.delete(
                      "subjectId",
                    );

                    next.delete("page");

                    setSearchParams(next);
                  }}
                >
                  <option value="">
                    All departments
                  </option>

                  {departments.map(
                    (dept) => (
                      <option
                        key={dept.deptId}
                        value={dept.deptId}
                      >
                        {formatTitleCase(
                          dept.deptName,
                        )}
                      </option>
                    ),
                  )}
                </select>

                <span className="select-arrow">
                  ↓
                </span>
              </div>
            </div>

            {/* Subject */}
            <div className="filter-card">
              <label>
                Subject
              </label>

              <div className="select-wrapper">
                <select
                  value={filters.subjectId}
                  onChange={(event) =>
                    updateFilter(
                      "subjectId",
                      event.target.value,
                    )
                  }
                >
                  <option value="">
                    All subjects
                  </option>

                  {subjectsForDept.map(
                    (subject) => (
                      <option
                        key={
                          subject.subjectId
                        }
                        value={
                          subject.subjectId
                        }
                      >
                        {formatTitleCase(
                          subject.subjectName,
                        )}
                      </option>
                    ),
                  )}
                </select>

                <span className="select-arrow">
                  ↓
                </span>
              </div>
            </div>

            {/* Semester */}
            <div className="filter-card">
              <label>
                Semester
              </label>

              <div className="select-wrapper">
                <select
                  value={filters.semester}
                  onChange={(event) =>
                    updateFilter(
                      "semester",
                      event.target.value,
                    )
                  }
                >
                  <option value="">
                    All semesters
                  </option>

                  {SEMESTERS.map(
                    (semester) => (
                      <option
                        key={semester}
                        value={semester}
                      >
                        Semester {semester}
                      </option>
                    ),
                  )}
                </select>

                <span className="select-arrow">
                  ↓
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            NOTES
        ========================== */}
        <section className="notes-section">
          {loading ? (
            <div className="notes-loading">
              <Spinner label="Loading notes…" />
            </div>
          ) : error ? (
            <Alert variant="error">
              {error}
            </Alert>
          ) : notes.length === 0 ? (
            <div className="empty-notes">
              <div className="empty-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <path d="M6 3.5h9l3 3V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />

                  <path d="M14 3.5V7h4" />

                  <path d="M8 11h8M8 15h6" />
                </svg>
              </div>

              <h3>
                No notes found
              </h3>

              <p>
                No notes match your current
                search and filters.
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="empty-clear"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="notes-grid">
              {notes.map((note) => (
                <NoteCard
                  key={note.noteId}
                  note={note}
                  deptName={departmentName(
                    note.deptId,
                  )}
                  subjectName={subjectName(
                    note.subjectId,
                  )}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading &&
            !error &&
            notes.length > 0 && (
              <div className="pagination-wrapper">
                <Pagination
                  page={pagination.page}
                  totalPages={
                    pagination.totalPages
                  }
                  onChange={(page) =>
                    updateFilter(
                      "page",
                      page,
                    )
                  }
                />
              </div>
            )}
        </section>
      </Container>

      {/* =========================
          CSS
      ========================== */}

      <style>{`
        .notes-page {
          width: 100%;
          padding-top: 32px;
          padding-bottom: 50px;
        }

        /* =========================
           SEARCH
        ========================== */

        .notes-search-section {
          width: 100%;
          margin-bottom: 26px;
        }

        .notes-search-box {
          position: relative;

          width: 100%;
          min-height: 76px;

          display: flex;
          align-items: center;

          gap: 15px;

          padding: 10px;

          border: 1px solid var(--border);
          border-radius: 26px;

          background: #ffffff;

          box-shadow:
            0 14px 40px rgba(0, 0, 0, 0.045);

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .notes-search-box:focus-within {
          border-color: #c9cbc7;

          box-shadow:
            0 16px 42px rgba(0, 0, 0, 0.06);
        }

        .search-icon-box {
          width: 54px;
          height: 54px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 19px;

          background: #b9eadc;
          color: #111111;
        }

        .search-icon-box svg {
          width: 21px;
          height: 21px;
        }

        .search-input-wrapper {
          min-width: 0;
          flex: 1;

          padding: 0 3px;
        }

        .search-input-wrapper label {
          display: block;

          margin-bottom: 3px;

          font-family: monospace;
          font-size: 9px;
          font-weight: 700;

          letter-spacing: 0.22em;
          text-transform: uppercase;

          color: var(--muted);
        }

        .search-input-wrapper input {
          width: 100%;

          padding: 0;

          border: 0;
          outline: 0;

          background: transparent;

          font-size: 17px;
          font-weight: 500;

          color: #111111;
        }

        .search-input-wrapper input::placeholder {
          color: #a2a29d;
        }

        .search-status {
          display: flex;
          align-items: center;

          gap: 8px;

          flex-shrink: 0;

          padding-right: 14px;

          font-family: monospace;
          font-size: 9px;
          font-weight: 700;

          letter-spacing: 0.18em;
          text-transform: uppercase;

          color: var(--muted);
        }

        .status-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #d7d7d2;
        }

        .status-dot.active {
          background: #72c8b0;
        }

        .search-clear {
          width: 30px;
          height: 30px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border: 0;
          border-radius: 50%;

          background: #f1f1ee;

          color: #666666;

          font-size: 20px;
          line-height: 1;

          cursor: pointer;

          transition:
            background 0.2s ease,
            color 0.2s ease;
        }

        .search-clear:hover {
          background: #e5e5e1;
          color: #111111;
        }

        .search-result-count {
          margin-top: 8px;
          padding-left: 5px;

          font-family: monospace;
          font-size: 9px;
          font-weight: 700;

          letter-spacing: 0.12em;
          text-transform: uppercase;

          color: var(--muted);
        }

        /* =========================
           FILTERS
        ========================== */

        .filter-section {
          width: 100%;
          margin-bottom: 30px;
        }

        .filter-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-bottom: 12px;
        }

        .filter-title {
          display: flex;
          align-items: center;

          gap: 12px;
        }

        .filter-title > span {
          font-family: monospace;
          font-size: 9px;
          font-weight: 700;

          letter-spacing: 0.22em;
          text-transform: uppercase;

          color: var(--muted);
        }

        .filter-line {
          width: 32px;
          height: 1px;

          background: var(--border);
        }

        .clear-all {
          border: 0;
          background: transparent;

          padding: 5px 0;

          font-family: monospace;
          font-size: 9px;
          font-weight: 700;

          letter-spacing: 0.18em;
          text-transform: uppercase;

          color: var(--muted);

          cursor: pointer;

          transition: color 0.2s ease;
        }

        .clear-all:hover {
          color: #111111;
        }

        .filter-grid {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 12px;
        }

        .filter-card {
          min-width: 0;

          padding: 13px;

          border: 1px solid var(--border);
          border-radius: 22px;

          background: #ffffff;

          transition:
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }

        .filter-card:hover {
          border-color: #deded9;

          box-shadow:
            0 8px 24px rgba(0, 0, 0, 0.04);
        }

        .filter-card label {
          display: block;

          margin-bottom: 8px;
          padding-left: 4px;

          font-family: monospace;
          font-size: 9px;
          font-weight: 700;

          letter-spacing: 0.2em;
          text-transform: uppercase;

          color: var(--muted);
        }

        .select-wrapper {
          position: relative;
        }

        .select-wrapper select {
          width: 100%;
          height: 43px;

          appearance: none;
          -webkit-appearance: none;

          border: 1px solid #e7e7e3;
          border-radius: 15px;

          background: #f7f7f4;

          padding:
            0 38px
            0 12px;

          outline: none;

          font-size: 13px;
          font-weight: 500;

          color: #111111;

          cursor: pointer;

          transition:
            border-color 0.2s ease,
            background 0.2s ease;
        }

        .select-wrapper select:hover {
          background: #ffffff;
        }

        .select-wrapper select:focus {
          border-color: #111111;
          background: #ffffff;
        }

        .select-arrow {
          position: absolute;

          top: 50%;
          right: 13px;

          transform: translateY(-55%);

          pointer-events: none;

          font-size: 12px;

          color: #777777;
        }

        /* =========================
           NOTES
        ========================== */

        .notes-section {
          width: 100%;
        }

        .notes-grid {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 18px;

          align-items: stretch;
        }

        .notes-loading {
          min-height: 250px;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* =========================
           EMPTY
        ========================== */

        .empty-notes {
          min-height: 270px;

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          text-align: center;

          padding: 35px 20px;

          border: 1px solid var(--border);
          border-radius: 24px;

          background: #ffffff;
        }

        .empty-icon {
          width: 54px;
          height: 54px;

          display: flex;
          align-items: center;
          justify-content: center;

          margin-bottom: 14px;

          border-radius: 17px;

          background: #f3f3f0;

          color: #858585;
        }

        .empty-icon svg {
          width: 26px;
          height: 26px;
        }

        .empty-notes h3 {
          margin: 0 0 7px;

          font-size: 18px;
          font-weight: 700;

          color: #111111;
        }

        .empty-notes p {
          margin: 0;

          font-size: 13px;

          color: var(--muted);
        }

        .empty-clear {
          margin-top: 17px;

          border: 0;
          border-radius: 10px;

          padding: 9px 15px;

          background: #f1f1ee;

          font-size: 12px;
          font-weight: 600;

          color: #333333;

          cursor: pointer;

          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .empty-clear:hover {
          background: #e6e6e2;
          transform: translateY(-1px);
        }

        /* =========================
           PAGINATION
        ========================== */

        .pagination-wrapper {
          width: 100%;

          display: flex;
          justify-content: center;

          margin-top: 30px;
        }

        /* =========================
           TABLET
        ========================== */

        @media (max-width: 1024px) {
          .notes-page {
            padding-top: 26px;
          }

          .notes-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        /* =========================
           MOBILE
        ========================== */

        @media (max-width: 700px) {
          .notes-page {
            padding-top: 18px;
            padding-bottom: 35px;
          }

          .notes-search-box {
            min-height: 64px;

            gap: 10px;

            padding: 7px;

            border-radius: 21px;
          }

          .search-icon-box {
            width: 48px;
            height: 48px;

            border-radius: 16px;
          }

          .search-icon-box svg {
            width: 19px;
            height: 19px;
          }

          .search-input-wrapper label {
            font-size: 8px;
          }

          .search-input-wrapper input {
            font-size: 14px;
          }

          .search-status {
            display: none;
          }

          .search-clear {
            width: 27px;
            height: 27px;
          }

          .search-result-count {
            font-size: 8px;
          }

          .filter-section {
            margin-bottom: 22px;
          }

          .filter-heading {
            margin-bottom: 10px;
          }

          .filter-title {
            gap: 8px;
          }

          .filter-title > span {
            font-size: 8px;
          }

          .filter-line {
            width: 22px;
          }

          .clear-all {
            font-size: 8px;
          }

          .filter-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .filter-card {
            padding: 11px;

            border-radius: 18px;
          }

          .filter-card label {
            margin-bottom: 7px;

            font-size: 8px;
          }

          .select-wrapper select {
            height: 42px;

            border-radius: 13px;

            font-size: 12px;
          }

          .notes-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .empty-notes {
            min-height: 230px;

            border-radius: 20px;

            padding: 30px 18px;
          }

          .pagination-wrapper {
            margin-top: 22px;
          }
        }

        /* =========================
           SMALL MOBILE
        ========================== */

        @media (max-width: 400px) {
          .notes-search-box {
            gap: 8px;
          }

          .search-icon-box {
            width: 44px;
            height: 44px;

            border-radius: 14px;
          }

          .search-input-wrapper input {
            font-size: 13px;
          }

          .search-input-wrapper label {
            font-size: 7px;
            letter-spacing: 0.16em;
          }

          .filter-card {
            padding: 10px;
          }
        }
      `}</style>
    </>
  );
}

export default Notes;