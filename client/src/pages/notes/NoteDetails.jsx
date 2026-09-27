import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Container from "../../components/ui/Container";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import Spinner from "../../components/ui/Spinner";

import {
  getNoteById,
  downloadNote,
  tagNote,
} from "../../api/notes";

import { fetchDepartments } from "../../api/departments";
import { fetchSubjects } from "../../api/subjects";
import { getErrorMessage } from "../../lib/api";
import { formatDate } from "../../lib/format";
import { useAuth } from "../../context/AuthContext";

import {
  NOTE_TAGS,
  NOTE_TAG_LABELS,
  ROLES,
} from "../../lib/constants";

function toTitleCase(text) {
  return text
    ?.toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function NoteDetails() {
  const { noteId } = useParams();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useAuth();

  const [note, setNote] = useState(null);
  const [deptName, setDeptName] = useState("");
  const [subjectName, setSubjectName] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // PDF URL used ONLY for viewing the PDF.
  // It comes from getNoteById(), not downloadNote().
  const [pdfUrl, setPdfUrl] = useState("");

  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const [taggingColor, setTaggingColor] = useState(null);
  const [activeTag, setActiveTag] = useState(null);
  const [tagError, setTagError] = useState("");

  const canTag =
    isAuthenticated &&
    (user?.role === ROLES.STUDENT ||
      user?.role === ROLES.FACULTY);

  /*
   * Load note details.
   *
   * IMPORTANT:
   * We only call getNoteById() here.
   *
   * We DO NOT call downloadNote() while opening
   * or viewing the note.
   */
  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError("");

    getNoteById(noteId)
      .then(async (data) => {
        if (cancelled) return;

        const currentNote = data.data;

        setNote(currentNote);

        /*
         * Get department and subject names.
         */
        const [deptsRes, subjectsRes] =
          await Promise.allSettled([
            fetchDepartments(),
            fetchSubjects(),
          ]);

        if (cancelled) return;

        if (deptsRes.status === "fulfilled") {
          const dept = (
            deptsRes.value.departments || []
          ).find(
            (d) => d.deptId === currentNote.deptId,
          );

          if (dept) {
            setDeptName(dept.deptName);
          }
        }

        if (subjectsRes.status === "fulfilled") {
          const subject = (
            subjectsRes.value || []
          ).find(
            (s) => s.subjectId === currentNote.subjectId,
          );

          if (subject) {
            setSubjectName(subject.subjectName);
          }
        }

        /*
         * Get the PDF URL directly from the note.
         *
         * This is for VIEWING only.
         *
         * We intentionally do NOT call:
         *
         * downloadNote(noteId)
         *
         * here.
         */
        const existingPdfUrl =
          currentNote.pdfUrl ||
          currentNote.fileUrl ||
          currentNote.pdf?.url ||
          currentNote.file?.url;

        if (existingPdfUrl) {
          setPdfUrl(existingPdfUrl);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            getErrorMessage(
              err,
              "This note could not be found.",
            ),
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [noteId]);

  /*
   * DOWNLOAD PDF
   *
   * This is the ONLY place where downloadNote()
   * is called.
   *
   * Therefore:
   *
   * View PDF       -> no download count change
   * Download PDF   -> downloadNote() -> count + 1
   */
  async function handleDownload() {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: {
            pathname: `/notes/${noteId}`,
          },
        },
      });

      return;
    }

    setDownloadError("");
    setDownloading(true);

    try {
      /*
       * We always use the download endpoint when the
       * user explicitly clicks Download PDF.
       *
       * This allows the backend to:
       * - increment downloadCount
       * - create DownloadHistory
       * - return the PDF URL
       */
      const result = await downloadNote(noteId);

      const {
        pdfUrl: returnedPdfUrl,
        fileName,
        downloadCount,
      } = result.data;

      /*
       * Keep the returned URL available for the page.
       */
      if (returnedPdfUrl) {
        setPdfUrl(returnedPdfUrl);
      }

      /*
       * Update the visible download count.
       */
      setNote((prev) =>
        prev
          ? {
            ...prev,
            downloadCount,
          }
          : prev,
      );

      /*
       * Trigger the actual browser download.
       */
      if (returnedPdfUrl) {
        const link = document.createElement("a");

        link.href = returnedPdfUrl;
        link.download =
          fileName ||
          note.fileName ||
          `${note.title}.pdf`;

        link.target = "_blank";
        link.rel = "noopener noreferrer";

        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (err) {
      setDownloadError(
        getErrorMessage(
          err,
          "Download failed.",
        ),
      );
    } finally {
      setDownloading(false);
    }
  }

  /*
   * TAG NOTE
   */
  async function handleTag(color) {
    if (!canTag) return;

    setTagError("");
    setTaggingColor(color);

    try {
      const result = await tagNote(
        noteId,
        color,
      );

      setActiveTag(result.data.tag);
    } catch (err) {
      setTagError(
        getErrorMessage(
          err,
          "Could not save tag.",
        ),
      );
    } finally {
      setTaggingColor(null);
    }
  }

  /*
   * LOADING STATE
   */
  if (loading) {
    return <Spinner label="Loading note…" />;
  }

  /*
   * ERROR STATE
   */
  if (error) {
    return (
      <Container className="py-16 text-center">
        <Alert
          variant="error"
          className="mx-auto max-w-md"
        >
          {error}
        </Alert>

        <Button
          as={Link}
          to="/notes"
          variant="outline"
          className="mt-6"
        >
          Back to notes
        </Button>
      </Container>
    );
  }

  if (!note) return null;

  return (
    <Container className="py-8 md:py-10">
      {/* BACK */}
      <Link
        to="/notes"
        className="
          group
          inline-flex
          items-center
          gap-2
          font-mono
          text-[9px]
          font-bold
          uppercase
          tracking-[0.16em]
          text-[var(--muted)]
          transition-colors
          hover:text-[var(--foreground)]
        "
      >
        <span className="transition-transform duration-200 group-hover:-translate-x-1">
          ←
        </span>

        Back to notes
      </Link>

      {/* HEADER */}
      <div
        className="
          relative
          mt-5
          overflow-hidden
          rounded-[32px]
          bg-[#b9eadc]
          p-6
          md:p-9
        "
      >
        <span
          className="
            absolute
            -right-3
            -top-7
            select-none
            font-black
            text-[150px]
            leading-none
            tracking-[-0.1em]
            text-white/70
          "
        >
          {String(note.noteId).padStart(2, "0")}
        </span>

        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#1d2926]">
              Study material
            </span>

            <span className="text-[#1d2926]/40">
              /
            </span>

            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#1d2926]">
              Note {String(note.noteId).padStart(2, "0")}
            </span>
          </div>

          <h1
            className="
              mt-5
              max-w-3xl
              text-4xl
              font-black
              leading-[0.92]
              tracking-[-0.055em]
              md:text-6xl
            "
          >
            {note.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-[#1d2926]">
            <span>
              {toTitleCase(
                deptName ||
                `Department #${note.deptId}`,
              )}
            </span>

            <span className="opacity-40">
              /
            </span>

            <span>
              {toTitleCase(
                subjectName ||
                `Subject #${note.subjectId}`,
              )}
            </span>

            <span className="opacity-40">
              /
            </span>

            <span>
              Semester {note.semester}
            </span>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* PDF / CONTENT */}
        <div className="min-w-0">
          {/* PDF HEADER */}
          <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                Document
              </span>

              <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">
                Note preview
              </h2>
            </div>

            {pdfUrl && (
              <span className="font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                Read online
              </span>
            )}
          </div>

          {/* PDF ERROR */}
          {downloadError && (
            <div className="mb-4">
              <Alert variant="error">
                {downloadError}
              </Alert>
            </div>
          )}

          {/* ACTUAL PDF VIEWER */}
          {pdfUrl ? (
            <div
              className="
                overflow-hidden
                rounded-[28px]
                border
                border-[var(--border)]
                bg-[#e9e9e7]
                shadow-[0_16px_40px_rgba(0,0,0,0.06)]
              "
            >
              {/* PDF TOOLBAR */}
              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  justify-between
                  gap-3
                  border-b
                  border-[var(--border)]
                  bg-[var(--surface)]
                  px-5
                  py-3
                "
              >
                <div className="flex items-center gap-2">
                  <span
                    className="
                      flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-[9px]
                      bg-[#111111]
                      font-mono
                      text-[9px]
                      font-bold
                      text-white
                    "
                  >
                    PDF
                  </span>

                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                    Study document
                  </span>
                </div>

                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    font-mono
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    underline
                    underline-offset-4
                    transition-opacity
                    hover:opacity-60
                  "
                >
                  Open full screen ↗
                </a>
              </div>

              {/* PDF */}
              <iframe
                src={pdfUrl}
                title={note.title}
                className="
                  block
                  h-[720px]
                  w-full
                  bg-white
                  md:h-[850px]
                "
              />
            </div>
          ) : (
            /*
             * No PDF URL was returned by the backend.
             *
             * IMPORTANT:
             * We do NOT call downloadNote() here.
             *
             * Downloading and viewing are separate actions.
             */
            <div
              className="
                flex
                min-h-[430px]
                flex-col
                items-center
                justify-center
                rounded-[28px]
                border
                border-[var(--border)]
                bg-[var(--surface)]
                p-8
                text-center
              "
            >
              <div
                className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-[20px]
                  bg-[#b9eadc]
                  font-mono
                  text-xs
                  font-black
                  text-[#111111]
                "
              >
                PDF
              </div>

              <h3 className="mt-5 text-xl font-black tracking-[-0.035em]">
                PDF preview unavailable
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--muted)]">
                The note was loaded successfully, but
                no PDF preview URL was returned by the
                server.
              </p>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="flex flex-col gap-5">
          {/* DESCRIPTION */}
          <div
            className="
              rounded-[28px]
              border
              border-[var(--border)]
              bg-[var(--surface)]
              p-6
            "
          >
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
              About this note
            </span>

            {note.description ? (
              <p className="mt-4 text-sm leading-7">
                {note.description}
              </p>
            ) : (
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                No description was provided for this
                note.
              </p>
            )}
          </div>

          {/* DETAILS */}
          <div
            className="
              rounded-[28px]
              border
              border-[var(--border)]
              bg-[var(--surface)]
              p-6
            "
          >
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
              Archive details
            </span>

            <div className="mt-5 space-y-4">
              <div>
                <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[var(--muted-light)]">
                  Department
                </span>

                <p className="mt-1 text-sm font-semibold">
                  {toTitleCase(
                    deptName ||
                    `Department #${note.deptId}`,
                  )}
                </p>
              </div>

              <div>
                <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[var(--muted-light)]">
                  Subject
                </span>

                <p className="mt-1 text-sm font-semibold">
                  {toTitleCase(
                    subjectName ||
                    `Subject #${note.subjectId}`,
                  )}
                </p>
              </div>

              <div>
                <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[var(--muted-light)]">
                  Semester
                </span>

                <p className="mt-1 text-sm font-semibold">
                  Semester {note.semester}
                </p>
              </div>

              <div className="border-t border-[var(--border)] pt-4">
                <div className="flex justify-between gap-4 text-xs">
                  <span className="text-[var(--muted)]">
                    Uploaded
                  </span>

                  <span>
                    {formatDate(note.uploadDate)}
                  </span>
                </div>

                <div className="mt-2 flex justify-between gap-4 text-xs">
                  <span className="text-[var(--muted)]">
                    Approved
                  </span>

                  <span>
                    {formatDate(note.approvedDate)}
                  </span>
                </div>

                <div className="mt-2 flex justify-between gap-4 text-xs">
                  <span className="text-[var(--muted)]">
                    Downloads
                  </span>

                  <span>
                    {note.downloadCount ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* DOWNLOAD */}
          <div
            className="
              rounded-[28px]
              bg-[#111111]
              p-6
              text-white
            "
          >
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/50">
              Take it with you
            </span>

            <p className="mt-3 text-lg font-black leading-tight tracking-[-0.025em]">
              Save this note for your next revision.
            </p>

            {downloadError && (
              <div className="mt-4">
                <Alert variant="error">
                  {downloadError}
                </Alert>
              </div>
            )}

            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="
                mt-5
                inline-flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#b9eadc]
                px-5
                py-3
                font-mono
                text-[9px]
                font-bold
                uppercase
                tracking-[0.14em]
                text-[#111111]
                transition-all
                hover:-translate-y-0.5
                hover:bg-white
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {downloading
                ? "Preparing..."
                : "Download PDF ↗"}
            </button>
          </div>

          {/* TAGGING */}
          {canTag && (
            <div
              className="
                rounded-[28px]
                border
                border-[var(--border)]
                bg-[var(--surface)]
                p-6
              "
            >
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                Personal tag
              </span>

              <p className="mt-2 text-sm font-semibold">
                Mark this note for later.
              </p>

              {tagError && (
                <div className="mt-4">
                  <Alert variant="error">
                    {tagError}
                  </Alert>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {NOTE_TAGS.map((color) => (
                  <Button
                    key={color}
                    variant={
                      activeTag === color
                        ? "primary"
                        : "outline"
                    }
                    onClick={() =>
                      handleTag(color)
                    }
                    loading={
                      taggingColor === color
                    }
                  >
                    {NOTE_TAG_LABELS[color]}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </Container>
  );
}

export default NoteDetails;