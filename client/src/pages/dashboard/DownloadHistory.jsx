import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/ui/Container";
import Alert from "../../components/ui/Alert";
import Spinner from "../../components/ui/Spinner";
import { fetchDownloadHistory } from "../../api/downloadHistory";
import { getErrorMessage } from "../../lib/api";
import { formatDateTime } from "../../lib/format";

function DownloadHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDownloadHistory()
      .then((data) => setHistory(data.data || []))
      .catch((err) => setError(getErrorMessage(err, "Could not load download history.")))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-2 border-b border-[var(--border)] pb-6">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
          Dashboard
        </span>
        <h1 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
          Download history
        </h1>
        <p className="text-sm text-[var(--muted)]">
          Notes you've downloaded, most recent first.
        </p>
      </div>

      <div className="mt-8">
        {loading ? (
          <Spinner label="Loading history…" />
        ) : error ? (
          <Alert variant="error">{error}</Alert>
        ) : history.length === 0 ? (
          <p className="py-12 text-center text-sm text-[var(--muted)]">
            You haven't downloaded any notes yet.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-[var(--border)] rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]">
            {history.map((item, index) => (
              <Link
                key={`${item.noteId}-${index}`}
                to={`/notes/${item.noteId}`}
                className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 hover:bg-[var(--surface-muted)]"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  {item.description && (
                    <p className="line-clamp-1 text-sm text-[var(--muted)]">
                      {item.description}
                    </p>
                  )}
                </div>
                <span className="text-xs text-[var(--muted-light)]">
                  {formatDateTime(item.downloadDate)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}

export default DownloadHistory;
