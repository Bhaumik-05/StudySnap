import Note from "../models/Note.js";

export const generateNoteId = async () => {
    const lastNote = await Note
        .findOne()
        .sort({ noteId: -1 })
        .select("noteId");

    return lastNote ? lastNote.noteId + 1 : 1;
};