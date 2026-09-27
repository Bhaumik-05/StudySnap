import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/ui/Container";
import Alert from "../../components/ui/Alert";
import Spinner from "../../components/ui/Spinner";
import Badge from "../../components/ui/Badge";
import { getUploadHistory } from "../../api/users";
import { getErrorMessage } from "../../lib/api";
import { formatDate } from "../../lib/format";

function UploadHistory() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getUploadHistory()
      .then((data) => setNotes(data.data || []))
      .catch((err) => setError(getErrorMessage(err, "Could not load upload history.")))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-2 border-b border-[var(--border)] pb-6">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
          Dashboard
        </span>
        <h1 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
          Upload history
        </h1>
        <p className="text-sm text-[var(--muted)]">
          Everything you've submitted, and its review status.
        </p>
      </div>

      <div className="mt-8">
        {loading ? (
          <Spinner label="Loading uploads…" />
        ) : error ? (
          <Alert variant="error">{error}</Alert>
        ) : notes.length === 0 ? (
          <p className="py-12 text-center text-sm text-[var(--muted)]">
            You haven't uploaded any notes yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {notes.map((note) => (
              <div
                key={note.noteId}
                className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    {note.status === "approved" ? (
                      <Link to={`/notes/${note.noteId}`} className="font-medium hover:underline">
                        {note.title}
                      </Link>
                    ) : (
                      <p className="font-medium">{note.title}</p>
                    )}
                    <p className="text-xs text-[var(--muted-light)]">
                      Uploaded {formatDate(note.uploadDate)}
                    </p>
                  </div>
                  <Badge tone={note.status}>{note.status}</Badge>
                </div>
                {note.status === "rejected" && note.rejectionReason && (
                  <Alert variant="warning" className="mt-3">
                    Rejection reason: {note.rejectionReason}
                  </Alert>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}

export default UploadHistory;
