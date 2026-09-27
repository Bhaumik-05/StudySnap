import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Container from "../../components/ui/Container";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import Spinner from "../../components/ui/Spinner";
import { getNoteById, downloadNote, tagNote } from "../../api/notes";
import { fetchDepartments } from "../../api/departments";
import { fetchSubjects } from "../../api/subjects";
import { getErrorMessage } from "../../lib/api";
import { formatDate } from "../../lib/format";
import { useAuth } from "../../context/AuthContext";
import { NOTE_TAGS, NOTE_TAG_LABELS, ROLES } from "../../lib/constants";

function NoteDetails() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [note, setNote] = useState(null);
  const [deptName, setDeptName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const [taggingColor, setTaggingColor] = useState(null);
  const [activeTag, setActiveTag] = useState(null);
  const [tagError, setTagError] = useState("");

  const canTag =
    isAuthenticated && (user?.role === ROLES.STUDENT || user?.role === ROLES.FACULTY);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    getNoteById(noteId)
      .then(async (data) => {
        if (cancelled) return;
        setNote(data.data);
        const [deptsRes, subjectsRes] = await Promise.allSettled([
          fetchDepartments(),
          fetchSubjects(),
        ]);
        if (cancelled) return;
        if (deptsRes.status === "fulfilled") {
          const dept = (deptsRes.value.departments || []).find(
            (d) => d.deptId === data.data.deptId,
          );
          if (dept) setDeptName(dept.deptName);
        }
        if (subjectsRes.status === "fulfilled") {
          const subject = (subjectsRes.value || []).find(
            (s) => s.subjectId === data.data.subjectId,
          );
          if (subject) setSubjectName(subject.subjectName);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getErrorMessage(err, "This note could not be found."));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [noteId]);

  async function handleDownload() {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/notes/${noteId}` } } });
      return;
    }
    setDownloadError("");
    setDownloading(true);
    try {
      const result = await downloadNote(noteId);
      const { pdfUrl, fileName, downloadCount } = result.data;
      setNote((prev) => (prev ? { ...prev, downloadCount } : prev));

      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = fileName || "note.pdf";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setDownloadError(getErrorMessage(err, "Download failed."));
    } finally {
      setDownloading(false);
    }
  }

  async function handleTag(color) {
    if (!canTag) return;
    setTagError("");
    setTaggingColor(color);
    try {
      const result = await tagNote(noteId, color);
      setActiveTag(result.data.tag);
    } catch (err) {
      setTagError(getErrorMessage(err, "Could not save tag."));
    } finally {
      setTaggingColor(null);
    }
  }

  if (loading) return <Spinner label="Loading note…" />;

  if (error) {
    return (
      <Container className="py-16 text-center">
        <Alert variant="error" className="mx-auto max-w-md">
          {error}
        </Alert>
        <Button as={Link} to="/notes" variant="outline" className="mt-6">
          Back to notes
        </Button>
      </Container>
    );
  }

  if (!note) return null;

  return (
    <Container className="py-10">
      <Link
        to="/notes"
        className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
      >
        <span className="transition-transform duration-200 group-hover:-translate-x-1">
          ←
        </span>
        <span>Back to notes</span>
      </Link>

      <div className="mt-4 flex flex-col gap-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-[-0.03em]">{note.title}</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {deptName || `Department #${note.deptId}`} · {subjectName || `Subject #${note.subjectId}`} · Semester {note.semester}
            </p>
          </div>
          <Badge tone="approved">Approved</Badge>
        </div>

        {note.description && (
          <p className="text-sm leading-relaxed text-[var(--foreground)]">
            {note.description}
          </p>
        )}

        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-[var(--muted-light)]">
          <span>Uploaded {formatDate(note.uploadDate)}</span>
          <span>Approved {formatDate(note.approvedDate)}</span>
          <span>{note.downloadCount ?? 0} downloads</span>
        </div>

        <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-6">
          {downloadError && <Alert variant="error">{downloadError}</Alert>}
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="accent" onClick={handleDownload} loading={downloading}>
              Download PDF
            </Button>
            {!isAuthenticated && (
              <span className="text-xs text-[var(--muted)]">
                You'll need to log in to download.
              </span>
            )}
          </div>
        </div>

        {canTag && (
          <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-6">
            <p className="text-sm font-medium">Tag this note</p>
            {tagError && <Alert variant="error">{tagError}</Alert>}
            <div className="flex gap-2">
              {NOTE_TAGS.map((color) => (
                <Button
                  key={color}
                  variant={activeTag === color ? "primary" : "outline"}
                  onClick={() => handleTag(color)}
                  loading={taggingColor === color}
                >
                  {NOTE_TAG_LABELS[color]}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}

export default NoteDetails;
