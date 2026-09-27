import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/ui/Container";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { registerUser } from "../../api/auth";
import { fetchDepartments } from "../../api/departments";
import { getErrorMessage } from "../../lib/api";
import { REGISTERABLE_ROLES, SEMESTERS } from "../../lib/constants";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateMobile,
  validateSemester,
  validateDeptId,
} from "../../lib/validators";

const INITIAL_FORM = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "STUDENT",
  sem: "",
  mobile: "",
  deptId: "",
};

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [deptLoadError, setDeptLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchDepartments()
      .then((data) => {
        if (!cancelled) setDepartments(data.departments || []);
      })
      .catch((error) => {
        if (!cancelled) {
          setDeptLoadError(
            getErrorMessage(error, "Could not load departments."),
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setField = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Semester only applies to STUDENT; clear it if the role changes.
      if (field === "role" && value !== "STUDENT") {
        next.sem = "";
      }
      return next;
    });
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSubmitError("");
  };

  function validate() {
    const nextErrors = {};

    const nameError = validateName(form.name);
    if (nameError) nextErrors.name = nameError;

    const emailError = validateEmail(form.email);
    if (emailError) nextErrors.email = emailError;

    const passwordError = validatePassword(form.password);
    if (passwordError) nextErrors.password = passwordError;

    if (!nextErrors.password && form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Passwords do not match";
    } else if (!form.confirmPassword) {
      nextErrors.confirmPassword = "Confirm your password";
    }

    if (!REGISTERABLE_ROLES.includes(form.role)) {
      nextErrors.role = "Select a valid role";
    }

    if (form.role === "STUDENT") {
      const semError = validateSemester(form.sem, { required: true });
      if (semError) nextErrors.sem = semError;
    }

    const mobileError = validateMobile(form.mobile, { required: false });
    if (mobileError) nextErrors.mobile = mobileError;

    const deptError = validateDeptId(form.deptId, { required: true });
    if (deptError) nextErrors.deptId = deptError;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");

    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        deptId: Number(form.deptId),
      };
      if (form.role === "STUDENT") {
        payload.sem = Number(form.sem);
      }
      if (form.mobile.trim()) {
        payload.mobile = form.mobile.trim();
      }

      await registerUser(payload);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      setSubmitError(getErrorMessage(error, "Registration failed."));
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <Container className="flex min-h-[60svh] items-center justify-center">
        <Alert variant="success" className="max-w-md text-center">
          Account created successfully. Redirecting you to log in…
        </Alert>
      </Container>
    );
  }

return (
  <main className="min-h-screen overflow-hidden bg-[var(--background)]">
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Left: registration form */}
      <section className="relative min-h-screen border-r border-black/10 px-6 py-6 sm:px-10 lg:px-12">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-semibold tracking-tight"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-black text-white">
                S
              </span>

              <span className="text-lg">StudySnap</span>

              <span className="ml-1 rounded-full bg-white px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-black/60 shadow-sm ring-1 ring-black/10">
                Join
              </span>
            </Link>

            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
              Auth / 02
            </span>
          </div>

          {success ? (
            <div className="flex flex-1 items-center justify-center py-16">
              <Alert
                variant="success"
                className="w-full max-w-md rounded-sm border border-black/10 bg-[#dff3ed] p-6 text-center"
              >
                Account created successfully. Redirecting you to log in…
              </Alert>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-lg flex-1 py-10 lg:py-8">
              <div className="mb-7">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-black/40">
                  Start here
                </span>

                <h1 className="mt-3 text-[clamp(3.25rem,6vw,6rem)] font-black leading-[0.88] tracking-[-0.075em]">
                  Create
                  <br />
                  <span className="text-black/25">your snap.</span>
                </h1>

                <p className="mt-5 max-w-md text-sm leading-6 text-black/55">
                  Build your StudySnap profile and join a shared academic
                  workspace for notes, resources and collaborative learning.
                </p>
              </div>

              <div className="mb-7 h-px w-full bg-black/10" />

              <form
                className="grid gap-5 sm:grid-cols-2"
                onSubmit={handleSubmit}
                noValidate
              >
                {submitError && (
                  <div className="sm:col-span-2">
                    <Alert
                      variant="error"
                      className="rounded-sm border border-red-200 bg-red-50 text-sm"
                    >
                      {submitError}
                    </Alert>
                  </div>
                )}

                {deptLoadError && (
                  <div className="sm:col-span-2">
                    <Alert
                      variant="warning"
                      className="rounded-sm border border-amber-200 bg-amber-50 text-sm"
                    >
                      {deptLoadError}
                    </Alert>
                  </div>
                )}

                <div className="sm:col-span-2">
                  <Input
                    label="Full name"
                    name="name"
                    autoComplete="name"
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={setField("name")}
                    error={errors.name}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={setField("email")}
                    error={errors.email}
                  />
                </div>

                <Select
                  label="I am a"
                  name="role"
                  value={form.role}
                  onChange={setField("role")}
                  error={errors.role}
                >
                  {REGISTERABLE_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role.charAt(0) + role.slice(1).toLowerCase()}
                    </option>
                  ))}
                </Select>

                <Select
                  label="Department"
                  name="deptId"
                  value={form.deptId}
                  onChange={setField("deptId")}
                  error={errors.deptId}
                  disabled={departments.length === 0}
                >
                  <option value="">Select a department</option>

                  {departments.map((dept) => (
                    <option key={dept.deptId} value={dept.deptId}>
                      {dept.deptName}
                    </option>
                  ))}
                </Select>

                {form.role === "STUDENT" && (
                  <div className="sm:col-span-2">
                    <Select
                      label="Semester"
                      name="sem"
                      value={form.sem}
                      onChange={setField("sem")}
                      error={errors.sem}
                    >
                      <option value="">Select a semester</option>

                      {SEMESTERS.map((sem) => (
                        <option key={sem} value={sem}>
                          Semester {sem}
                        </option>
                      ))}
                    </Select>
                  </div>
                )}

                <div className="sm:col-span-2">
                  <Input
                    label="Mobile number (optional)"
                    name="mobile"
                    type="tel"
                    placeholder="9876543210"
                    value={form.mobile}
                    onChange={setField("mobile")}
                    error={errors.mobile}
                    hint="10 digits, no spaces or dashes"
                  />
                </div>

                <Input
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={setField("password")}
                  error={errors.password}
                  hint="8+ characters with uppercase, lowercase, number and symbol"
                />

                <Input
                  label="Confirm password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={setField("confirmPassword")}
                  error={errors.confirmPassword}
                />

                <div className="sm:col-span-2">
                  <Button
                    type="submit"
                    variant="accent"
                    loading={submitting}
                    className="mt-1 min-h-14 w-full rounded-sm bg-black px-6 text-sm font-bold uppercase tracking-[0.08em] text-white transition-all hover:bg-black/90 hover:shadow-[6px_6px_0_0_var(--accent)]"
                  >
                    Create account
                  </Button>
                </div>
              </form>

              <div className="mt-7 flex items-center justify-between gap-4 text-xs">
                <span className="text-black/45">
                  Already have an account?
                </span>

                <Link
                  to="/login"
                  className="font-semibold underline decoration-black/20 underline-offset-4 transition-colors hover:text-black hover:decoration-black"
                >
                  Log in
                </Link>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-end justify-between gap-6 pt-5 text-[10px] font-mono uppercase tracking-[0.16em] text-black/35">
            <span>StudySnap / Build your workspace</span>
            <span>02 / 02</span>
          </div>
        </div>
      </section>

      {/* Right: editorial StudySnap panel */}
      <section className="relative hidden min-h-screen overflow-hidden bg-[#f4eadb] lg:flex">
        <div className="absolute left-10 top-6 z-10 text-[clamp(4rem,8vw,8rem)] font-black leading-none tracking-[-0.08em] text-black">
          02
        </div>

        <div className="absolute right-10 top-8 z-10 rounded-full bg-white/70 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-black/60 backdrop-blur-sm">
          Build your academic identity
        </div>

        <div className="relative flex w-full items-center justify-center p-14">
          <div className="relative aspect-square w-[min(72%,580px)]">
            {/* background sheet */}
            <div className="absolute inset-[10%] rounded-[2.5rem] bg-[#ebe0ce] rotate-[6deg]" />

            <div className="absolute inset-[7%] rounded-[2.5rem] bg-white rotate-[-5deg] shadow-[25px_30px_80px_rgba(17,17,17,0.12)]" />

            {/* profile sheet */}
            <div className="absolute left-[15%] top-[14%] w-[70%] rounded-sm bg-[#9ff5df] p-7 shadow-[0_30px_70px_rgba(17,17,17,0.16)] rotate-[2deg]">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-black/45">
                    StudySnap ID
                  </div>

                  <div className="mt-2 text-3xl font-black tracking-[-0.06em]">
                    READY
                  </div>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-xl font-black text-white">
                  +
                </div>
              </div>

              <div className="mt-12 space-y-4">
                <div>
                  <div className="font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-black/40">
                    Learn
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-black/10" />
                </div>

                <div>
                  <div className="font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-black/40">
                    Organise
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-black/10" />
                </div>

                <div>
                  <div className="font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-black/40">
                    Share
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-black/10" />
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#ff6b61] px-3 py-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-white">
                  notes
                </span>

                <span className="rounded-full bg-black px-3 py-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-white">
                  pdfs
                </span>

                <span className="rounded-full bg-white px-3 py-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-black">
                  tags
                </span>
              </div>
            </div>

            {/* floating academic labels */}
            <div className="absolute left-[2%] top-[20%] rounded-full bg-black px-5 py-3 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white shadow-lg rotate-[-9deg]">
              Student
            </div>

            <div className="absolute right-[2%] top-[28%] rounded-full bg-white px-5 py-3 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-black shadow-lg rotate-[8deg]">
              Faculty
            </div>

            <div className="absolute bottom-[12%] left-[9%] rounded-full bg-[#f1c453] px-5 py-3 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-black shadow-lg rotate-[5deg]">
              Semester aware
            </div>

            <div className="absolute bottom-[7%] right-[7%] rounded-sm bg-white p-5 shadow-[0_20px_50px_rgba(17,17,17,0.1)] rotate-[-6deg]">
              <div className="font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-black/40">
                Keep everything
              </div>
              <div className="mt-1 text-lg font-black tracking-[-0.04em]">
                in one place.
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-7 left-10 right-10 flex items-end justify-between gap-8">
          <div className="max-w-md">
            <p className="text-[clamp(1.7rem,3vw,3.2rem)] font-black leading-[0.95] tracking-[-0.06em]">
              Your notes.
              <br />
              Your system.
            </p>
          </div>

          <div className="max-w-[180px] text-right font-mono text-[9px] font-bold uppercase leading-4 tracking-[0.15em] text-black/45">
            Student
            <br />
            Faculty
            <br />
            Department
            <br />
            Semester
          </div>
        </div>
      </section>
    </div>
  </main>
);

}

export default Register;
