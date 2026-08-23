import Note from "../models/Note.js";
import DownloadHistory from "../models/downloadHistory.js";

export const getUserDownloadHistoryService = async (userId) => {

    // 1. Get user's download history
    const history = await DownloadHistory.find({
        userId: userId,
    }).sort({
        downloadDate: -1,
    });

    // 2. No downloads
    if (history.length === 0) {
        return [];
    }

    // 3. Extract note IDs
    // noteId is Number
    const noteIds = history.map((item) => item.noteId);

    // 4. Find corresponding notes
    const notes = await Note.find({
        noteId: {
            $in: noteIds,
        },
    });

    // 5. Combine history + note information
    const result = history.map((item) => {

        const note = notes.find(
            (note) => note.noteId === item.noteId
        );

        if (!note) {
            return null;
        }

        return {
            noteId: note.noteId,
            title: note.title,
            description: note.description,
            tag: note.tag,
            semester: note.semester,
            deptId: note.deptId,
            subjectId: note.subjectId,
            pdfUrl: note.pdfUrl,
            downloadDate: item.downloadDate,
        };
    });

    return result.filter(Boolean);
};