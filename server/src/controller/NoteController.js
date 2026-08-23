import {
    createNoteService, getApprovedNotesService,
    getApprovedNotesByIdService, downloadNoteService
} from "../services/noteService.js";

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
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
            error: error.stack || "No stack trace available",
        });
    }
};

export const getApprovedNotes = async (req, res) => {
    try {
        const notes = await getApprovedNotesService();

        return res.status(200).json({
            success: true,
            count: notes.length,
            data: notes,
        });

    } catch (error) {
        console.error("Get approved notes failed:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch approved notes",
        });
    }
};

export const getApprovedNotesById = async (req, res) => {
    try {
        const noteId = req.params.noteId;

        console.log("Requested noteId:", noteId);

        const note = await getApprovedNotesByIdService(noteId);

        return res.status(200).json({
            success: true,
            data: note,
        });

    } catch (error) {
        console.error("Get approved note by ID failed:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to fetch note by ID",
        });
    }
};


export const downloadNote = async (req, res, next) => {
    try {
        const { noteId } = req.params;

        // Get logged-in user from authMiddleware
        const userId = req.user.userId;

        // Call service
        const result = await downloadNoteService(
            noteId,
            userId
        );

        return res.status(200).json({
            success: true,
            message: "Download authorized",
            data: result,
        });

    } catch (error) {
        console.error("Download note failed:", error);

        next(error);
    }
};

export const searchNotes = async (
    req,
    res,
    next
) => {

    try {

        const allowedQueryParams = [
            "semester",
            "deptId",
            "subjectId",
            "tag",
            "search",
            "page",
            "limit",
        ];

        const receivedQueryParams = Object.keys(req.query);

        const invalidParams = receivedQueryParams.filter(
            (param) => !allowedQueryParams.includes(param)
        );

        if (invalidParams.length > 0) {
            const error = new Error(
                `Invalid query parameter(s): ${invalidParams.join(", ")}`
            );

            error.statusCode = 400;

            throw error;
        }

        const {
            semester,
            deptId,
            subjectId,
            tag,
            search,
            page,
            limit,
        } = req.query;


        const result =
            await searchNotesService({
                semester,
                deptId,
                subjectId,
                tag,
                search,
                page,
                limit,
            });


        res.status(200).json({
            success: true,
            data: result.notes,
            pagination: result.pagination,
        });

    } catch (error) {

        next(error);

    }
};

export const assignNoteTag = async (req, res, next) => {
    try {
        const { noteId } = req.params;
        const { tag } = req.body;

        // Get user from JWT
        const userId = req.user.userId;

        const result = await assignNoteTagService(
            noteId,
            userId,
            tag
        );

        return res.status(200).json({
            success: true,
            message: "Tag assigned successfully",
            data: result,
        });

    } catch (error) {
        console.error("Assign note tag failed:", error);
        next(error);
    }
};