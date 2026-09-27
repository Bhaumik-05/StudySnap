import api from "../lib/api";

export async function fetchPendingNotes() {
  const response = await api.get("/admin/notes/pending");
  return response.data;
}

export async function fetchRejectedNotes() {
  const response = await api.get("/admin/notes/rejected");
  return response.data;
}

export async function updateNoteStatus(id, { status, rejectionReason }) {
  const response = await api.patch(`/admin/notes/${id}/status`, {
    status,
    rejectionReason,
  });
  return response.data;
}
