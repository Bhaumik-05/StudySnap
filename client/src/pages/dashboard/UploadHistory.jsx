import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/ui/Container";
import Spinner from "../../components/ui/Spinner";
import Alert from "../../components/ui/Alert";
import { getUploadHistory } from "../../api/history";
import { getErrorMessage } from "../../lib/api";

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusClass(status) {
  if (status === "approved") {
    return "bg-[#b9eadc] text-black";
  }

  if (status === "rejected") {
    return "bg-[#eeeeeb] text-[#666]";
  }

  return "bg-[#f2dfad] text-black";
}

function UploadHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getUploadHistory()
      .then((data) => {
        setHistory(data.history || data.data || []);
      })
      .catch((err) => {
        setError(
          getErrorMessage(err, "Could not load upload history.")
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container className="py-10">

      {/* Header */}
      <div className="border-b border-[var(--border)] pb-8">

        <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
          03 / Upload history
        </span>

        <div className="mt-4 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>
            <h1 className="text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Your uploads
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
              A record of the notes you have contributed to the
              StudySnap academic library.
            </p>
          </div>

          <Link
            to="/upload"
            className="
              inline-flex
              items-center
              gap-3
              self-start
              rounded-full
              bg-[#b9eadc]
              px-5
              py-3
              text-[10px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-black
              transition-transform
              duration-200
              hover:-translate-y-0.5
            "
          >
            Upload new
            <span>→</span>
          </Link>

        </div>
      </div>


      {/* Content */}
      <div className="mt-8">

        {loading ? (
          <Spinner label="Loading upload history…" />
        ) : error ? (
          <Alert variant="error">{error}</Alert>
        ) : history.length === 0 ? (
          <div className="border-y border-[var(--border)] py-16 text-center">
            <p className="text-sm text-[var(--muted)]">
              You haven't uploaded any notes yet.
            </p>

            <Link
              to="/upload"
              className="mt-4 inline-block text-[10px] font-bold uppercase tracking-[0.16em] underline underline-offset-4"
            >
              Upload your first note →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">

            {history.map((item, index) => (
              <Link
                key={item.noteId}
                to={`/notes/${item.noteId}`}
                className="
                  group
                  block
                  rounded-[28px]
                  border
                  border-[var(--border)]
                  bg-white
                  p-5
                  shadow-[0_10px_30px_rgba(0,0,0,0.035)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_18px_40px_rgba(0,0,0,0.07)]
                "
              >

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                  {/* Number */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#f1f1ed] font-mono text-xs font-bold">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* Main */}
                  <div className="min-w-0 flex-1">

                    <div className="mb-2 flex flex-wrap items-center gap-2">

                      <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                        {item.deptName || "Department"}
                      </span>

                      <span className="text-[var(--muted-light)]">
                        /
                      </span>

                      <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                        Sem {item.semester}
                      </span>

                    </div>

                    <h2 className="truncate text-lg font-bold tracking-[-0.02em]">
                      {item.title}
                    </h2>

                    <p className="mt-1 text-xs text-[var(--muted)]">
                      Uploaded {formatDate(item.uploadDate)}
                    </p>

                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-4">

                    <span
                      className={`
                        rounded-full
                        px-3
                        py-1.5
                        font-mono
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-[0.15em]
                        ${statusClass(item.status)}
                      `}
                    >
                      {item.status || "pending"}
                    </span>

                    <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>

                  </div>

                </div>
              </Link>
            ))}

          </div>
        )}

      </div>
    </Container>
  );
}

export default UploadHistory;