import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/ui/Container";
import Spinner from "../../components/ui/Spinner";
import Alert from "../../components/ui/Alert";
import { getDownloadHistory } from "../../api/history";
import { getErrorMessage } from "../../lib/api";

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function DownloadHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDownloadHistory()
      .then((data) => {
        setHistory(data.history || data.data || []);
      })
      .catch((err) => {
        setError(
          getErrorMessage(err, "Could not load download history.")
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container className="py-10">

      {/* Header */}
      <div className="border-b border-[var(--border)] pb-8">

        <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
          04 / Download history
        </span>

        <div className="mt-4">
          <h1 className="text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            Your reading trail
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
            Notes you've downloaded from the StudySnap academic
            library.
          </p>
        </div>

      </div>


      {/* Content */}
      <div className="mt-8">

        {loading ? (
          <Spinner label="Loading download history…" />
        ) : error ? (
          <Alert variant="error">{error}</Alert>
        ) : history.length === 0 ? (
          <div className="border-y border-[var(--border)] py-16 text-center">

            <p className="text-sm text-[var(--muted)]">
              Your download history is empty.
            </p>

            <Link
              to="/notes"
              className="mt-4 inline-block text-[10px] font-bold uppercase tracking-[0.16em] underline underline-offset-4"
            >
              Browse notes →
            </Link>

          </div>
        ) : (
          <div className="space-y-4">

            {history.map((item, index) => (
              <Link
                key={`${item.noteId}-${item.downloadDate}-${index}`}
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

                <div className="flex items-center gap-5">

                  {/* PDF marker */}
                  <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-[#b9eadc] sm:flex">
                    <span className="font-mono text-[9px] font-black uppercase tracking-[0.12em]">
                      PDF
                    </span>
                  </div>

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
                      Downloaded {formatDate(item.downloadDate)}
                    </p>

                  </div>

                  <span className="hidden text-lg transition-transform duration-300 group-hover:translate-x-1 sm:block">
                    →
                  </span>

                </div>

              </Link>
            ))}

          </div>
        )}

      </div>
    </Container>
  );
}

export default DownloadHistory;