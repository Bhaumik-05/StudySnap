import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Container from "../ui/Container";
import { ROLES } from "../../lib/constants";

/* =========================================================
   DESKTOP NAV LINK
   Active state = black line stretching from left → right
========================================================= */

const linkClass = ({ isActive }) =>
  `group relative flex h-full items-center gap-2 px-5
   text-[11px] font-bold uppercase tracking-[0.17em]
   transition-colors duration-200
   ${
     isActive
       ? "text-[var(--foreground)]"
       : "text-[var(--muted)] hover:text-[var(--foreground)]"
   }

   after:absolute
   after:bottom-[-1px]
   after:left-0
   after:h-[2px]
   after:bg-[var(--foreground)]
   after:content-['']
   after:transition-all
   after:duration-500
   after:ease-[cubic-bezier(0.22,1,0.36,1)]

   ${
     isActive
       ? "after:w-full"
       : "after:w-0 group-hover:after:w-full"
   }`;

/* =========================================================
   MOBILE NAV LINK
========================================================= */

const mobileLinkClass = ({ isActive }) =>
  `group relative flex items-center justify-between
   border-b border-[var(--border)]
   py-4
   text-sm font-bold uppercase tracking-[0.14em]
   transition-colors duration-200
   ${
     isActive
       ? "text-[var(--foreground)]"
       : "text-[var(--muted)] hover:text-[var(--foreground)]"
   }

   after:absolute
   after:bottom-[-1px]
   after:left-0
   after:h-[2px]
   after:bg-[var(--foreground)]
   after:content-['']
   after:transition-all
   after:duration-500
   after:ease-[cubic-bezier(0.22,1,0.36,1)]

   ${
     isActive
       ? "after:w-full"
       : "after:w-0 group-hover:after:w-full"
   }`;

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await logout();
    } finally {
      setLoggingOut(false);
      navigate("/");
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header
      className="
        sticky top-0 z-50
        border-b border-[var(--border)]
        bg-[var(--background)]/95
        backdrop-blur-md
      "
    >
      <Container
        className="
          flex min-h-[92px]
          items-center justify-between
        "
      >
        {/* =================================================
            STUDYSNAP BRAND
        ================================================= */}

        <NavLink
          to="/"
          aria-label="StudySnap home"
          className="group flex flex-col"
        >
          {/* Main wordmark */}

          <span
            className="
              text-[28px]
              font-black
              leading-none
              tracking-[-0.055em]
              text-[var(--foreground)]
              transition-opacity
              duration-200
              group-hover:opacity-80
            "
          >
            StudySnap
          </span>

          {/* Academic workspace */}

          <span
            className="
              mt-2
              flex items-center gap-2
              font-mono
              text-[8px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-[var(--muted)]
            "
          >
            <span
              className="
                h-px
                w-6
                bg-[var(--muted-light)]
              "
            />

            Academic workspace
          </span>
        </NavLink>

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <nav
          className="
            absolute
            left-1/2
            hidden
            h-full
            -translate-x-1/2
            items-center
            md:flex
          "
        >
          <div
            className="
              flex
              h-full
              items-center
              border-l
              border-r
              border-[var(--border)]
              px-1
            "
          >
            {/* ------------------------------------------------
                DASHBOARD
            ------------------------------------------------ */}

            {isAuthenticated && (
              <NavLink
                to="/dashboard"
                className={linkClass}
              >
                <span>Dashboard</span>
              </NavLink>
            )}

            {/* ------------------------------------------------
                ADMIN
            ------------------------------------------------ */}

            {isAuthenticated &&
              user?.role === ROLES.ADMIN && (
                <NavLink
                  to="/admin"
                  className={linkClass}
                >
                  <span>Admin</span>
                </NavLink>
              )}

            {/* ------------------------------------------------
                DEPARTMENTS
            ------------------------------------------------ */}

            {isAuthenticated &&
              user?.role === ROLES.ADMIN && (
                <NavLink
                  to="/departments"
                  className={linkClass}
                >
                  <span>Departments</span>
                </NavLink>
              )}

            {/* ------------------------------------------------
                NOTES
            ------------------------------------------------ */}

            <NavLink
              to="/notes"
              className={linkClass}
            >
              <span>Notes</span>
            </NavLink>

            {/* ------------------------------------------------
                TAGGED NOTES
            ------------------------------------------------ */}

            {isAuthenticated &&
              user?.role !== ROLES.ADMIN && (
                <NavLink
                  to="/tagged"
                  className={linkClass}
                >
                  <span>Tagged</span>
                </NavLink>
              )}

            {/* ------------------------------------------------
                UPLOAD
            ------------------------------------------------ */}

            {isAuthenticated &&
              user?.role !== ROLES.ADMIN && (
                <>
                  {/* UPLOAD */}

                  <NavLink
                    to="/upload"
                    className={linkClass}
                  >
                    <span>Upload</span>
                  </NavLink>

                  {/* HISTORY */}

                  <div
                    className="
                      relative
                      flex
                      h-full
                      items-center
                    "
                    onMouseEnter={() =>
                      setHistoryOpen(true)
                    }
                    onMouseLeave={() =>
                      setHistoryOpen(false)
                    }
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setHistoryOpen((open) => !open)
                      }
                      className={`
                        group
                        relative
                        flex
                        h-full
                        w-[100px]
                        items-center
                        justify-center
                        px-0
                        text-[11px]
                        font-bold
                        uppercase
                        tracking-[0.17em]
                        transition-colors
                        duration-200

                        ${
                          historyOpen
                            ? "text-[var(--foreground)]"
                            : "text-[var(--muted)] hover:text-[var(--foreground)]"
                        }

                        after:absolute
                        after:bottom-[-1px]
                        after:left-0
                        after:h-[2px]
                        after:bg-[var(--foreground)]
                        after:content-['']
                        after:transition-all
                        after:duration-500
                        after:ease-[cubic-bezier(0.22,1,0.36,1)]

                        ${
                          historyOpen
                            ? "after:w-full"
                            : "after:w-0 group-hover:after:w-full"
                        }
                      `}
                    >
                      <span>History</span>
                    </button>

                    {/* History dropdown */}

                    {historyOpen && (
                      <div
                        className="
                          absolute
                          right-0
                          top-[calc(100%-1px)]
                          w-[230px]
                          border
                          border-[var(--border)]
                          bg-[var(--background)]
                          p-2
                          shadow-[0_18px_45px_rgba(0,0,0,0.08)]
                        "
                      >
                        <div className="px-3 pb-2 pt-2">
                          <span
                            className="
                              font-mono
                              text-[8px]
                              font-bold
                              uppercase
                              tracking-[0.2em]
                              text-[var(--muted)]
                            "
                          >
                            StudySnap / History
                          </span>
                        </div>

                        <NavLink
                          to="/uploads"
                          onClick={() =>
                            setHistoryOpen(false)
                          }
                          className={({ isActive }) => `
                            group
                            flex
                            items-center
                            justify-between
                            rounded-[12px]
                            px-3
                            py-3
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.14em]
                            transition-colors
                            duration-200

                            ${
                              isActive
                                ? "bg-[#b9eadc] text-black"
                                : "text-[var(--foreground)] hover:bg-[#f1f1ed]"
                            }
                          `}
                        >
                          <span>Upload history</span>

                          <span
                            className="
                              transition-transform
                              duration-200
                              group-hover:translate-x-1
                            "
                          >
                            →
                          </span>
                        </NavLink>

                        <NavLink
                          to="/download-history"
                          onClick={() =>
                            setHistoryOpen(false)
                          }
                          className={({ isActive }) => `
                            group
                            flex
                            items-center
                            justify-between
                            rounded-[12px]
                            px-3
                            py-3
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.14em]
                            transition-colors
                            duration-200

                            ${
                              isActive
                                ? "bg-[#b9eadc] text-black"
                                : "text-[var(--foreground)] hover:bg-[#f1f1ed]"
                            }
                          `}
                        >
                          <span>Download history</span>

                          <span
                            className="
                              transition-transform
                              duration-200
                              group-hover:translate-x-1
                            "
                          >
                            →
                          </span>
                        </NavLink>
                      </div>
                    )}
                  </div>
                </>
              )}
          </div>
        </nav>

        {/* =================================================
            DESKTOP RIGHT SIDE
        ================================================= */}

        <div className="hidden items-center md:flex">
          {isAuthenticated ? (
            <div className="flex items-center">

              {/* User / Profile */}

              <NavLink
                to="/profile"
                className="
                  group
                  flex
                  items-center
                  gap-2
                  border-l
                  border-[var(--border)]
                  pl-6
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-[var(--foreground)]
                "
              >
                <span className="max-w-[130px] truncate">
                  {user?.name}
                </span>

                <span
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>
              </NavLink>

              {/* Logout */}

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                aria-label="Log out"
                title="Log out"
                className="
                  ml-5
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-[20px]
                  bg-[#b9eadc]
                  text-black
                  transition-all
                  duration-200
                  hover:scale-[1.03]
                  hover:bg-[#a9e2d3]
                  active:scale-[0.97]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M10 17l5-5-5-5" />
                  <path d="M15 12H3" />
                  <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
                  <path d="M13 21h6a2 2 0 0 0 2-2" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center">

              {/* =================================================
                  LOGIN
              ================================================= */}

              <Link
                to="/login"
                className="
                  group
                  flex
                  items-center
                  gap-3
                  border-r
                  border-[var(--border)]
                  pr-6
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-[var(--foreground)]
                "
              >
                {/* Only arrow moves */}

                <span
                  className="
                    inline-block
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>

                <span>
                  Log in
                </span>
              </Link>

              {/* =================================================
                  JOIN STUDYSNAP
              ================================================= */}

              <Link
                to="/register"
                className="
                  group
                  ml-6
                  flex
                  items-center
                  gap-3
                "
              >
                {/* Mint pill — completely static */}

                <span
                  className="
                    rounded-full
                    bg-[var(--accent)]
                    px-6
                    py-3.5
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-[var(--accent-foreground)]
                  "
                >
                  Join StudySnap
                </span>

                {/* Circular arrow — only this reacts */}

                <span
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[var(--border)]
                    text-sm
                    text-[var(--foreground)]
                  "
                >
                  <span
                    className="
                      inline-block
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  >
                    →
                  </span>
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* =================================================
            MOBILE MENU BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={() =>
            setMenuOpen((open) => !open)
          }
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border
            border-[var(--border)]
            text-sm
            text-[var(--foreground)]
            transition-colors
            duration-200
            hover:border-[var(--foreground)]
            md:hidden
          "
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </Container>

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      {menuOpen && (
        <div
          className="
            border-t
            border-[var(--border)]
            bg-[var(--background)]
            md:hidden
          "
        >
          <Container className="py-6">

            {/* Header */}

            <div
              className="
                mb-4
                flex
                items-center
                justify-between
              "
            >
              <span
                className="
                  font-mono
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-[var(--muted)]
                "
              >
                Navigation
              </span>

              <span
                className="
                  font-mono
                  text-[9px]
                  text-[var(--muted-light)]
                "
              >
                StudySnap / 01
              </span>
            </div>

            {/* Links */}

            <nav className="flex flex-col">

              {/* Dashboard */}

              {isAuthenticated && (
                <NavLink
                  to="/dashboard"
                  className={mobileLinkClass}
                  onClick={closeMenu}
                >
                  <span>Dashboard</span>

                  <span>→</span>
                </NavLink>
              )}

              {/* Admin */}

              {isAuthenticated &&
                user?.role === ROLES.ADMIN && (
                  <NavLink
                    to="/admin"
                    className={mobileLinkClass}
                    onClick={closeMenu}
                  >
                    <span>Admin</span>

                    <span>→</span>
                  </NavLink>
                )}

              {/* Departments */}

              {isAuthenticated &&
                user?.role === ROLES.ADMIN && (
                  <NavLink
                    to="/departments"
                    className={mobileLinkClass}
                    onClick={closeMenu}
                  >
                    <span>Departments</span>

                    <span>→</span>
                  </NavLink>
                )}

              {/* Notes */}

              <NavLink
                to="/notes"
                className={mobileLinkClass}
                onClick={closeMenu}
              >
                <span>Notes</span>

                <span>→</span>
              </NavLink>

              {/* Tagged */}

              {isAuthenticated &&
                user?.role !== ROLES.ADMIN && (
                  <NavLink
                    to="/tagged"
                    className={mobileLinkClass}
                    onClick={closeMenu}
                  >
                    <span>Tagged</span>

                    <span>→</span>
                  </NavLink>
                )}

              {/* Upload */}

              {isAuthenticated &&
                user?.role !== ROLES.ADMIN && (
                  <NavLink
                    to="/upload"
                    className={mobileLinkClass}
                    onClick={closeMenu}
                  >
                    <span>Upload</span>

                    <span>→</span>
                  </NavLink>
                )}

              {/* Upload History */}

              {isAuthenticated &&
                user?.role !== ROLES.ADMIN && (
                  <NavLink
                    to="/uploads"
                    className={mobileLinkClass}
                    onClick={closeMenu}
                  >
                    <span>Upload history</span>

                    <span>→</span>
                  </NavLink>
                )}

              {/* Download History */}

              {isAuthenticated &&
                user?.role !== ROLES.ADMIN && (
                  <NavLink
                    to="/download-history"
                    className={mobileLinkClass}
                    onClick={closeMenu}
                  >
                    <span>Download history</span>

                    <span>→</span>
                  </NavLink>
                )}

            </nav>

            {/* =================================================
                MOBILE ACTIONS
            ================================================= */}

            <div
              className="
                mt-6
                flex
                items-center
                justify-between
                border-t
                border-[var(--border)]
                pt-6
              "
            >
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  aria-label="Log out"
                  title="Log out"
                  className="
                    flex
                    h-14
                    w-14
                    shrink-0
                    items-center
                    justify-center
                    rounded-[20px]
                    bg-[#b9eadc]
                    text-black
                    transition-all
                    duration-200
                    hover:scale-[1.03]
                    hover:bg-[#a9e2d3]
                    active:scale-[0.97]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M10 17l5-5-5-5" />
                    <path d="M15 12H3" />
                    <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
                    <path d="M13 21h6a2 2 0 0 0 2-2" />
                  </svg>
                </button>
              ) : (
                <>
                  {/* Mobile Login */}

                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="
                      group
                      flex
                      items-center
                      gap-2
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.16em]
                      text-[var(--foreground)]
                    "
                  >
                    <span
                      className="
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    >
                      →
                    </span>

                    Log in
                  </Link>

                  {/* Mobile Join */}

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="
                      group
                      flex
                      items-center
                      gap-2
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.16em]
                      text-[var(--foreground)]
                    "
                  >
                    Join StudySnap

                    <span
                      className="
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    >
                      →
                    </span>
                  </Link>
                </>
              )}
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}

export default Navbar;