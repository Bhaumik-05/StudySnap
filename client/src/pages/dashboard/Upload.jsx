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
        setLoadError(getErrorMessage(error, "Could not load departments and subjects.")),
      );
  }, []);

  const subjectsForDept = form.deptId
    ? subjects.filter((s) => s.deptId.includes(Number(form.deptId)))
    : [];

  function setField(field) {
    return (event) => {
      const value = event.target.value;
      setForm((prev) => {
        const next = { ...prev, [field]: value };
        if (field === "deptId") next.subjectId = "";
        return next;
      });
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      setSubmitError("");
    };
  }

  function handleFileChange(event) {
    const selected = event.target.files?.[0] || null;
    setFile(selected);
    setErrors((prev) => ({ ...prev, file: undefined }));
  }

  function validate() {
    const nextErrors = {};

    const titleError = validateNoteTitle(form.title);
    if (titleError) nextErrors.title = titleError;

    const descError = validateNoteDescription(form.description);
    if (descError) nextErrors.description = descError;

    const semError = validateSemester(form.semester, { required: true });
    if (semError) nextErrors.semester = semError;

    const deptError = validateDeptId(form.deptId, { required: true });
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
      setSubmitError(getErrorMessage(error, "Could not upload note."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container className="py-10">
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        <div className="border-b border-[var(--border)] pb-6">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
            Dashboard
          </span>
          <h1 className="mt-2 text-4xl font-bold tracking-[-0.03em]">
            Upload a note
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Your note will be reviewed by an admin before it appears publicly.
          </p>
        </div>

        {success && (
          <Alert variant="success">
            "{success.title}" was uploaded and is now pending review.{" "}
            <button
              className="underline"
              onClick={() => navigate("/uploads")}
              type="button"
            >
              View upload history
            </button>
          </Alert>
        )}

        {loadError && <Alert variant="warning">{loadError}</Alert>}

        <form
          className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6"
          onSubmit={handleSubmit}
          noValidate
        >
          {submitError && <Alert variant="error">{submitError}</Alert>}

          <Input
            label="Title"
            placeholder="Unit 3 — Data Structures Notes"
            value={form.title}
            onChange={setField("title")}
            error={errors.title}
          />

          <TextArea
            label="Description (optional)"
            rows={3}
            placeholder="What does this note cover?"
            value={form.description}
            onChange={setField("description")}
            error={errors.description}
          />

          <Select
            label="Department"
            value={form.deptId}
            onChange={setField("deptId")}
            error={errors.deptId}
          >
            <option value="">Select a department</option>
            {departments.map((dept) => (
              <option key={dept.deptId} value={dept.deptId}>
                {dept.deptName}
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
              {form.deptId ? "Select a subject" : "Select a department first"}
            </option>
            {subjectsForDept.map((subject) => (
              <option key={subject.subjectId} value={subject.subjectId}>
                {subject.subjectName}
              </option>
            ))}
          </Select>

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

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">PDF file</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="text-sm file:mr-3 file:rounded-[var(--radius-sm)] file:border-0 file:bg-[var(--surface-muted)] file:px-3 file:py-1.5 file:text-sm"
            />
            {file && (
              <p className="text-xs text-[var(--muted)]">
                {file.name} · {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            )}
            {errors.file && <p className="text-xs text-[var(--danger)]">{errors.file}</p>}
            <p className="text-xs text-[var(--muted)]">Max size 10 MB. PDF only.</p>
          </div>

          <Button type="submit" variant="accent" loading={submitting} className="mt-2">
            Submit for review
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default Upload;
