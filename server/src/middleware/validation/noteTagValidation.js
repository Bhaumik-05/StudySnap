const noteIdRegex = /^[1-9][0-9]*$/;
const tagRegex = /^(red|blue|yellow)$/i;

export const validateNoteTag = (req, res, next) => {
    const { noteId } = req.params;
    const { tag } = req.body;

    // Validate noteId
    if (!noteId) {
        return res.status(400).json({
            success: false,
            message: "Note ID is required"
        });
    }

    if (!noteIdRegex.test(String(noteId))) {
        return res.status(400).json({
            success: false,
            message: "Note ID must be a positive integer"
        });
    }

    // Validate tag
    if (!tag || typeof tag !== "string") {
        return res.status(400).json({
            success: false,
            message: "Tag is required"
        });
    }

    const normalizedTag = tag.trim().toLowerCase();

    if (!tagRegex.test(normalizedTag)) {
        return res.status(400).json({
            success: false,
            message: "Tag can only be red, blue or yellow"
        });
    }

    // Pass normalized values forward
    req.params.noteId = Number(noteId);
    req.body.tag = normalizedTag;

    next();
};