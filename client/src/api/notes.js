import api from "../lib/api";

const ALLOWED_SEARCH_PARAMS = [
  "semester",
  "deptId",
  "subjectId",
  "search",
  "page",
  "limit",
];

/**
 * Builds a query object containing only meaningful values, since the
 * server rejects any query parameter it doesn't explicitly allow and
 * errors on empty numeric filters.
 */
function buildSearchParams(filters = {}) {
  const params = {};
  for (const key of ALLOWED_SEARCH_PARAMS) {
    const value = filters[key];
    if (value === undefined || value === null || value === "") continue;
    params[key] = value;
  }
  return params;
}

export async function searchNotes(filters) {
  const response = await api.get("/notes", {
    params: buildSearchParams(filters),
  });
  return response.data;
}

export async function getNoteById(noteId) {
  const response = await api.get(`/notes/${noteId}`);
  return response.data;
}

export async function uploadNote({
  file,
  title,
  description,
  semester,
  deptId,
  subjectId,
  uploadedBy,
}) {
  const formData = new FormData();
  formData.append("pdf", file);
  formData.append("title", title);
  if (description) formData.append("description", description);
  formData.append("semester", String(semester));
  formData.append("deptId", String(deptId));
  formData.append("subjectId", String(subjectId));
  formData.append("uploadedBy", uploadedBy);

  const response = await api.post("/notes", formData);
  return response.data;
}

export async function downloadNote(noteId) {
  const response = await api.get(`/notes/${noteId}/download`);
  return response.data;
}

export async function tagNote(noteId, tag) {
  const response = await api.patch(`/notes/${noteId}/tag`, { tag });
  return response.data;
}

export async function getTaggedNotes() {
  const response = await api.get("/notes/tagged");
  return response.data;
}
