import createNoteService from "../services/noteService.js";

export const createNote = async (req, res) => {
    try {
        const {
            title, description, tag,
            semester, deptId, subjectId,
            uploadedBy,
        } = req.body;

        console.log("REQ.BODY:", req.body);
        console.log("REQ.FILE:", req.file);

        // Call service
        const note = await createNoteService({
            file: req.file,
            title,
            description,
            tag,
            semester,
            deptId,
            subjectId,
            uploadedBy,
        });

        // Response
        return res.status(201).json({
            success: true,
            message: "Note uploaded successfully",
            data: note,
        });

    } catch (error) {
        console.error("Create note failed:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create note",
            error: error.message,
        });
    }
};