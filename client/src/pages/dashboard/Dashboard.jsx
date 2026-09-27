import { Link } from "react-router-dom";
import Container from "../../components/ui/Container";
import { useAuth } from "../../context/AuthContext";
import { roleLabel } from "../../lib/format";
import { ROLES } from "../../lib/constants";

const UPLOADER_LINKS = [
  { to: "/profile", title: "Profile", desc: "View and update your account details." },
  { to: "/upload", title: "Upload a note", desc: "Share a note for review and approval." },
  { to: "/uploads", title: "Upload history", desc: "Track the notes you've submitted." },
  { to: "/tagged", title: "Tagged notes", desc: "Notes you've color-tagged for later." },
  { to: "/download-history", title: "Download history", desc: "Everything you've downloaded." },
];

const ADMIN_LINKS = [
  { to: "/profile", title: "Profile", desc: "View and update your account details." },
  { to: "/admin", title: "Review notes", desc: "Approve, reject and manage subjects." },
  { to: "/departments", title: "Departments", desc: "Add, rename or remove departments." },
  { to: "/download-history", title: "Download history", desc: "Everything you've downloaded." },
];

function Dashboard() {
  const { user } = useAuth();
  const LINKS = user?.role === ROLES.ADMIN ? ADMIN_LINKS : UPLOADER_LINKS;

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-2 border-b border-[var(--border)] pb-6">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
          {roleLabel(user?.role)}
        </span>
        <h1 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
          Welcome, {user?.name}
        </h1>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="group flex flex-col gap-1 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--foreground)]"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-bold">{link.title}</h2>
              <span className="text-sm transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </div>
            <p className="text-sm text-[var(--muted)]">{link.desc}</p>
          </Link>
        ))}
      </div>
    </Container>
  );
}

export default Dashboard;
