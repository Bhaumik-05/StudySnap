import { useEffect, useState } from "react";
import Container from "../../components/ui/Container";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { useAuth } from "../../context/AuthContext";
import { updateCurrentUser } from "../../api/users";
import { getErrorMessage } from "../../lib/api";
import { ROLES, SEMESTERS } from "../../lib/constants";
import {
  validateName,
  validateMobile,
  validateSemester,
  validatePassword,
} from "../../lib/validators";
import { roleLabel } from "../../lib/format";

function Profile() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [sem, setSem] = useState(user?.sem ? String(user.sem) : "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setName(user?.name || "");
    setMobile(user?.mobile || "");
    setSem(user?.sem ? String(user.sem) : "");
  }, [user]);

  function buildChanges() {
    const changes = {};
    if (name.trim() !== user.name) changes.name = name.trim();
    if (mobile.trim() !== (user.mobile || "")) changes.mobile = mobile.trim();
    if (user.role === ROLES.STUDENT && sem && Number(sem) !== user.sem) {
      changes.sem = Number(sem);
    }
    if (password) changes.password = password;
    return changes;
  }

  function validate(changes) {
    const nextErrors = {};

    if ("name" in changes) {
      const err = validateName(changes.name);
      if (err) nextErrors.name = err;
    }
    if ("mobile" in changes && changes.mobile) {
      const err = validateMobile(changes.mobile, { required: false });
      if (err) nextErrors.mobile = err;
    }
    if ("sem" in changes) {
      const err = validateSemester(changes.sem, { required: true });
      if (err) nextErrors.sem = err;
    }
    if ("password" in changes) {
      const err = validatePassword(changes.password);
      if (err) nextErrors.password = err;
      else if (password !== confirmPassword) {
        nextErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");
    setSuccessMessage("");

    const changes = buildChanges();
    if (Object.keys(changes).length === 0) {
      setSubmitError("Change at least one field before saving.");
      return;
    }
    if (!validate(changes)) return;

    setSubmitting(true);
    try {
      const response = await updateCurrentUser(changes);
      updateUser(response.data);
      setPassword("");
      setConfirmPassword("");
      setSuccessMessage("Profile updated successfully.");
    } catch (error) {
      setSubmitError(getErrorMessage(error, "Could not update profile."));
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) return null;

  return (
    <Container className="py-10">
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        <div className="border-b border-[var(--border)] pb-6">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
            Dashboard
          </span>
          <h1 className="mt-2 text-4xl font-bold tracking-[-0.03em]">
            Your profile
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {roleLabel(user.role)} · {user.userId}
          </p>
        </div>

        <form
          className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6"
          onSubmit={handleSubmit}
          noValidate
        >
          {submitError && <Alert variant="error">{submitError}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}

          <Input label="Email" value={user.email} disabled hint="Email cannot be changed." />

          <Input
            label="Full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            error={errors.name}
          />

          <Input
            label="Mobile number"
            value={mobile}
            onChange={(event) => setMobile(event.target.value)}
            error={errors.mobile}
            hint="10 digits, no spaces or dashes"
          />

          <Input
            label="Department"
            value={user.deptId ? `Department #${user.deptId}` : "—"}
            disabled
            hint="Contact an administrator to change your department."
          />

          {user.role === ROLES.STUDENT && (
            <Select
              label="Semester"
              value={sem}
              onChange={(event) => setSem(event.target.value)}
              error={errors.sem}
            >
              {SEMESTERS.map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </Select>
          )}

          <div className="border-t border-[var(--border)] pt-4">
            <p className="mb-3 text-sm font-medium">Change password</p>
            <div className="flex flex-col gap-4">
              <Input
                label="New password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                error={errors.password}
                placeholder="Leave blank to keep current password"
              />
              {password && (
                <Input
                  label="Confirm new password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  error={errors.confirmPassword}
                />
              )}
            </div>
          </div>

          <Button type="submit" variant="accent" loading={submitting} className="mt-2">
            Save changes
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default Profile;
