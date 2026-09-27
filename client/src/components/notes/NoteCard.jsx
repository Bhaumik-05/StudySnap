import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import { formatDate } from "../../lib/format";

function NoteCard({ note, deptName, subjectName }) {
  return (
    <Link
      to={`/notes/${note.noteId}`}
      className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--foreground)]"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium leading-snug">{note.title}</h3>
        <Badge tone="approved">Sem {note.semester}</Badge>
      </div>

      {note.description && (
        <p className="line-clamp-2 text-sm text-[var(--muted)]">
          {note.description}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--muted-light)]">
        {deptName && <span>{deptName}</span>}
        {subjectName && <span>· {subjectName}</span>}
        <span>· {formatDate(note.approvedDate || note.uploadDate)}</span>
        <span>· {note.downloadCount ?? 0} downloads</span>
      </div>
    </Link>
  );
}

export default NoteCard;
