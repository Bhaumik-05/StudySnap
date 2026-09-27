import { useEffect, useState } from "react";
import Container from "../../components/ui/Container";
import Alert from "../../components/ui/Alert";
import Spinner from "../../components/ui/Spinner";
import { fetchDashboardStats } from "../../api/dashboard";
import { getErrorMessage } from "../../lib/api";
import { roleLabel } from "../../lib/format";
import { ROLES } from "../../lib/constants";
import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchDashboardStats();

        if (mounted) {
          setStats(data);
        }
      } catch (error) {
        if (mounted) {
          setError(
            getErrorMessage(
              error,
              "Could not load dashboard statistics.",
            ),
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Container className="py-8 sm:py-12">
        <div className="border-t border-[var(--border)] py-20">
          <Spinner label="Loading dashboard…" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-8 sm:py-12">
        <Alert variant="error">{error}</Alert>
      </Container>
    );
  }

  if (!stats) {
    return null;
  }

  const isAdmin = user?.role === ROLES.ADMIN;

  const totalNotes = stats.totalNotes ?? 0;
  const pendingNotes = stats.pendingNotes ?? 0;
  const approvedNotes = stats.approvedNotes ?? 0;
  const rejectedNotes = stats.rejectedNotes ?? 0;
  const totalDownloads = stats.totalDownloads ?? 0;
  const totalUsers = stats.totalUsers ?? 0;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[var(--surface)]">
      <div className="grid min-h-[calc(100vh-5rem)] lg:grid-cols-[1.12fr_0.88fr]">

        {/* =========================================================
            LEFT — STATISTICS
        ========================================================== */}

        <section
          className="
            border-b border-[var(--border)]
            px-6 py-7
            sm:px-9 sm:py-9
            lg:border-b-0 lg:border-r
            lg:px-11 lg:py-10
            xl:px-14
          "
        >

          {/* HEADER */}

          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
              StudySnap
            </span>

            <span className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[var(--muted-light)]">
              Dashboard / 06
            </span>
          </div>

          {/* INTRO */}

          <div className="mt-8 flex items-end justify-between gap-8">
            <div>
              <p className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[var(--muted-light)]">
                {isAdmin
                  ? "Administrative overview"
                  : "Academic workspace"}
              </p>

              <h1
                className="
                  mt-2
                  text-[clamp(3.2rem,5vw,5rem)]
                  font-black
                  leading-[0.82]
                  tracking-[-0.085em]
                  text-[var(--foreground)]
                "
              >
                Dashboard.
              </h1>
            </div>

            <p className="hidden max-w-[220px] pb-1 text-xs leading-5 text-[var(--muted)] sm:block">
              {isAdmin
                ? "A clear view of users, notes and platform activity."
                : "A clear view of your notes and learning activity."}
            </p>
          </div>

          {/* ACCOUNT */}

          <div className="mt-8 border-y border-[var(--border)] py-3.5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[7px] font-bold uppercase tracking-[0.18em] text-[var(--muted-light)]">
                  Current account
                </span>

                <div className="mt-1 flex items-baseline gap-2">
                  <p className="text-base font-black tracking-[-0.03em]">
                    {user?.name}
                  </p>

                  <span className="text-[11px] text-[var(--muted)]">
                    {roleLabel(user?.role)}
                  </span>
                </div>
              </div>

              <span className="font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-[var(--muted-light)]">
                {user?.userId}
              </span>
            </div>
          </div>

          {/* STATISTICS */}

          <div className="mt-8">

            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[8px] font-bold uppercase tracking-[0.17em] text-[var(--muted-light)]">
                {isAdmin ? "Platform statistics" : "Your statistics"}
              </span>

              <span className="font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-[var(--muted-light)]">
                Live
              </span>
            </div>

            {/* PRIMARY SQUIRCLE */}

            <div
              className="
                relative overflow-hidden
                rounded-[30px]
                [corner-shape:squircle]
                border border-[var(--foreground)]
                bg-[var(--foreground)]
                p-6
                text-[var(--surface)]
                sm:p-7
              "
            >
              {/* decorative number */}

              <span
                aria-hidden="true"
                className="
                  absolute
                  -right-3
                  -top-8
                  select-none
                  text-[8rem]
                  font-black
                  leading-none
                  tracking-[-0.12em]
                  text-white/[0.045]
                "
              >
                01
              </span>

              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <span className="font-mono text-[8px] font-bold uppercase tracking-[0.17em] opacity-55">
                    {isAdmin
                      ? "Registered users"
                      : "Your notes"}
                  </span>

                  <p
                    className="
                      mt-4
                      text-[clamp(3.2rem,5vw,5rem)]
                      font-black
                      leading-[0.75]
                      tracking-[-0.1em]
                    "
                  >
                    {isAdmin ? totalUsers : totalNotes}
                  </p>
                </div>

                <span className="text-xl font-black opacity-45">
                  ↗
                </span>
              </div>

              <div className="relative z-10 mt-7 border-t border-white/20 pt-3">
                <p className="max-w-xs text-[10px] leading-4 opacity-60">
                  {isAdmin
                    ? "Total accounts currently registered on StudySnap."
                    : "Total notes currently associated with your account."}
                </p>
              </div>
            </div>

            {/* SMALL SQUIRCLES */}

            <div className="mt-3 grid grid-cols-2 gap-3">

              {/* PENDING */}

              <div
                className="
                  rounded-[24px]
                  [corner-shape:squircle]
                  border border-[var(--border)]
                  p-5
                  transition-colors
                  duration-200
                  hover:bg-[var(--surface-muted)]
                "
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[var(--muted-light)]">
                    Pending
                  </span>

                  <span className="font-mono text-[7px] text-[var(--muted-light)]">
                    02
                  </span>
                </div>

                <p className="mt-7 text-[2.8rem] font-black leading-none tracking-[-0.09em]">
                  {pendingNotes}
                </p>

                <p className="mt-2 text-[10px] text-[var(--muted)]">
                  Awaiting review
                </p>
              </div>

              {/* APPROVED */}

              <div
                className="
                  rounded-[24px]
                  [corner-shape:squircle]
                  border border-[var(--border)]
                  p-5
                  transition-colors
                  duration-200
                  hover:bg-[var(--surface-muted)]
                "
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[var(--muted-light)]">
                    Approved
                  </span>

                  <span className="font-mono text-[7px] text-[var(--muted-light)]">
                    03
                  </span>
                </div>

                <p className="mt-7 text-[2.8rem] font-black leading-none tracking-[-0.09em]">
                  {approvedNotes}
                </p>

                <p className="mt-2 text-[10px] text-[var(--muted)]">
                  Successfully approved
                </p>
              </div>

              {/* REJECTED */}

              <div
                className="
                  rounded-[24px]
                  [corner-shape:squircle]
                  border border-[var(--border)]
                  p-5
                  transition-colors
                  duration-200
                  hover:bg-[var(--surface-muted)]
                "
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[var(--muted-light)]">
                    Rejected
                  </span>

                  <span className="font-mono text-[7px] text-[var(--muted-light)]">
                    04
                  </span>
                </div>

                <p className="mt-7 text-[2.8rem] font-black leading-none tracking-[-0.09em]">
                  {rejectedNotes}
                </p>

                <p className="mt-2 text-[10px] text-[var(--muted)]">
                  Not approved
                </p>
              </div>

              {/* DOWNLOADS */}

              <div
                className="
                  rounded-[24px]
                  [corner-shape:squircle]
                  border border-[var(--border)]
                  p-5
                  transition-colors
                  duration-200
                  hover:bg-[var(--surface-muted)]
                "
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[var(--muted-light)]">
                    Downloads
                  </span>

                  <span className="font-mono text-[7px] text-[var(--muted-light)]">
                    05
                  </span>
                </div>

                <p className="mt-7 text-[2.8rem] font-black leading-none tracking-[-0.09em]">
                  {totalDownloads}
                </p>

                <p className="mt-2 text-[10px] text-[var(--muted)]">
                  Download activity
                </p>
              </div>
            </div>
          </div>

          {/* FOOTER */}

          <div className="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-3">
            <span className="font-mono text-[7px] font-bold uppercase tracking-[0.16em] text-[var(--muted-light)]">
              StudySnap
            </span>

            <span className="font-mono text-[7px] font-bold uppercase tracking-[0.16em] text-[var(--muted-light)]">
              {isAdmin
                ? "Admin workspace"
                : "Academic workspace"}
            </span>
          </div>
        </section>

        {/* =========================================================
            RIGHT — QUOTE
        ========================================================== */}

        <section
          className="
            relative
            flex
            min-h-[560px]
            flex-col
            justify-between
            overflow-hidden
            bg-[#d6ebe9]
            px-7 py-8
            sm:px-9 sm:py-9
            lg:min-h-[calc(100vh-5rem)]
            lg:px-11 lg:py-10
            xl:px-14
          "
        >

          {/* BACKGROUND INDEX */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -right-4
              top-8
              select-none
              text-[clamp(8rem,13vw,12rem)]
              font-black
              leading-none
              tracking-[-0.14em]
              text-black/[0.045]
            "
          >
            06
          </div>

          {/* TOP */}

          <div className="relative z-10 flex items-center justify-between text-black">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em]">
              {isAdmin ? "Administration" : "StudySnap"}
            </span>

            <span className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-black/40">
              {roleLabel(user?.role)}
            </span>
          </div>

          {/* QUOTE */}

          <div className="relative z-10 flex flex-1 items-center py-14 lg:py-8">
            <div className="max-w-xl">

              <span className="block font-serif text-[4rem] leading-none text-black/20">
                “
              </span>

              <blockquote
                className="
                  -mt-3
                  text-[clamp(2.2rem,4vw,4.1rem)]
                  font-black
                  leading-[0.93]
                  tracking-[-0.06em]
                  text-black
                "
              >
                {isAdmin
                  ? "Good administration keeps the right things moving."
                  : "A good learning space makes useful knowledge easier to return to."}
              </blockquote>

              <div className="mt-8 flex items-start gap-4">
                <div className="mt-1.5 h-px w-8 bg-black/40" />

                <div>
                  <p className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-black/50">
                    {isAdmin
                      ? "Administrative principle"
                      : "StudySnap principle"}
                  </p>

                  <p className="mt-2 max-w-sm text-xs leading-5 text-black/50">
                    {isAdmin
                      ? "Review clearly. Manage deliberately. Keep the academic workspace moving."
                      : "Share knowledge, keep it organized and make academic material easier to discover."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM */}

          <div className="relative z-10 border-t border-black/20 pt-4">
            <div className="flex items-end justify-between gap-6">
              <div>
                <span className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-black/40">
                  Current account
                </span>

                <p className="mt-2 text-xl font-black tracking-[-0.04em] text-black">
                  {user?.name}
                </p>

                <p className="mt-1 text-[11px] text-black/45">
                  {roleLabel(user?.role)} · {user?.userId}
                </p>
              </div>

              <span className="text-3xl font-black leading-none tracking-[-0.08em] text-black">
                ↗
              </span>
            </div>

            <div className="mt-6 flex items-center justify-between font-mono text-[7px] font-bold uppercase tracking-[0.16em] text-black/35">
              <span>
                {isAdmin
                  ? "Administrative dashboard"
                  : "Personal dashboard"}
              </span>

              <span>06 / 06</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;