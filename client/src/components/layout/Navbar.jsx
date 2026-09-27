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
                NOTES
            ------------------------------------------------ */}

            <NavLink
              to="/notes"
              className={linkClass}
            >
              <span
                className="
                  font-mono
                  text-[8px]
                  text-[var(--muted-light)]
                "
              >
                01
              </span>

              <span>Notes</span>
            </NavLink>

            {/* ------------------------------------------------
                DEPARTMENTS
            ------------------------------------------------ */}

            <NavLink
              to="/departments"
              className={linkClass}
            >
              <span
                className="
                  font-mono
                  text-[8px]
                  text-[var(--muted-light)]
                "
              >
                02
              </span>

              <span>Departments</span>
            </NavLink>

            {/* ------------------------------------------------
                UPLOAD
            ------------------------------------------------ */}

            {isAuthenticated && user?.role !== ROLES.ADMIN && (
              <NavLink
                to="/upload"
                className={linkClass}
              >
                <span
                  className="
                    font-mono
                    text-[8px]
                    text-[var(--muted-light)]
                  "
                >
                  03
                </span>

                <span>Upload</span>
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
                  <span
                    className="
                      font-mono
                      text-[8px]
                      text-[var(--muted-light)]
                    "
                  >
                    04
                  </span>

                  <span>Admin</span>
                </NavLink>
              )}
          </div>
        </nav>

        {/* =================================================
            DESKTOP RIGHT SIDE
        ================================================= */}

        {/* =================================================
    DESKTOP RIGHT SIDE
================================================= */}

<div className="hidden items-center md:flex">

  {isAuthenticated ? (
    <div className="flex items-center">

      {/* Dashboard / User */}
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
        className="
          group
          ml-6
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
          text-[var(--muted)]
          transition-colors
          duration-200
          hover:text-[var(--foreground)]
          disabled:opacity-50
        "
      >
        <span>
          {loggingOut ? "Leaving…" : "Log out"}
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

              {/* Notes */}

              <NavLink
                to="/notes"
                className={mobileLinkClass}
                onClick={closeMenu}
              >
                <span className="flex items-center gap-3">
                  <span
                    className="
                      font-mono
                      text-[9px]
                      text-[var(--muted-light)]
                    "
                  >
                    01
                  </span>

                  Notes
                </span>

                <span>→</span>
              </NavLink>

              {/* Departments */}

              <NavLink
                to="/departments"
                className={mobileLinkClass}
                onClick={closeMenu}
              >
                <span className="flex items-center gap-3">
                  <span
                    className="
                      font-mono
                      text-[9px]
                      text-[var(--muted-light)]
                    "
                  >
                    02
                  </span>

                  Departments
                </span>

                <span>→</span>
              </NavLink>

              {/* Upload */}

              {isAuthenticated && user?.role !== ROLES.ADMIN && (
                <NavLink
                  to="/upload"
                  className={mobileLinkClass}
                  onClick={closeMenu}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className="
                        font-mono
                        text-[9px]
                        text-[var(--muted-light)]
                      "
                    >
                      03
                    </span>

                    Upload
                  </span>

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
                    <span className="flex items-center gap-3">
                      <span
                        className="
                          font-mono
                          text-[9px]
                          text-[var(--muted-light)]
                        "
                      >
                        04
                      </span>

                      Admin
                    </span>

                    <span>→</span>
                  </NavLink>
                )}

              {/* Dashboard */}

              {isAuthenticated && (
                <NavLink
                  to="/profile"
                  className={mobileLinkClass}
                  onClick={closeMenu}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className="
                        font-mono
                        text-[9px]
                        text-[var(--muted-light)]
                      "
                    >
                      05
                    </span>

                    Dashboard
                  </span>

                  <span
                    className="
                      max-w-[120px]
                      truncate
                      text-[var(--muted)]
                    "
                  >
                    {user?.name}
                  </span>
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
                  className="
                    group
                    flex
                    items-center
                    gap-3
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-[var(--foreground)]
                    disabled:opacity-50
                  "
                >
                  <span>
                    {loggingOut
                      ? "Leaving…"
                      : "Log out"}
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