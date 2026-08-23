import NoteTag from "../models/noteTag.js";
import Note from "../models/Note.js";

export const getUserTaggedNotesService = async (userId) => {

    // 1. Get all tags belonging to logged-in user
    const userTags = await NoteTag.find({
        userId: userId,
    }).sort({ createdAt: -1 });

    // No tagged notes
    if (userTags.length === 0) {
        return [];
    }

    // 2. Get note IDs
    const noteIds = userTags.map((item) => item.noteId);

    // 3. Get corresponding notes
    const notes = await Note.find({
        noteId: { $in: noteIds },
        status: "approved",
    });

    // 4. Create map for quick lookup
    const noteMap = new Map();

    notes.forEach((note) => {
        noteMap.set(note.noteId, note);
    });

    // 5. Combine note + user's personal tag
    const taggedNotes = [];

    userTags.forEach((item) => {

        const note = noteMap.get(item.noteId);

        if (!note) {
            return;
        }

        taggedNotes.push({
            noteId: note.noteId,
            title: note.title,
            description: note.description,
            semester: note.semester,
            deptId: note.deptId,
            subjectId: note.subjectId,
            pdfUrl: note.pdfUrl,

            // USER'S personal tag
            tag: item.tag,

            taggedDate: item.createdAt,
        });
    });

    // 6. Dutch National Flag Algorithm
    // RED -> BLUE -> YELLOW

    let low = 0;
    let mid = 0;
    let high = taggedNotes.length - 1;

    while (mid <= high) {

        if (taggedNotes[mid].tag === "red") {

            // RED → left
            [taggedNotes[low], taggedNotes[mid]] =
                [taggedNotes[mid], taggedNotes[low]];

            low++;
            mid++;

        } else if (taggedNotes[mid].tag === "blue") {

            // BLUE → middle
            mid++;

        } else if (taggedNotes[mid].tag === "yellow") {

            // YELLOW → right
            [taggedNotes[mid], taggedNotes[high]] =
                [taggedNotes[high], taggedNotes[mid]];

            high--;
        }
    }

    return taggedNotes;
};