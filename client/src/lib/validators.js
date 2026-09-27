// These patterns intentionally mirror the regexes enforced by the
// server's validation middleware, so the client rejects (or accepts)
// exactly what the API will. Keep them in sync with the server if the
// server-side rules ever change.

export const NAME_REGEX = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MOBILE_REGEX = /^[0-9]{10}$/;
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const DEPT_NAME_REGEX = /^[A-Za-z]+(?:[ &-][A-Za-z]+)*$/;
export const SUBJECT_NAME_REGEX = /^[A-Za-z]+(?:[ &-][A-Za-z]+)*$/;

export const NOTE_TITLE_REGEX = /^[A-Za-z0-9]+(?:[ :&'().,-][A-Za-z0-9]+)*$/;

export const POSITIVE_INT_REGEX = /^[1-9][0-9]*$/;

export function isPositiveInteger(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0;
}

export function validateName(value) {
  if (!value || !value.trim()) return "Name is required";
  if (!NAME_REGEX.test(value.trim())) {
    return "Name can only contain letters and single spaces between words";
  }
  return null;
}

export function validateEmail(value) {
  if (!value || !value.trim()) return "Email is required";
  if (!EMAIL_REGEX.test(value.trim())) return "Enter a valid email address";
  return null;
}

export function validatePassword(value) {
  if (!value) return "Password is required";
  if (!PASSWORD_REGEX.test(value)) {
    return "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number and a special character (@$!%*?&)";
  }
  return null;
}

export function validateLoginPassword(value) {
  if (!value) return "Password is required";
  return null;
}

export function validateMobile(value, { required = false } = {}) {
  if (!value || !value.trim()) {
    return required ? "Mobile number is required" : null;
  }
  if (!MOBILE_REGEX.test(value.trim())) {
    return "Mobile number must contain exactly 10 digits";
  }
  return null;
}

export function validateSemester(value, { required = true } = {}) {
  if (value === undefined || value === null || value === "") {
    return required ? "Semester is required" : null;
  }
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 8) {
    return "Semester must be an integer between 1 and 8";
  }
  return null;
}

export function validateDeptId(value, { required = true } = {}) {
  if (value === undefined || value === null || value === "") {
    return required ? "Department is required" : null;
  }
  if (!isPositiveInteger(value)) return "Select a valid department";
  return null;
}

export function validateDeptName(value) {
  if (!value || !value.trim()) return "Department name is required";
  if (!DEPT_NAME_REGEX.test(value.trim())) {
    return "Department name can only contain letters, spaces, '&' and '-'";
  }
  return null;
}

export function validateSubjectName(value) {
  if (!value || !value.trim()) return "Subject name is required";
  if (!SUBJECT_NAME_REGEX.test(value.trim())) {
    return "Subject name can only contain letters, spaces, '&' and '-'";
  }
  return null;
}

export function validateSubjectDeptIds(value) {
  if (!Array.isArray(value) || value.length === 0) {
    return "Select at least one department";
  }
  if (!value.every((id) => isPositiveInteger(id))) {
    return "Department IDs must be valid";
  }
  return null;
}

export function validateNoteTitle(value) {
  if (!value || !value.trim()) return "Title is required";
  const trimmed = value.trim();
  if (!NOTE_TITLE_REGEX.test(trimmed)) {
    return "Title can only contain letters, numbers, spaces and : & ' ( ) . , -";
  }
  // Server model caps titles at 100 characters; middleware allows up to
  // 150, but we hold the line at 100 so a valid-looking title never
  // fails on the model's stricter limit.
  if (trimmed.length < 3 || trimmed.length > 100) {
    return "Title must be between 3 and 100 characters";
  }
  return null;
}

export function validateNoteDescription(value) {
  if (!value) return null;
  if (value.length > 500) return "Description cannot exceed 500 characters";
  return null;
}

export function validatePdfFile(file) {
  if (!file) return "A PDF file is required";
  if (file.type !== "application/pdf") return "Only PDF files are allowed";
  if (file.size > 10 * 1024 * 1024) return "PDF size cannot exceed 10 MB";
  return null;
}

export function validateRejectionReason(value) {
  if (!value || !value.trim()) {
    return "A rejection reason is required when rejecting a note";
  }
  return null;
}
