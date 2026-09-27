// Roles a user can self-register as. ADMIN accounts are provisioned
// directly in the database and cannot be created through the client.
export const REGISTERABLE_ROLES = ["STUDENT", "FACULTY"];

export const ROLES = {
  STUDENT: "STUDENT",
  FACULTY: "FACULTY",
  ADMIN: "ADMIN",
};

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

// Tag colors accepted by PATCH /notes/:noteId/tag
export const NOTE_TAGS = ["red", "blue", "yellow"];

export const NOTE_TAG_LABELS = {
  red: "Red",
  blue: "Blue",
  yellow: "Yellow",
};

export const NOTE_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB, matches multer limit

export const SEARCH_PAGE_SIZE = 12;
