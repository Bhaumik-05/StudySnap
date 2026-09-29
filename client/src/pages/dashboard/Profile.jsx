import { useEffect, useState } from "react";
import Container from "../../components/ui/Container";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { useAuth } from "../../context/AuthContext";
import { updateCurrentUser } from "../../api/users";
import { fetchDepartments } from "../../api/departments";
import { getErrorMessage } from "../../lib/api";
import { ROLES, SEMESTERS } from "../../lib/constants";
import {
  validateName,
  validateMobile,
  validateSemester,
  validatePassword,
} from "../../lib/validators";
import { roleLabel } from "../../lib/format";

// =========================================================
// TITLE CASE
// =========================================================
function formatTitleCase(value) {
  if (!value) return "—";

  return value
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function Profile() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [sem, setSem] = useState(user?.sem ? String(user.sem) : "");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // =========================================================
  // DEPARTMENTS
  // =========================================================
  const [departments, setDepartments] = useState([]);

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // =========================================================
  // LOAD DEPARTMENTS
  // =========================================================
  useEffect(() => {
    async function loadDepartments() {
      try {
        const response = await fetchDepartments();

        const departmentList = Array.isArray(response)
          ? response
          : Array.isArray(response?.departments)
            ? response.departments
            : Array.isArray(response?.data)
              ? response.data
              : [];

        setDepartments(departmentList);
      } catch (error) {
        console.error("Could not load departments:", error);
        setDepartments([]);
      }
    }

    loadDepartments();
  }, []);

  // =========================================================
  // UPDATE FORM WHEN USER CHANGES
  // =========================================================
  useEffect(() => {
    setName(user?.name || "");
    setMobile(user?.mobile || "");
    setSem(user?.sem ? String(user.sem) : "");
  }, [user]);

  // =========================================================
  // GET DEPARTMENT NAME FROM DEPARTMENT ID
  // =========================================================
  const departmentName = formatTitleCase(
    departments.find(
      (department) =>
        String(department.deptId) === String(user?.deptId)
    )?.deptName
  );

  // =========================================================
  // BUILD CHANGES
  // =========================================================
  function buildChanges() {
    const changes = {};

    if (name.trim() !== user.name) {
      changes.name = name.trim();
    }

    if (mobile.trim() !== (user.mobile || "")) {
      changes.mobile = mobile.trim();
    }

    if (
      user.role === ROLES.STUDENT &&
      sem &&
      Number(sem) !== user.sem
    ) {
      changes.sem = Number(sem);
    }

    if (password) {
      changes.password = password;
    }

    return changes;
  }

  // =========================================================
  // VALIDATE
  // =========================================================
  function validate(changes) {
    const nextErrors = {};

    if ("name" in changes) {
      const err = validateName(changes.name);

      if (err) {
        nextErrors.name = err;
      }
    }

    if ("mobile" in changes && changes.mobile) {
      const err = validateMobile(changes.mobile, {
        required: false,
      });

      if (err) {
        nextErrors.mobile = err;
      }
    }

    if ("sem" in changes) {
      const err = validateSemester(changes.sem, {
        required: true,
      });

      if (err) {
        nextErrors.sem = err;
      }
    }

    if ("password" in changes) {
      const err = validatePassword(changes.password);

      if (err) {
        nextErrors.password = err;
      } else if (password !== confirmPassword) {
        nextErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  // =========================================================
  // SUBMIT
  // =========================================================
  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitError("");
    setSuccessMessage("");

    const changes = buildChanges();

    if (Object.keys(changes).length === 0) {
      setSubmitError("Change at least one field before saving.");
      return;
    }

    if (!validate(changes)) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await updateCurrentUser(changes);

      updateUser(response.data);

      setPassword("");
      setConfirmPassword("");
      setErrors({});

      setSuccessMessage("Profile updated successfully.");
    } catch (error) {
      setSubmitError(
        getErrorMessage(error, "Could not update profile.")
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) {
    return null;
  }

  return (
    <Container className="py-8 sm:py-12">
      {/* =====================================================
          HEADER
          ===================================================== */}
      <header className="relative overflow-hidden border-b border-[var(--border)] pb-10">
        <div
          className="
            pointer-events-none
            absolute
            -right-4
            -top-12
            select-none
            text-[clamp(8rem,18vw,16rem)]
            font-black
            leading-none
            tracking-[-0.13em]
            text-[var(--surface-muted)]
          "
        >
          05
        </div>

        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span
              className="
                font-mono
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-[var(--muted)]
              "
            >
              StudySnap / Account
            </span>

            <span
              className="
                font-mono
                text-[9px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-[var(--muted-light)]
              "
            >
              Profile / 05
            </span>
          </div>

          <div className="mt-12 max-w-5xl">
            <span
              className="
                font-mono
                text-[10px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-[var(--muted-light)]
              "
            >
              Personal workspace
            </span>

            <h1
              className="
                mt-3
                text-[clamp(4rem,10vw,8rem)]
                font-black
                leading-[0.82]
                tracking-[-0.09em]
              "
            >
              Your profile.
            </h1>

            <p
              className="
                mt-8
                max-w-2xl
                text-sm
                leading-7
                text-[var(--muted)]
                sm:text-base
              "
            >
              Manage your account information and keep your
              StudySnap profile up to date.
            </p>
          </div>
        </div>
      </header>

      {/* =====================================================
          PROFILE AREA
          ===================================================== */}
      <div className="grid gap-14 py-12 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* ===================================================
            LEFT INFORMATION COLUMN
            =================================================== */}
        <aside>
          <div className="lg:sticky lg:top-8">
            <div className="flex items-center gap-3">
              <span
                className="
                  font-mono
                  text-[10px]
                  font-bold
                  tracking-[0.16em]
                  text-[var(--muted-light)]
                "
              >
                05.1
              </span>

              <span className="h-px w-8 bg-[var(--border)]" />

              <span
                className="
                  font-mono
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-[var(--muted)]
                "
              >
                Account
              </span>
            </div>

            <div className="mt-6 border-t border-[var(--foreground)] pt-5">
              <h2
                className="
                  text-3xl
                  font-black
                  tracking-[-0.05em]
                "
              >
                Personal details
              </h2>

              <p
                className="
                  mt-3
                  text-sm
                  leading-6
                  text-[var(--muted)]
                "
              >
                Update the information associated with your
                StudySnap account.
              </p>
            </div>

            {/* Account ID */}
            <div className="mt-8 border-t border-[var(--border)] pt-5">
              <span
                className="
                  font-mono
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-[var(--muted-light)]
                "
              >
                Account ID
              </span>

              <p className="mt-2 font-mono text-xs font-bold">
                {user.userId}
              </p>
            </div>

            {/* Role */}
            <div className="mt-6 border-t border-[var(--border)] pt-5">
              <span
                className="
                  font-mono
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-[var(--muted-light)]
                "
              >
                Role
              </span>

              <p className="mt-2 text-sm font-semibold">
                {roleLabel(user.role)}
              </p>
            </div>

            {/* Department */}
            <div className="mt-6 border-t border-[var(--border)] pt-5">
              <span
                className="
                  font-mono
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-[var(--muted-light)]
                "
              >
                Department
              </span>

              <p className="mt-2 text-sm font-semibold">
                {departmentName}
              </p>
            </div>
          </div>
        </aside>

        {/* ===================================================
            FORM
            =================================================== */}
        <main>
          <div className="border-t border-[var(--foreground)] pt-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span
                  className="
                    font-mono
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-[var(--muted-light)]
                  "
                >
                  05.2 / Edit
                </span>

                <h2
                  className="
                    mt-2
                    text-3xl
                    font-black
                    tracking-[-0.05em]
                    sm:text-4xl
                  "
                >
                  Update information
                </h2>
              </div>

              <span
                className="
                  font-mono
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-[var(--muted-light)]
                "
              >
                Account settings
              </span>
            </div>
          </div>

          <form
            className="mt-8"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* =================================================
                MESSAGES
                ================================================= */}
            {(submitError || successMessage) && (
              <div className="mb-8">
                {submitError && (
                  <Alert variant="error">
                    {submitError}
                  </Alert>
                )}

                {successMessage && (
                  <Alert variant="success">
                    {successMessage}
                  </Alert>
                )}
              </div>
            )}

            {/* =================================================
                EMAIL
                ================================================= */}
            <div className="border-b border-[var(--border)] py-7">
              <Input
                label="Email"
                value={user.email}
                disabled
                hint="Email cannot be changed."
              />
            </div>

            {/* =================================================
                FULL NAME
                ================================================= */}
            <div className="border-b border-[var(--border)] py-7">
              <Input
                label="Full name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                error={errors.name}
              />
            </div>

            {/* =================================================
                MOBILE
                ================================================= */}
            <div className="border-b border-[var(--border)] py-7">
              <Input
                label="Mobile number"
                value={mobile}
                onChange={(event) =>
                  setMobile(event.target.value)
                }
                error={errors.mobile}
                hint="10 digits, no spaces or dashes"
              />
            </div>

            {/* =================================================
                DEPARTMENT
                ================================================= */}
            <div className="border-b border-[var(--border)] py-7">
              <Input
                label="Department"
                value={departmentName}
                disabled
                hint="Contact an administrator to change your department."
              />
            </div>

            {/* =================================================
                SEMESTER
                ================================================= */}
            {user.role === ROLES.STUDENT && (
              <div className="border-b border-[var(--border)] py-7">
                <Select
                  label="Semester"
                  value={sem}
                  onChange={(event) =>
                    setSem(event.target.value)
                  }
                  error={errors.sem}
                >
                  {SEMESTERS.map((semester) => (
                    <option
                      key={semester}
                      value={semester}
                    >
                      Semester {semester}
                    </option>
                  ))}
                </Select>
              </div>
            )}

            {/* =================================================
                PASSWORD
                ================================================= */}
            <div className="border-b border-[var(--border)] py-8">
              <div className="mb-6">
                <span
                  className="
                    font-mono
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-[var(--muted-light)]
                  "
                >
                  05.3 / Security
                </span>

                <h3
                  className="
                    mt-2
                    text-2xl
                    font-black
                    tracking-[-0.04em]
                  "
                >
                  Change password
                </h3>

                <p
                  className="
                    mt-2
                    max-w-xl
                    text-sm
                    leading-6
                    text-[var(--muted)]
                  "
                >
                  Leave the password fields blank if you want
                  to keep your current password.
                </p>
              </div>

              <div className="flex flex-col gap-7">
                <Input
                  label="New password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  error={errors.password}
                  placeholder="Leave blank to keep current password"
                />

                {password && (
                  <Input
                    label="Confirm new password"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    error={errors.confirmPassword}
                  />
                )}
              </div>
            </div>

            {/* =================================================
                SAVE
                ================================================= */}
            <div
              className="
                mt-8
                flex
                flex-col
                gap-5
                border-t
                border-[var(--foreground)]
                pt-6
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div>
                <span
                  className="
                    font-mono
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-[var(--muted-light)]
                  "
                >
                  Save changes
                </span>

                <p
                  className="
                    mt-1
                    text-xs
                    text-[var(--muted)]
                  "
                >
                  Your updated information will be reflected
                  across StudySnap.
                </p>
              </div>

              <Button
                type="submit"
                variant="accent"
                loading={submitting}
                className="
                  min-w-[190px]
                  px-8
                  py-3
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.14em]
                "
              >
                Save changes →
              </Button>
            </div>
          </form>
        </main>
      </div>

      {/* =====================================================
          FOOTER
          ===================================================== */}
      <footer
        className="
          flex
          items-center
          justify-between
          border-t
          border-[var(--border)]
          pt-5
          font-mono
          text-[9px]
          font-bold
          uppercase
          tracking-[0.16em]
          text-[var(--muted-light)]
        "
      >
        <span>StudySnap / Profile</span>
        <span>05 / 05</span>
      </footer>
    </Container>
  );
}

export default Profile;