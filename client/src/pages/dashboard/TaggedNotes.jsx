import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/ui/Container";
import Alert from "../../components/ui/Alert";
import Spinner from "../../components/ui/Spinner";
import Badge from "../../components/ui/Badge";
import { getTaggedNotes } from "../../api/notes";
import { getErrorMessage } from "../../lib/api";
import { formatDate } from "../../lib/format";
import { NOTE_TAG_LABELS } from "../../lib/constants";

/*
=========================================================
TAG VISUAL LANGUAGE

The data itself is unchanged.

The tag determines only:
- visual accent
- editorial quote
- highlight label
=========================================================
*/

const tagContent = {
  red: {
    eyebrow: "FOCUS",
    quote: "Keep the difficult things close. They are usually the ones worth understanding.",
    highlight: "Worth revisiting",
    mark: "01",
  },

  blue: {
    eyebrow: "REFERENCE",
    quote: "Good notes do not replace thinking. They give thinking somewhere to begin.",
    highlight: "Useful reference",
    mark: "02",
  },

  yellow: {
    eyebrow: "REVISION",
    quote: "The smallest highlighted idea can become the missing piece before an exam.",
    highlight: "Revision material",
    mark: "03",
  },
};

function TaggedNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTaggedNotes()
      .then((data) => setNotes(data.data || []))
      .catch((err) =>
        setError(
          getErrorMessage(
            err,
            "Could not load tagged notes.",
          ),
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[var(--background)]">
      <div
        className="
          grid
          min-h-[calc(100vh-5rem)]
          lg:grid-cols-[1.08fr_0.92fr]
        "
      >
        {/* =====================================================
            LEFT — TAGGED NOTE COLLECTION
        ====================================================== */}

        <section
          className="
            flex
            min-h-[680px]
            flex-col
            border-b
            border-[var(--border)]
            bg-[var(--surface)]
            lg:border-b-0
            lg:border-r
            lg:border-[var(--border)]
          "
        >
          {/* -------------------------------------------------
              HEADER
          ------------------------------------------------- */}

          <div
            className="
              border-b
              border-[var(--border)]
              px-6
              py-7
              sm:px-8
              sm:py-9
              lg:px-10
              xl:px-14
            "
          >
            <div className="flex items-center justify-between">
              <span
                className="
                  font-mono
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.22em]
                  text-[var(--muted)]
                "
              >
                StudySnap
              </span>

              <span
                className="
                  font-mono
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-[var(--muted-light)]
                "
              >
                Saved / Notes
              </span>
            </div>

            <div
              className="
                mt-12
                select-none
                text-[clamp(5rem,10vw,8rem)]
                font-black
                leading-[0.72]
                tracking-[-0.14em]
                text-[var(--foreground)]
              "
            >
              03
            </div>

            <div className="mt-10 max-w-xl">
              <span
                className="
                  font-mono
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-[var(--muted-light)]
                "
              >
                Personal collection
              </span>

              <h1
                className="
                  mt-3
                  text-[clamp(3.25rem,6vw,5.5rem)]
                  font-black
                  leading-[0.82]
                  tracking-[-0.09em]
                "
              >
                Tagged.
              </h1>

              <p
                className="
                  mt-7
                  max-w-md
                  text-sm
                  font-medium
                  leading-7
                  text-[var(--muted)]
                  sm:text-[15px]
                "
              >
                Your personal collection of notes marked for
                focus, reference and revision.
              </p>
            </div>
          </div>

          {/* -------------------------------------------------
              NOTE COLLECTION
          ------------------------------------------------- */}

          <div className="flex-1">
            {loading ? (
              <div className="px-6 py-16 sm:px-8 lg:px-10">
                <Spinner label="Loading tagged notes…" />
              </div>
            ) : error ? (
              <div className="px-6 py-8 sm:px-8 lg:px-10">
                <Alert variant="error">{error}</Alert>
              </div>
            ) : notes.length === 0 ? (
              <div
                className="
                  flex
                  min-h-[320px]
                  items-center
                  justify-center
                  px-8
                  text-center
                "
              >
                <div>
                  <span
                    className="
                      font-mono
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-[var(--muted-light)]
                    "
                  >
                    Collection empty
                  </span>

                  <p
                    className="
                      mt-4
                      max-w-sm
                      text-sm
                      font-medium
                      leading-7
                      text-[var(--muted)]
                    "
                  >
                    You haven't tagged any notes yet.
                    Open a note and mark it for later.
                  </p>
                </div>
              </div>
            ) : (
              <div
                className="
                  grid
                  gap-4
                  px-5
                  py-6
                  sm:px-7
                  sm:py-8
                  lg:px-9
                  xl:px-12
                "
              >
                {notes.map((note, index) => {
                  const content =
                    tagContent[note.tag] ||
                    tagContent.blue;

                  return (
                    <Link
                      key={note.noteId}
                      to={`/notes/${note.noteId}`}
                      className="
                        group
                        relative
                        overflow-hidden
                        rounded-[30px]
                        border
                        border-[var(--border)]
                        bg-[var(--background)]
                        p-6
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:border-[var(--foreground)]
                        hover:shadow-[0_18px_45px_rgba(0,0,0,0.07)]
                        sm:p-7
                      "
                    >
                      {/* top metadata */}

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span
                            className="
                              flex
                              h-8
                              w-8
                              items-center
                              justify-center
                              rounded-full
                              bg-[var(--foreground)]
                              font-mono
                              text-[9px]
                              font-bold
                              text-[var(--background)]
                            "
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <span
                            className="
                              font-mono
                              text-[9px]
                              font-bold
                              uppercase
                              tracking-[0.17em]
                              text-[var(--muted)]
                            "
                          >
                            {content.eyebrow}
                          </span>
                        </div>

                        <Badge tone={note.tag}>
                          {NOTE_TAG_LABELS[note.tag]}
                        </Badge>
                      </div>

                      {/* note content */}

                      <div className="mt-7">
                        <div className="flex items-start justify-between gap-5">
                          <h2
                            className="
                              max-w-xl
                              text-2xl
                              font-black
                              leading-[0.95]
                              tracking-[-0.055em]
                              transition-transform
                              duration-300
                              group-hover:translate-x-1
                              sm:text-3xl
                            "
                          >
                            {note.title}
                          </h2>

                          <span
                            className="
                              shrink-0
                              text-2xl
                              font-black
                              leading-none
                              tracking-[-0.08em]
                              text-[var(--muted-light)]
                              transition-transform
                              duration-300
                              group-hover:translate-x-1
                            "
                          >
                            ↗
                          </span>
                        </div>

                        {note.description && (
                          <p
                            className="
                              mt-5
                              line-clamp-2
                              max-w-2xl
                              text-sm
                              font-medium
                              leading-6
                              text-[var(--muted)]
                            "
                          >
                            {note.description}
                          </p>
                        )}
                      </div>

                      {/* note metadata */}

                      <div
                        className="
                          mt-7
                          flex
                          flex-wrap
                          items-center
                          gap-x-6
                          gap-y-2
                          border-t
                          border-[var(--border)]
                          pt-4
                          font-mono
                          text-[8px]
                          font-bold
                          uppercase
                          tracking-[0.15em]
                          text-[var(--muted-light)]
                        "
                      >
                        <span>
                          SEM {note.semester}
                        </span>

                        <span>
                          NOTE {note.noteId}
                        </span>

                        <span className="ml-auto">
                          {formatDate(note.taggedDate)}
                        </span>
                      </div>

                      {/* subtle tag marker */}

                      <span
                        className="
                          absolute
                          bottom-0
                          left-0
                          h-[3px]
                          w-0
                          bg-[var(--foreground)]
                          transition-all
                          duration-500
                          group-hover:w-full
                        "
                      />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* =====================================================
            RIGHT — EDITORIAL / QUOTE PANEL
        ====================================================== */}

        <section
          className="
            relative
            flex
            min-h-[680px]
            flex-col
            overflow-hidden
            bg-[#d6ebe9]
            p-7
            text-black
            sm:p-9
            lg:min-h-[calc(100vh-5rem)]
            lg:p-12
            xl:p-16
          "
        >
          {/* decorative oversized number */}

          <div
            className="
              pointer-events-none
              absolute
              -right-5
              top-20
              select-none
              text-[clamp(10rem,22vw,20rem)]
              font-black
              leading-none
              tracking-[-0.16em]
              text-black/[0.045]
            "
          >
            03
          </div>

          {/* header */}

          <div className="relative flex items-center justify-between">
            <span
              className="
                font-mono
                text-[9px]
                font-bold
                uppercase
                tracking-[0.22em]
              "
            >
              Marginalia
            </span>

            <span
              className="
                font-mono
                text-[9px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-black/40
              "
            >
              Personal archive
            </span>
          </div>

          {/* quote composition */}

          <div
            className="
              relative
              mt-16
              flex-1
              lg:mt-24
            "
          >
            <span
              className="
                font-mono
                text-[9px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-black/45
              "
            >
              A note worth keeping
            </span>

            <div
              className="
                mt-7
                max-w-2xl
                text-[clamp(2.5rem,5vw,5.5rem)]
                font-black
                leading-[0.9]
                tracking-[-0.075em]
              "
            >
              “Keep the
              <span
                className="
                  mx-2
                  inline-block
                  border-b-[5px]
                  border-black
                  pb-1
                "
              >
                ideas
              </span>
              that keep
              you thinking.”
            </div>

            <p
              className="
                mt-8
                max-w-md
                text-sm
                font-medium
                leading-7
                text-black/55
              "
            >
              A tagged note is more than a saved document.
              It is a small signal about what deserves your
              attention again.
            </p>

            {/* tag philosophy */}

            <div
              className="
                mt-14
                grid
                gap-0
                border-y
                border-black/20
                sm:grid-cols-3
              "
            >
              {/* RED */}

              <div
                className="
                  border-b
                  border-black/20
                  py-6
                  sm:border-b-0
                  sm:border-r
                  sm:pr-6
                "
              >
                <div className="flex items-center justify-between">
                  <span
                    className="
                      font-mono
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.15em]
                      text-black/45
                    "
                  >
                    Red
                  </span>

                  <span className="h-2 w-2 rounded-full bg-[#111111]" />
                </div>

                <p
                  className="
                    mt-4
                    text-sm
                    font-bold
                    leading-5
                    tracking-[-0.02em]
                  "
                >
                  {tagContent.red.highlight}
                </p>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-5
                    text-black/45
                  "
                >
                  Keep difficult concepts visible.
                </p>
              </div>

              {/* BLUE */}

              <div
                className="
                  border-b
                  border-black/20
                  py-6
                  sm:border-b-0
                  sm:border-r
                  sm:px-6
                "
              >
                <div className="flex items-center justify-between">
                  <span
                    className="
                      font-mono
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.15em]
                      text-black/45
                    "
                  >
                    Blue
                  </span>

                  <span className="h-2 w-2 rounded-full bg-black/45" />
                </div>

                <p
                  className="
                    mt-4
                    text-sm
                    font-bold
                    leading-5
                    tracking-[-0.02em]
                  "
                >
                  {tagContent.blue.highlight}
                </p>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-5
                    text-black/45
                  "
                >
                  Keep useful references close.
                </p>
              </div>

              {/* YELLOW */}

              <div className="py-6 sm:pl-6">
                <div className="flex items-center justify-between">
                  <span
                    className="
                      font-mono
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.15em]
                      text-black/45
                    "
                  >
                    Yellow
                  </span>

                  <span className="h-2 w-2 rounded-full bg-black/20" />
                </div>

                <p
                  className="
                    mt-4
                    text-sm
                    font-bold
                    leading-5
                    tracking-[-0.02em]
                  "
                >
                  {tagContent.yellow.highlight}
                </p>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-5
                    text-black/45
                  "
                >
                  Keep revision material ready.
                </p>
              </div>
            </div>
          </div>

          {/* footer */}

          <div className="relative mt-14">
            <div className="border-t border-black/25 pt-5">
              <div className="flex items-end justify-between gap-8">
                <div>
                  <span
                    className="
                      font-mono
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.16em]
                      text-black/45
                    "
                  >
                    StudySnap / Tagged notes
                  </span>

                  <p
                    className="
                      mt-3
                      max-w-md
                      text-sm
                      font-medium
                      leading-6
                      text-black/55
                    "
                  >
                    Three colors. Three ways to return to
                    the things that matter.
                  </p>
                </div>

                <span
                  className="
                    text-4xl
                    font-black
                    leading-none
                    tracking-[-0.08em]
                  "
                >
                  ↗
                </span>
              </div>
            </div>

            <div
              className="
                mt-7
                flex
                items-center
                justify-between
                font-mono
                text-[9px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-black/35
              "
            >
              <span>Personal archive</span>
              <span>03 / 03</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default TaggedNotes;