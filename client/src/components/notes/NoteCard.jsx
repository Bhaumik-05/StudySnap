import { useNavigate } from "react-router-dom";
import Badge from "../ui/Badge";
import { formatDate } from "../../lib/format";

function toTitleCase(text) {
  return text
    ?.toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function NoteCard({ note, deptName, subjectName }) {
  const navigate = useNavigate();

  function openNote(event) {
    event?.stopPropagation();

    // IMPORTANT:
    // This ONLY opens the note details page.
    // It does NOT download the PDF.
    // It does NOT call downloadNote().
    navigate(`/notes/${note.noteId}`);
  }

  return (
    <article
      onClick={openNote}
      className="
        group
        relative
        flex
        min-h-[270px]
        cursor-pointer
        flex-col
        overflow-hidden
        rounded-[28px]
        border
        border-[var(--border)]
        bg-[var(--surface)]
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#111111]
        hover:shadow-[0_14px_30px_rgba(0,0,0,0.07)]
      "
    >
      {/* TOP */}
      <div className="flex items-start justify-between gap-4">
        <span
          className="
            font-mono
            text-[9px]
            font-bold
            uppercase
            tracking-[0.18em]
            text-[var(--muted)]
          "
        >
          Study material
        </span>

        <Badge tone="approved">
          Sem {note.semester}
        </Badge>
      </div>

      {/* LARGE NUMBER */}
      <span
        className="
          pointer-events-none
          absolute
          -right-1
          top-7
          select-none
          font-black
          text-[82px]
          leading-none
          tracking-[-0.08em]
          text-[var(--surface-muted)]
          transition-transform
          duration-300
          group-hover:-translate-x-1
        "
      >
        {String(note.noteId).padStart(2, "0")}
      </span>

      {/* CONTENT */}
      <div className="relative z-10 mt-12">
        <h3
          className="
            max-w-[85%]
            text-2xl
            font-black
            leading-[0.98]
            tracking-[-0.045em]
            transition-transform
            duration-300
            group-hover:translate-x-1
          "
        >
          {note.title}
        </h3>

        {note.description && (
          <p
            className="
              mt-4
              line-clamp-2
              max-w-[90%]
              text-sm
              leading-6
              text-[var(--muted)]
            "
          >
            {note.description}
          </p>
        )}
      </div>

      {/* FOOTER */}
      <div className="relative z-10 mt-auto pt-7">
        <div
          className="
            mb-4
            h-px
            bg-[var(--border)]
            transition-colors
            duration-300
            group-hover:bg-[#111111]
          "
        />

        <div className="flex flex-wrap items-end justify-between gap-4">
          {/* META */}
          <div className="flex min-w-0 flex-col gap-1">
            {(deptName || subjectName) && (
              <div className="flex flex-wrap items-center gap-x-2 text-xs font-medium">
                {deptName && (
                  <span>
                    {toTitleCase(deptName)}
                  </span>
                )}

                {deptName && subjectName && (
                  <span className="text-[var(--muted-light)]">
                    /
                  </span>
                )}

                {subjectName && (
                  <span className="text-[var(--muted)]">
                    {toTitleCase(subjectName)}
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span
                className="
                  font-mono
                  text-[9px]
                  uppercase
                  tracking-[0.12em]
                  text-[var(--muted-light)]
                "
              >
                {formatDate(
                  note.approvedDate ||
                  note.uploadDate,
                )}
              </span>

              <span className="text-[var(--muted-light)]">
                ·
              </span>

              <span
                className="
                  font-mono
                  text-[9px]
                  uppercase
                  tracking-[0.12em]
                  text-[var(--muted-light)]
                "
              >
                {note.downloadCount ?? 0} downloads
              </span>
            </div>
          </div>

          {/* VIEW BUTTON */}
          <button
            type="button"
            onClick={openNote}
            className="
              inline-flex
              shrink-0
              items-center
              gap-1
              rounded-full
              border
              border-[#b9eadc]
              bg-[#b9eadc]
              px-2.5
              py-1
              font-mono
              text-[7px]
              font-bold
              uppercase
              tracking-[0.08em]
              leading-none
              text-[#111111]
              transition-all
              duration-200
              hover:bg-[#a7e1d1]
            "
          >
            View
            <span className="text-[9px]">
              ↗
            </span>
          </button>
        </div>
      </div>

      {/* BOTTOM ACCENT */}
      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          h-[3px]
          w-0
          rounded-full
          bg-[#b9eadc]
          transition-all
          duration-300
          group-hover:w-full
        "
      />
    </article>
  );
}

export default NoteCard;