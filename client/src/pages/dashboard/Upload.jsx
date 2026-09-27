import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Container from "../../components/ui/Container";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import TextArea from "../../components/ui/TextArea";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";

import { useAuth } from "../../context/AuthContext";
import { fetchDepartments } from "../../api/departments";
import { fetchSubjects } from "../../api/subjects";
import { uploadNote } from "../../api/notes";
import { getErrorMessage } from "../../lib/api";
import { SEMESTERS } from "../../lib/constants";

import {
  validateNoteTitle,
  validateNoteDescription,
  validateDeptId,
  validateSemester,
  validatePdfFile,
} from "../../lib/validators";

const INITIAL_FORM = {
  title: "",
  description: "",
  semester: "",
  deptId: "",
  subjectId: "",
};

/* =========================================================
   DISPLAY FORMATTER
   Keeps database values unchanged
========================================================= */

const formatTitleCase = (value) => {
  if (!value) return "";

  return value
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bAi&Ml\b/i, "AI&ML");
};

function Upload() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loadError, setLoadError] = useState("");

  const [form, setForm] = useState(INITIAL_FORM);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    Promise.all([fetchDepartments(), fetchSubjects()])
      .then(([deptData, subjectData]) => {
        setDepartments(deptData.departments || []);
        setSubjects(Array.isArray(subjectData) ? subjectData : []);
      })
      .catch((error) =>
        setLoadError(
          getErrorMessage(
            error,
            "Could not load departments and subjects."
          )
        )
      );
  }, []);

  const subjectsForDept = form.deptId
    ? subjects.filter((s) =>
        s.deptId.includes(Number(form.deptId))
      )
    : [];

  function setField(field) {
    return (event) => {
      const value = event.target.value;

      setForm((prev) => {
        const next = { ...prev, [field]: value };

        if (field === "deptId") {
          next.subjectId = "";
        }

        return next;
      });

      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));

      setSubmitError("");
    };
  }

  function handleFileChange(event) {
    const selected = event.target.files?.[0] || null;

    setFile(selected);

    setErrors((prev) => ({
      ...prev,
      file: undefined,
    }));
  }

  function validate() {
    const nextErrors = {};

    const titleError = validateNoteTitle(form.title);
    if (titleError) nextErrors.title = titleError;

    const descError = validateNoteDescription(form.description);
    if (descError) nextErrors.description = descError;

    const semError = validateSemester(form.semester, {
      required: true,
    });
    if (semError) nextErrors.semester = semError;

    const deptError = validateDeptId(form.deptId, {
      required: true,
    });
    if (deptError) nextErrors.deptId = deptError;

    if (!form.subjectId) {
      nextErrors.subjectId = "Select a subject";
    }

    const fileError = validatePdfFile(file);
    if (fileError) nextErrors.file = fileError;

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");

    if (!validate()) return;

    setSubmitting(true);

    try {
      const response = await uploadNote({
        file,
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        semester: form.semester,
        deptId: form.deptId,
        subjectId: form.subjectId,
        uploadedBy: user.email,
      });

      setSuccess(response.data);
      setForm(INITIAL_FORM);
      setFile(null);
    } catch (error) {
      setSubmitError(
        getErrorMessage(error, "Could not upload note.")
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container className="py-10">
      <div className="mx-auto max-w-6xl">
        {/* PAGE HEADER */}
        <div className="mb-8 border-b border-[var(--border)] pb-6">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--muted)]">
            StudySnap / Notes
          </span>

          <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-[-0.05em] md:text-5xl">
                Upload a note
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">
                Turn your study material into something useful for
                the academic community.
              </p>
            </div>

            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
              03 / Notes
            </div>
          </div>
        </div>

        {success && (
          <Alert variant="success">
            "{success.title}" was uploaded and is now pending
            review.{" "}
            <button
              className="underline"
              onClick={() => navigate("/uploads")}
              type="button"
            >
              View upload history
            </button>
          </Alert>
        )}

        {loadError && (
          <div className="mb-6">
            <Alert variant="warning">{loadError}</Alert>
          </div>
        )}

        {/* MAIN CONTENT */}
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          {/* LEFT — FORM */}
          <div>
            <form
              className="
                flex
                flex-col
                gap-5
                border
                border-[var(--border)]
                bg-[var(--surface)]
                p-6
                shadow-[0_12px_35px_rgba(0,0,0,0.04)]
                md:p-8
              "
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="mb-1">
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                  Note details
                </span>

                <h2 className="mt-1 text-xl font-black tracking-[-0.035em]">
                  Add your study material
                </h2>
              </div>

              {submitError && (
                <Alert variant="error">{submitError}</Alert>
              )}

              <Input
                label="Title"
                placeholder="Unit 3 — Data Structures Notes"
                value={form.title}
                onChange={setField("title")}
                error={errors.title}
              />

              <TextArea
                label="Description (optional)"
                rows={4}
                placeholder="What does this note cover?"
                value={form.description}
                onChange={setField("description")}
                error={errors.description}
              />

              <div className="grid gap-5 md:grid-cols-2">
                <Select
                  label="Department"
                  value={form.deptId}
                  onChange={setField("deptId")}
                  error={errors.deptId}
                >
                  <option value="">Select a department</option>

                  {departments.map((dept) => (
                    <option
                      key={dept.deptId}
                      value={dept.deptId}
                    >
                      {formatTitleCase(dept.deptName)}
                    </option>
                  ))}
                </Select>

                <Select
                  label="Subject"
                  value={form.subjectId}
                  onChange={setField("subjectId")}
                  error={errors.subjectId}
                  disabled={!form.deptId}
                >
                  <option value="">
                    {form.deptId
                      ? "Select a subject"
                      : "Select a department first"}
                  </option>

                  {subjectsForDept.map((subject) => (
                    <option
                      key={subject.subjectId}
                      value={subject.subjectId}
                    >
                      {formatTitleCase(subject.subjectName)}
                    </option>
                  ))}
                </Select>
              </div>

              <Select
                label="Semester"
                value={form.semester}
                onChange={setField("semester")}
                error={errors.semester}
              >
                <option value="">Select a semester</option>

                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </Select>

              {/* FILE UPLOAD */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  PDF file
                </label>

                <label
                  className="
                    flex
                    min-h-[130px]
                    cursor-pointer
                    flex-col
                    items-center
                    justify-center
                    border
                    border-dashed
                    border-[var(--border)]
                    bg-[var(--background)]
                    px-5
                    py-6
                    text-center
                    transition-all
                    duration-200
                    hover:border-[#9edccc]
                    hover:bg-[#f1faf7]
                  "
                >
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                    PDF / DOCUMENT
                  </span>

                  <span className="mt-2 text-sm font-semibold">
                    {file
                      ? file.name
                      : "Choose your study notes"}
                  </span>

                  <span className="mt-1 text-xs text-[var(--muted)]">
                    Click to browse · PDF only · Max 10 MB
                  </span>

                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {file && (
                  <p className="text-xs text-[var(--muted)]">
                    {file.name} ·{" "}
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                )}

                {errors.file && (
                  <p className="text-xs text-[var(--danger)]">
                    {errors.file}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="accent"
                loading={submitting}
                className="mt-2"
              >
                Submit for review
              </Button>
            </form>
          </div>

          {/* RIGHT — STATIC EDITORIAL NOTE CARDS */}
          <div className="relative min-h-[560px] overflow-hidden bg-[#b9eadc] p-6 md:p-8">
            {/* BIG EDITORIAL NUMBER */}
            <div className="absolute -right-4 -top-8 select-none text-[150px] font-black leading-none tracking-[-0.1em] text-white/70">
              03
            </div>

            {/* TOP LABEL */}
            <div className="relative z-10">
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#1b2925]">
                Knowledge / Archive
              </span>

              <h2 className="mt-3 max-w-sm text-4xl font-black leading-[0.92] tracking-[-0.06em] text-[#111111]">
                Keep the
                <br />
                good notes
                <br />
                close.
              </h2>
            </div>

            {/* STATIC CARD 1 */}
            <div
              className="
                relative
                z-10
                mt-10
                ml-auto
                max-w-[310px]
                rotate-[2deg]
                bg-white
                p-5
                shadow-[0_18px_35px_rgba(0,0,0,0.10)]
              "
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[#777777]">
                  Lecture Notes
                </span>

                <span className="text-lg">↗</span>
              </div>

              <p className="mt-8 text-2xl font-black leading-[0.95] tracking-[-0.045em]">
                Read.
                <br />
                Revise.
                <br />
                Remember.
              </p>

              <div className="mt-8 border-t border-[#e8e8e8] pt-3 font-mono text-[8px] uppercase tracking-[0.15em] text-[#777777]">
                Study material / 01
              </div>
            </div>

            {/* STATIC CARD 2 */}
            <div
              className="
                relative
                z-20
                -mt-5
                mr-auto
                max-w-[280px]
                -rotate-[3deg]
                bg-[#111111]
                p-5
                text-white
                shadow-[0_18px_35px_rgba(0,0,0,0.14)]
              "
            >
              <span className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-white/60">
                A simple idea
              </span>

              <p className="mt-4 text-lg font-semibold leading-6">
                One clear note can make a difficult topic
                easier to return to.
              </p>

              <div className="mt-6 text-2xl">✦</div>
            </div>

            {/* STATIC CARD 3 */}
            <div
              className="
                relative
                z-10
                ml-auto
                mt-6
                max-w-[300px]
                rotate-[1deg]
                bg-white
                p-5
                shadow-[0_16px_30px_rgba(0,0,0,0.08)]
              "
            >
              <span className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[#777777]">
                Study archive
              </span>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2">
                  <span className="text-sm font-semibold">
                    Concepts
                  </span>

                  <span className="font-mono text-[9px] text-[#777777]">
                    01
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2">
                  <span className="text-sm font-semibold">
                    Examples
                  </span>

                  <span className="font-mono text-[9px] text-[#777777]">
                    02
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">
                    Revision
                  </span>

                  <span className="font-mono text-[9px] text-[#777777]">
                    03
                  </span>
                </div>
              </div>
            </div>

            {/* BOTTOM MESSAGE */}
            <div className="relative z-10 mt-8">
              <p className="max-w-xs text-sm font-medium leading-6 text-[#1b2925]">
                Good notes are more than files. They are a
                way to make learning easier for the next person.
              </p>

              <div className="mt-5 inline-flex border border-[#111111] bg-[#111111] px-4 py-2.5 font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-white">
                Share knowledge
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Upload;